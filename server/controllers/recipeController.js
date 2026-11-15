const { parsePage, literalSearch } = require("../utils/pagination");
const mongoose = require("mongoose");
const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const { accessToken, userProfile } = require("../utils/sessionTokens");
const isNumeric = (value) => (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && Number.isFinite(Number(value));
const validText = (value, max) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
const validRows = (rows, max) => Array.isArray(rows) && rows.length > 0 && rows.length <= 100 && rows.every((item) => validText(item, max));

const getAllRecipes = async (req, res, next) => {
  try {
    if (req.query.page !== undefined) {
      const { page, limit, search } = parsePage(req.query);
      const filter = search ? { title: literalSearch(search) } : {};
      const [items, total] = await Promise.all([
        Recipe.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).populate("author", "name"),
        Recipe.countDocuments(filter),
      ]);
      return res.status(200).json({ items, total, page, limit });
    }
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
};

const getRecipe = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Recipe not found" });
    let query = Recipe.findOne({ _id: req.params.id }).populate("author", "name");
    query = req.query.includeComments === "false" ? query.select("-comments") : query.populate("comments.user", ["name", "profilePicture"]);
    const recipe = await query;

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).send(recipe);
  } catch (error) {
    next(error);
  }
};

const addRecipe = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      ingredients,
      instructions,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      calories === undefined || calories === null || calories === "" ||
      cookingTime === undefined || cookingTime === null || cookingTime === "" ||
      !Array.isArray(ingredients) || !ingredients.length ||
      !Array.isArray(instructions) || !instructions.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    if (!validText(title, 200) || !validText(description, 5000) || !validText(image, 2048) ||
        !isNumeric(calories) || Number(calories) < 0 || !isNumeric(cookingTime) || Number(cookingTime) <= 0 ||
        !validRows(ingredients, 500) || !validRows(instructions, 5000)) {
      return res.status(422).json({ message: "Enter a title, description, image, valid cooking values and up to 100 non-empty ingredients and steps." });
    }
    const recipe = Recipe({ title: title.trim(), image: image.trim(), description: description.trim(), calories, cookingTime, ingredients: ingredients.map((item) => item.trim()), instructions: instructions.map((item) => item.trim()), author: req.user });
    await recipe.save();
    res.status(201).json({ success: "Recipe added successfully" });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const {
      title,
      image,
      description,
      calories,
      cookingTime,
      ingredients,
      instructions,
    } = req.body;
    if (
      !title ||
      !image ||
      !description ||
      calories === undefined || calories === null || calories === "" ||
      cookingTime === undefined || cookingTime === null || cookingTime === "" ||
      !Array.isArray(ingredients) || !ingredients.length ||
      !Array.isArray(instructions) || !instructions.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    if (!validText(title, 200) || !validText(description, 5000) || !validText(image, 2048) ||
        !isNumeric(calories) || Number(calories) < 0 || !isNumeric(cookingTime) || Number(cookingTime) <= 0 ||
        !validRows(ingredients, 500) || !validRows(instructions, 5000)) {
      return res.status(422).json({ message: "Enter a title, description, image, valid cooking values and up to 100 non-empty ingredients and steps." });
    }

    const foundRecipe = await Recipe.findById(req.params.id);
    if (!foundRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (!foundRecipe.author?.equals(req.user) && !req.roles.includes("Admin"))
      return res.status(401).json({ message: "Unauthorized" });

    foundRecipe.title = title.trim();
    foundRecipe.description = description.trim();
    foundRecipe.image = image.trim();
    foundRecipe.calories = calories;
    foundRecipe.ingredients = ingredients.map((item) => item.trim());
    foundRecipe.cookingTime = cookingTime;
    foundRecipe.instructions = instructions.map((item) => item.trim());

    const updatedRecipe = await foundRecipe.save();
    res.status(201).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

const rateRecipe = async (req, res, next) => {
  try {
    const { rating } = req.body;
    if (typeof rating !== "number" || !Number.isFinite(rating) || rating < 0.25 || rating > 5 || rating * 4 !== Math.round(rating * 4)) {
      return res.status(400).json({ message: "Rating must be between 0.25 and 5 in quarter-star steps." });
    }

    let updated = await Recipe.findOneAndUpdate(
      { _id: req.params.id, "ratings.user": req.user },
      { $set: { "ratings.$.rating": rating } },
      { new: true }
    );
    if (!updated) {
      updated = await Recipe.findOneAndUpdate(
        { _id: req.params.id, "ratings.user": { $ne: req.user } },
        { $push: { ratings: { user: req.user, rating } } },
        { new: true }
      );
      // A concurrent first rating may have been inserted between the updates.
      if (!updated) updated = await Recipe.findOneAndUpdate(
        { _id: req.params.id, "ratings.user": req.user },
        { $set: { "ratings.$.rating": rating } },
        { new: true }
      );
    }
    if (!updated) return res.status(404).json({ message: "Recipe not found." });
    res.status(201).json({ message: "Rating saved successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const foundRecipe = await Recipe.findById(req.params.id);
    if (!foundRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (!foundRecipe.author?.equals(req.user) && !req.roles.includes("Admin"))
      return res.status(401).json({ message: "Unauthorized" });

    await foundRecipe.deleteOne();
    await User.updateMany({ favorites: foundRecipe._id }, { $pull: { favorites: foundRecipe._id }, $inc: { accountDataRevision: 1 } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    // Validate userId and commentText
    if (typeof comment !== "string" || !comment.trim() || comment.trim().length > 2000) {
      return res.status(400).json({ message: "Comment must be between 1 and 2000 characters." });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Add the new comment
    recipe.comments.push({ user: req.user, comment: comment.trim() });
    await recipe.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { recipeId, commentId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    const commentIndex = recipe.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (!recipe.comments[commentIndex].user?.equals(req.user) && !req.roles.includes("Admin")) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const toggleFavoriteRecipe = async (req, res, next) => {
  try {
    const { saved } = req.body;
    if (saved !== undefined && typeof saved !== "boolean") {
      return res.status(400).json({ message: "Saved must be true or false." });
    }
    const foundRecipe = await Recipe.exists({ _id: req.params.id });
    if (!foundRecipe) return res.status(404).json({ message: "Recipe not found." });
    const currentUser = await User.findById(req.user);
    if (!currentUser) return res.status(404).json({ message: "User not found." });
    const shouldSave = saved === undefined ? !currentUser.favorites.some((id) => id.toString() === req.params.id) : saved;
    const user = await User.findByIdAndUpdate(req.user,
      shouldSave ? { $addToSet: { favorites: foundRecipe._id }, $inc: { accountDataRevision: 1 } } : { $pull: { favorites: foundRecipe._id }, $inc: { accountDataRevision: 1 } },
      { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });
    if (shouldSave && !(await Recipe.exists({ _id: req.params.id }))) {
      await User.updateOne({ _id: req.user }, { $pull: { favorites: foundRecipe._id }, $inc: { accountDataRevision: 1 } });
      return res.status(404).json({ message: "Recipe not found." });
    }

    return res.status(201).json({ accessToken: accessToken({ ...user.toObject(), tokenVersion: req.tokenVersion }, req.sessionId), user: userProfile(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipe,
  addRecipe,
  updateRecipe,
  rateRecipe,
  deleteRecipe,
  addComment,
  deleteComment,
  toggleFavoriteRecipe,
};
