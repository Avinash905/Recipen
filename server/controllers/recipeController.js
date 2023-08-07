const Recipe = require("../models/recipeModel");

const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .sort({ updatedAt: -1 })
      .populate("author", "name");
    res.status(200).send(recipes);
  } catch (error) {
    next(error);
  }
};

const getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id })
      .populate("author", "name")
      .populate("comments.user", ["name", "profilePicture"]);
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
      !calories ||
      !cookingTime ||
      !ingredients.length ||
      !instructions.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    const recipe = Recipe({ ...req.body, author: req.user });
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
      !calories ||
      !cookingTime ||
      !ingredients ||
      !instructions
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ _id: req.params.id });
    res.status(204).json({ success: "Recipe deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {};

const deleteComment = async (req, res, next) => {};

module.exports = {
  getAllRecipes,
  getRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  deleteComment,
};
