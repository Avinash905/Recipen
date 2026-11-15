const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Session = require("../models/sessionModel");
const { lifetime, hash, secret, tokenParts, accessToken, userProfile, issueSession, setCookie } = require("../utils/sessionTokens");
const { normalizeEmail, validEmail, validName, validPassword } = require("../utils/accountValidation");

const register = async (req, res, next) => {
  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!validName(name) || !validEmail(email) || !validPassword(password)) {
    return res.status(400).json({ message: "Enter a valid name, email, and password of at least 8 characters (maximum 72 bytes)." });
  }

  try {
    const duplicate = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
    if (duplicate) return res.status(409).json({ message: "Email already in use" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User({
      name: name.trim(),
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ success: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Email already in use" });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    if (!validEmail(email) || typeof password !== "string" || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const foundUser = await User.findOne({ email }).collation({ locale: "en", strength: 2 }).select("+password");
    if (!foundUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (foundUser.isDisabled) {
      return res.status(403).json({ message: "Account terminated" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const issued = await issueSession(foundUser);
    setCookie(res, issued.refresh);
    res.json({ accessToken: accessToken(foundUser, issued.sessionId), user: userProfile(foundUser) });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    // A cross-site image or other no-CORS navigation must not rotate a browser cookie.
    if (req.get("Sec-Fetch-Site") === "cross-site" && ["no-cors", "navigate"].includes(req.get("Sec-Fetch-Mode"))) return res.status(403).json({ message: "Forbidden" });
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    let bearer;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      try { bearer = jwt.verify(req.headers.authorization.slice(7), process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true }).UserInfo; }
      catch (error) { if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") throw error; }
    }
    const parts = tokenParts(token);
    if (parts) {
      if (!parts.logoutSecret) return res.status(403).json({ message: "Please sign in again to continue." });
      if (bearer?.sessionId && bearer.sessionId !== parts.id) return res.status(403).json({ message: "Session changed. Please sign in again." });
      if (bearer?.userId && !bearer.sessionId && !(await Session.exists({ _id: parts.id, user: bearer.userId }))) return res.status(403).json({ message: "Session changed. Please sign in again." });
      const nextSecret = secret();
      const session = await Session.findOneAndUpdate(
        { _id: parts.id, tokenHash: hash(parts.secret), logoutHash: hash(parts.logoutSecret), revoked: { $ne: true }, expiresAt: { $gt: new Date() } },
        { $set: { tokenHash: hash(nextSecret), expiresAt: new Date(Date.now() + lifetime) } },
        { new: true }
      );
      if (!session) return res.status(403).json({ message: "Forbidden" });
      const user = await User.findById(session.user);
      if (!user || user.isDisabled || session.tokenVersion === undefined || session.tokenVersion !== (user.tokenVersion || 0)) {
        await Session.deleteOne({ _id: session._id });
        return res.status(403).json({ message: "Forbidden" });
      }
      setCookie(res, `${session._id}.${nextSecret}.${parts.logoutSecret}`);
      return res.json({ accessToken: accessToken(user, session._id), user: userProfile(user) });
    }
    return res.status(403).json({ message: "Please sign in again to continue." });
  } catch (error) { next(error); }
};

const revokeSession = async (filter) => {
  const session = await Session.findOneAndUpdate(filter, { $set: { revoked: true } }, { new: true });
  if (!session) return false;
  await User.updateOne({ _id: session.user }, { $inc: { sessionRevision: 1 } });
  await Session.deleteOne({ _id: session._id, revoked: true });
  return true;
};

const logout = async (req, res, next) => {
  try {
    if (req.get("Sec-Fetch-Site") === "cross-site" && ["no-cors", "navigate"].includes(req.get("Sec-Fetch-Mode"))) return res.status(403).json({ message: "Forbidden" });
    const parts = tokenParts(req.cookies?.jwt);
    let info;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(req.headers.authorization.slice(7), process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true });
        info = decoded.UserInfo || {};
        if (info.sessionId) await revokeSession({ _id: info.sessionId, user: info.userId });
        else {
          const version = info.tokenVersion || 0;
          await User.findOneAndUpdate({ _id: info.userId, ...(version === 0 ? { $or: [{ tokenVersion: 0 }, { tokenVersion: { $exists: false } }] } : { tokenVersion: version }) }, { $set: { refreshToken: [] }, $inc: { tokenVersion: 1 } });
        }
      } catch (error) { if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") throw error; }
    }
    let clearCookie = !info || !req.cookies?.jwt;
    if (parts) {
      const cookieFilter = parts.logoutSecret
        ? { _id: parts.id, logoutHash: hash(parts.logoutSecret) }
        : { _id: parts.id, $or: [{ tokenHash: hash(parts.secret) }, { previousTokenHash: hash(parts.secret) }] };
      if (info?.sessionId) cookieFilter._id = info.sessionId === parts.id ? parts.id : null;
      else if (info?.userId) cookieFilter.user = info.userId;
      const deleted = await revokeSession(cookieFilter);
      clearCookie = !info || deleted || info.sessionId === parts.id;
    } else if (req.cookies?.jwt && !info?.sessionId) {
      const filter = { refreshToken: req.cookies.jwt };
      if (info?.userId) filter._id = info.userId;
      const revoked = await User.findOneAndUpdate(filter, { $set: { refreshToken: [] }, $inc: { tokenVersion: 1 } });
      clearCookie = !info || Boolean(revoked);
    }
    if (clearCookie) res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  } catch (error) { next(error); }
};

module.exports = { register, login, refreshToken, logout };
