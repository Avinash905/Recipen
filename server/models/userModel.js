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
      select: false,
    },
    profilePicture: { type: String, default: "" },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    roles: {
      type: [String],
      default: ["BasicUser"],
    },
    isDisabled: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    sessionRevision: { type: Number, default: 0 },
    accountDataRevision: { type: Number, default: 0 },
    refreshToken: { type: [String], select: false },
  },
  {
    timestamps: true,
  }
);

schema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 }, name: "email_case_insensitive_unique" });

const User = mongoose.model("User", schema);
module.exports = User;
