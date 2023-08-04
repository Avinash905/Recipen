const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Minimum length of name should be 5 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be at least 6 characters"],
    },
    profilePicture: { type: String },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    isAdmin: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);
module.exports = User;
