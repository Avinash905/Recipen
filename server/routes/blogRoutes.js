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

const router = express.Router();

router
  .route("/")
  .get(getAllBlogs)
  .post(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    addBlog
  );

router
  .route("/:id")
  .get(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.Admin, ROLES_LIST.BasicUser, ROLES_LIST.ProUser),
    ],
    getBlog
  )
  .put(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    updateBlog
  )
  .delete(
    [verifyJwt, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.ProUser)],
    deleteBlog
  );

router
  .route("/comment/:id")
  .put(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    addComment
  );

router
  .route("/comment/:blogId/:commentId")
  .delete(
    [
      verifyJwt,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    deleteComment
  );
module.exports = router;
