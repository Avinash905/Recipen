const express = require("express");
const {
  getAllBlogs,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
} = require("../controllers/blogController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");
const { writeLimit } = require("../middleware/requestLimits");

const router = express.Router();
const catalog = require("../utils/catalog");
const Blog = require("../models/blogModel");
const commentPage = require("../utils/commentPage");
const catalogHandler = (scope) => async (req, res, next) => {
  try { res.json(await catalog(Blog, req, scope)); } catch (error) { next(error); }
};
router.get("/catalog", catalogHandler("public"));
router.get("/catalog/mine", verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), catalogHandler("mine"));
router.get("/:id/comments", commentPage(Blog));

router
  .route("/")
  .get(getAllBlogs)
  .post(
    [verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    addBlog
  );

router
  .route("/:id")
  .get(getBlog)
  .put(
    [verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    updateBlog
  )
  .delete(
    [verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    deleteBlog
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
  .route("/comment/:blogId/:commentId")
  .delete(
    [
      verifyJwt,
      writeLimit,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    deleteComment
  );
module.exports = router;
