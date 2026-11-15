const mongoose = require('mongoose');
const { parsePage, literalSearch } = require('./pagination');
const User = require('../models/userModel');

// Only summary fields leave this endpoint. Full legacy responses remain unchanged.
async function catalog(model, req, scope = 'public') {
  const { page, limit } = parsePage(req.query);
  const search = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
  const isRecipe = model.modelName === 'Recipe';
  const match = {};
  if (scope === 'mine') match.author = new mongoose.Types.ObjectId(req.user);
  if (scope === 'saved') {
    const user = await User.findById(req.user).select('favorites').lean();
    match._id = { $in: user?.favorites || [] };
  }
  if (search) {
    const expression = literalSearch(search);
    const authors = await User.find({ name: expression }).select('_id').lean();
    match.$or = [
      { title: expression }, { description: expression },
      { author: { $in: authors.map((author) => author._id) } },
      ...(isRecipe ? [{ ingredients: expression }] : []),
    ];
  }
  const pipeline = [{ $match: match }];
  if (isRecipe) {
    pipeline.push({ $addFields: { cookMinutes: { $convert: { input: '$cookingTime', to: 'double', onError: null, onNull: null } } } });
    const maxTime = Number(req.query.maxTime);
    if (Number.isFinite(maxTime) && maxTime > 0) pipeline.push({ $match: { cookMinutes: { $gt: 0, $lte: maxTime } } });
  }
  const order = req.query.sort === 'title' ? { title: 1, _id: 1 } : req.query.sort === 'time' && isRecipe ? { cookMinutes: 1, _id: 1 } : { createdAt: -1, _id: -1 };
  if (req.query.sort === 'time' && isRecipe) pipeline.push({ $addFields: { cookMinutes: { $cond: [{ $gt: ['$cookMinutes', 0] }, '$cookMinutes', Number.MAX_SAFE_INTEGER] } } });
  pipeline.push({ $facet: {
    items: [ { $sort: order }, { $skip: (page - 1) * limit }, { $limit: limit }, { $lookup: { from: 'users', localField: 'author', foreignField: '_id', pipeline: [{ $project: { name: 1 } }], as: 'author' } }, { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } }, { $project: { title: 1, image: 1, description: 1, cookingTime: 1, ...(isRecipe && req.query.ratingSummary === 'true' ? { ratingCount: { $size: { $ifNull: ['$ratings', []] } }, ratingAverage: { $avg: '$ratings.rating' } } : { ratings: { rating: 1 } }), createdAt: 1, 'author._id': 1, 'author.name': 1 } } ],
    count: [{ $count: 'total' }],
  } });
  const [result] = await model.aggregate(pipeline).collation({ locale: 'en', strength: 2 });
  return { items: result.items, total: result.count[0]?.total || 0, page, limit };
}
module.exports = catalog;
