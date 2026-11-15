const mongoose = require("mongoose");
const { parsePage } = require("./pagination");

module.exports = (Model) => async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid content ID." });
    const { page, limit } = parsePage(req.query);
    const [result] = await Model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      { $project: { items: { $slice: [{ $ifNull: ["$comments", []] }, (page - 1) * limit, limit] }, total: { $size: { $ifNull: ["$comments", []] } } } },
    ]);
    if (!result) return res.status(404).json({ message: "Content not found." });
    await Model.populate(result.items, { path: "user", model: "User", select: "name profilePicture" });
    return res.json({ items: result.items, total: result.total, page, limit });
  } catch (error) { next(error); }
};
