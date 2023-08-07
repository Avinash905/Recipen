const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    profilePicture: { type: String, default: "" },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    roles: {
      BasicUser: {
        type: Number,
        default: 101,
      },
      ProUser: {
        type: Number,
      },
      Admin: {
        type: Number,
      },
    },
    isDisabled: { type: Boolean, default: false },
    refreshToken: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);
module.exports = User;
