const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: { type: String },
    ingredients: [
      { type: String, required: [true, "Ingredients are required"] },
    ],
    cookingInstructions: [
      { type: String, required: [true, "Instructions are required"] },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;
