const { parsePage, literalSearch } = require("../utils/pagination");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");
const bcrypt = require("bcrypt");
const { accessToken, userProfile } = require("../utils/sessionTokens");
const { normalizeEmail, validEmail, validName, validPassword } = require("../utils/accountValidation");

const getAllUsers = async (req, res, next) => {
  try {
    if (req.query.page !== undefined) {
      const { page, limit, search } = parsePage(req.query);
      const filter = { _id: { $ne: req.user } };
      if (search) filter.$or = [{ name: literalSearch(search) }, { email: literalSearch(search) }];
      const [items, total] = await Promise.all([
        User.find(filter).sort({ name: 1, _id: 1 }).skip((page - 1) * limit).limit(limit).select(["-password", "-refreshToken", "-favorites"]),
        User.countDocuments(filter),
      ]);
      return res.status(200).json({ items, total, page, limit });
    }
    const users = await User.find()
      .find({ _id: { $ne: req.user } })
      .select(["-password", "-refreshToken", "-favorites"]);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, password, currentPassword, image, removeProfilePicture } = req.body;
    const email = normalizeEmail(req.body.email);
    if (!validName(name) || !validEmail(email)) {
      return res.status(400).json({ message: "Enter a valid name and email." });
    }

    const foundUser = await User.findById(req.user).select("+password");
    if (!foundUser) return res.sendStatus(404);

    const duplicate = await User.findOne({ email, _id: { $ne: req.user } }).collation({ locale: "en", strength: 2 });
    if (duplicate) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const emailChanged = email !== normalizeEmail(foundUser.email);
    if (password || emailChanged) {
      if (typeof currentPassword !== "string" || !(await bcrypt.compare(currentPassword, foundUser.password))) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }
    }
    if (password) {
      if (!validPassword(password)) {
        return res.status(400).json({ message: "New password must be at least 8 characters and at most 72 bytes." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const version = req.tokenVersion;
      const versionFilter = version === 0 ? { $or: [{ tokenVersion: 0 }, { tokenVersion: { $exists: false } }] } : { tokenVersion: version };
      const revisionFilter = req.sessionRevision === 0 ? { $or: [{ sessionRevision: 0 }, { sessionRevision: { $exists: false } }] } : { sessionRevision: req.sessionRevision };
      const changed = await User.updateOne({ _id: foundUser._id, password: foundUser.password, isDisabled: { $ne: true }, $and: [versionFilter, revisionFilter] }, { $set: { password: hashedPassword, refreshToken: [] }, $inc: { tokenVersion: 1 } });
      if (!changed.modifiedCount) return res.status(409).json({ message: "Your account changed. Please sign in again and retry." });
      await Session.deleteMany({ user: foundUser._id, tokenVersion: { $ne: version + 1 } });
      return res.status(201).json({ message: "Password changed. Please sign in again." });
    }
    const fields = { name: name.trim(), email };
    if (removeProfilePicture === true) fields.profilePicture = "";
    else if (typeof image === "string" && image) fields.profilePicture = image;
    const versionFilter = req.tokenVersion === 0 ? { $or: [{ tokenVersion: 0 }, { tokenVersion: { $exists: false } }] } : { tokenVersion: req.tokenVersion };
    const updated = await User.findOneAndUpdate({ _id: foundUser._id, isDisabled: { $ne: true }, ...versionFilter }, { $set: fields, $inc: { accountDataRevision: 1 } }, { new: true });
    if (!updated) return res.status(409).json({ message: "Your account changed. Please sign in again and retry." });

    return res.status(201).json({ accessToken: accessToken({ ...updated.toObject(), tokenVersion: req.tokenVersion }, req.sessionId), user: userProfile(updated) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email already in use" });
    next(error);
  }
};

const disableUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.toString()) {
      return res.status(400).json({ message: "You cannot disable your own account." });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isDisabled: true, refreshToken: [] }, $inc: { tokenVersion: 1 } }
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    await Session.deleteMany({ user: user._id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const enableUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { isDisabled: false } });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.sendStatus(204);
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, updateUser, disableUser, enableUser };
