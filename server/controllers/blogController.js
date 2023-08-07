const Blog = require("../models/blogModel");

const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 }).populate("author");
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

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    return res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id });
    res.status(204).json({ success: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {};
const deleteComment = async (req, res, next) => {};

module.exports = {
  getAllBlogs,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  addComment,
  deleteComment,
};
