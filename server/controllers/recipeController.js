const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const getAllRecipes = async (req, res, next) => {
  try {
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
    const recipe = await Recipe.findOne({ _id: req.params.id })
      .populate("author", "name")
      .populate("comments.user", ["name", "profilePicture"]);

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
      !ingredients.length ||
      !instructions.length
    ) {
      return res.status(422).json({ message: "Insufficient data" });
    }

    const foundRecipe = await Recipe.findById(req.params.id);
    if (!foundRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (foundRecipe.author !== req.user)
      return res.status(401).json({ message: "Unauthorized" });

    foundRecipe.title = title;
    foundRecipe.description = description;
    foundRecipe.image = image;
    foundRecipe.calories = calories;
    foundRecipe.ingredients = ingredients;
    foundRecipe.cookingTime = cookingTime;
    foundRecipe.instructions = instructions;

    const updatedRecipe = await foundRecipe.save();
    res.status(201).json(updatedRecipe);
  } catch (error) {
    next(error);
  }
};

const rateRecipe = async (req, res, next) => {
  try {
    const { rating } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Check if the user has already rated this recipe
    const existingRating = recipe.ratings.find((rate) =>
      rate.user.equals(req.user)
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "User has already rated this recipe" });
    }

    // Add the new rating
    recipe.ratings.push({ user: req.user, rating: rating });
    await recipe.save();

    res.status(201).json({ message: "Rating added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const foundRecipe = await Recipe.findById(req.params.id);
    if (!foundRecipe)
      return res.status(404).json({ message: "Recipe not found" });

    if (foundRecipe.author !== req.user)
      return res.status(401).json({ message: "Unauthorized" });

    await foundRecipe.deleteOne({ _id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    // Validate userId and commentText
    if (!comment) {
      return res.status(400).json({ message: "Comment is required." });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found." });
    }

    // Add the new comment
    recipe.comments.push({ user: req.user, comment });
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

    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const toggleFavoriteRecipe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipeIndex = user.favorites.indexOf(req.params.id);
    if (recipeIndex === -1) {
      // Recipe not present, add it to favorites
      user.favorites.push(req.params.id);
    } else {
      // Recipe already present, remove it from favorites
      user.favorites.splice(recipeIndex, 1);
    }

    await user.save();

    const roles = Object.values(user.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          roles: roles,
          favorites: user.favorites,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(201).json({ accessToken });
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
