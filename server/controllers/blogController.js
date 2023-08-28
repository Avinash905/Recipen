const Blog = require("../models/blogModel");

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author");
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id })
      .populate("author", "name")
      .populate("comments.user", ["name", "profilePicture"]);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

const addBlog = async (req, res, next) => {
  try {
    const { title, image, description } = req.body;
    if (!title || !image || !description) {
      return res.status(422).json({ message: "Insufficient data" });
    }

    const blog = Blog({ ...req.body, author: req.user });
    await blog.save();
    return res.status(201).json({ success: "Blog added successfully" });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, image, description } = req.body;
    if (!title || !image || !description) {
      return res.status(422).json({ message: "Insufficient data" });
    }

    const foundBlog = await Blog.findById(req.params.id);
    if (!foundBlog) return res.status(404).json({ message: "Blog not found" });

    if (foundBlog.author !== req.user)
      return res.status(401).json({ message: "Unauthorized" });

    foundBlog.title = title;
    foundBlog.image = image;
    foundBlog.description = description;

    const updatedBlog = await foundBlog.save();

    return res.status(201).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const foundBlog = await Blog.findById(req.params.id);

    if (!foundBlog) return res.status(404).json({ message: "Blog not found" });

    if (foundBlog.author !== req.user)
      return res.status(401).json({ message: "Unauthorized" });

    await foundBlog.deleteOne({ _id: req.params.id });

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

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Add the new comment
    blog.comments.push({ user: req.user, comment });
    await blog.save();

    res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const commentIndex = blog.comments.findIndex((comment) =>
      comment._id.equals(commentId)
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found." });
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
};
