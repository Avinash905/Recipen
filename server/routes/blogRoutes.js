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

const router = express.Router();

router
  .route("/")
  .get(getAllBlogs)
  .post(addBlog)
  .put(updateBlog)
  .delete(deleteBlog);
router.route("/:id").get(getBlog);
router.route("/comment").post(addComment).delete(deleteComment);

module.exports = router;
