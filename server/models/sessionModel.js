const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenVersion: { type: Number, required: true },
  tokenHash: { type: String, required: true, select: false },
  previousTokenHash: { type: String, select: false },
  logoutHash: { type: String, select: false },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });
module.exports = mongoose.model('Session', sessionSchema);
