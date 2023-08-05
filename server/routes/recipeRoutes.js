const express = require("express");
const {
  getAllRecipes,
  getRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  deleteComment,
} = require("../controllers/recipeController");

const router = express.Router();

router
  .route("/")
  .get(getAllRecipes)
  .post(addRecipe)
  .put(updateRecipe)
  .delete(deleteRecipe);
router.route("/:id").get(getRecipe);
router.route("/comment").post(addComment).delete(deleteComment);

module.exports = router;
