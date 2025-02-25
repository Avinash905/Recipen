const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        recipeName: {
            type: String,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        description: { type: String },
        image: { type: String },
        cookingTime: { type: String },
        difficultyLevel: { type: Number },
        ingredients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ingredient",
            },
        ],
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        instructions: [{ type: String }],
        additionalInformation: { type: String },
        ratings: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                rating: { type: Number },
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                comment: {
                    type: String,
                },
                date: {
                    type: Date,
                    default: Date.now(),
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Recipe = mongoose.model("Recipe", schema);
module.exports = Recipe;
