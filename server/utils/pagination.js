const parsePage = (query) => {
  const page = Math.max(1, Math.min(100000, parseInt(query.page, 10) || 1));
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 12));
  const search = typeof query.search === "string" ? query.search.trim().slice(0, 100) : "";
  return { page, limit, search };
};
const literalSearch = (text) => new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
module.exports = { parsePage, literalSearch };
