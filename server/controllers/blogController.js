const { parsePage, literalSearch } = require("../utils/pagination");
const mongoose = require("mongoose");
const Blog = require("../models/blogModel");
const validText = (value, max) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;

const getAllBlogs = async (req, res, next) => {
  try {
    if (req.query.page !== undefined) {
      const { page, limit, search } = parsePage(req.query);
      const filter = search ? { title: literalSearch(search) } : {};
      const [items, total] = await Promise.all([
        Blog.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit).populate("author", "name"),
        Blog.countDocuments(filter),
      ]);
      return res.status(200).json({ items, total, page, limit });
    }
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("author", "name");
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

const getBlog = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Blog not found" });
    let query = Blog.findOne({ _id: req.params.id }).populate("author", "name");
    query = req.query.includeComments === "false" ? query.select("-comments") : query.populate("comments.user", ["name", "profilePicture"]);
    const blog = await query;

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

const addBlog = async (req, res, next) => {
  try {
    const { title, image, description } = req.body;
    if (!validText(title, 200) || !validText(image, 2048) || !validText(description, 50000)) {
      return res.status(422).json({ message: "Enter a title, image and story content within the allowed lengths." });
    }

    const blog = Blog({ title: title.trim(), image: image.trim(), description: description.trim(), author: req.user });
    await blog.save();
    return res.status(201).json({ success: "Blog added successfully" });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, image, description } = req.body;
    if (!validText(title, 200) || !validText(image, 2048) || !validText(description, 50000)) {
      return res.status(422).json({ message: "Enter a title, image and story content within the allowed lengths." });
    }

    const foundBlog = await Blog.findById(req.params.id);
    if (!foundBlog) return res.status(404).json({ message: "Blog not found" });

    if (!foundBlog.author?.equals(req.user) && !req.roles.includes("Admin"))
      return res.status(401).json({ message: "Unauthorized" });

    foundBlog.title = title.trim();
    foundBlog.image = image.trim();
    foundBlog.description = description.trim();

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

    if (!foundBlog.author?.equals(req.user) && !req.roles.includes("Admin"))
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
    if (typeof comment !== "string" || !comment.trim() || comment.trim().length > 2000) {
      return res.status(400).json({ message: "Comment must be between 1 and 2000 characters." });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Add the new comment
    blog.comments.push({ user: req.user, comment: comment.trim() });
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

    if (!blog.comments[commentIndex].user?.equals(req.user) && !req.roles.includes("Admin")) {
      return res.status(403).json({ message: "Unauthorized" });
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
