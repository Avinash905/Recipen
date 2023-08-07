const User = require("../models/userModel");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ updatedAt: -1 })
      .select(["-password", "-refreshToken", "-favorites"]);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id });
    res.status(204).json({ success: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };
