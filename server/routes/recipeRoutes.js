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
const ROLES_LIST = require("../config/rolesList");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/")
  .get(getAllRecipes)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), addRecipe)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), updateRecipe)
  .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), deleteRecipe);

router.route("/:id").get(getRecipe);

router
  .route("/comment")
  .post(
    verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    addComment
  )
  .delete(
    verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    deleteComment
  );

module.exports = router;
