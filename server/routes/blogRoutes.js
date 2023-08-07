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
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.BasicUser, ROLES_LIST.ProUser),
    getAllBlogs
  )
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), addBlog);

router
  .route("/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.BasicUser, ROLES_LIST.ProUser),
    getBlog
  )
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser), updateBlog)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteBlog);

router
  .route("/comment")
  .post(verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser), addComment)
  .delete(verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser), deleteComment);

module.exports = router;
