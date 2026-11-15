const express = require("express");
const {
  getAllRecipes,
  getRecipe,
  addRecipe,
  updateRecipe,
  rateRecipe,
  deleteRecipe,
  addComment,
  deleteComment,
  toggleFavoriteRecipe,
} = require("../controllers/recipeController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");
const { writeLimit } = require("../middleware/requestLimits");

const router = express.Router();
const catalog = require("../utils/catalog");
const Recipe = require("../models/recipeModel");
const commentPage = require("../utils/commentPage");
const catalogHandler = (scope) => async (req, res, next) => {
  try { res.json(await catalog(Recipe, req, scope)); } catch (error) { next(error); }
};
router.get("/catalog", catalogHandler("public"));
router.get("/catalog/mine", verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), catalogHandler("mine"));
router.get("/catalog/saved", verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser, ROLES_LIST.BasicUser), catalogHandler("saved"));
router.get("/:id/comments", commentPage(Recipe));

router
  .route("/")
  .get(getAllRecipes)
  .post(
    [verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    addRecipe
  );

router
  .route("/rate/:id")
  .put(
    [
      verifyJwt,
      writeLimit,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    rateRecipe
  );

router
  .route("/:id")
  .get(getRecipe)
  .put(
    [verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    updateRecipe
  )
  .delete(
    [verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    deleteRecipe
  );

router
  .route("/comment/:id")
  .put(
    [
      verifyJwt,
      writeLimit,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    addComment
  );

router
  .route("/comment/:recipeId/:commentId")
  .delete(
    [
      verifyJwt,
      writeLimit,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    deleteComment
  );

router
  .route("/favorite/:id")
  .put(
    [
      verifyJwt,
      writeLimit,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    toggleFavoriteRecipe
  );

module.exports = router;
