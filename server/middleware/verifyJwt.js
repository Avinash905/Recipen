const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Session = require("../models/sessionModel");
const mongoose = require("mongoose");

const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.UserInfo.userId).select("roles isDisabled tokenVersion sessionRevision");
    if (!user || user.isDisabled || (decoded.UserInfo.tokenVersion || 0) !== (user.tokenVersion || 0)) return res.sendStatus(403);
    if (decoded.UserInfo.sessionId) {
      if (!mongoose.isValidObjectId(decoded.UserInfo.sessionId) || !(await Session.exists({ _id: decoded.UserInfo.sessionId, user: user._id, tokenVersion: decoded.UserInfo.tokenVersion || 0, revoked: { $ne: true }, expiresAt: { $gt: new Date() } }))) return res.sendStatus(403);
      req.sessionId = decoded.UserInfo.sessionId;
    }
    req.user = user._id.toString();
    req.tokenVersion = decoded.UserInfo.tokenVersion || 0;
    req.sessionRevision = user.sessionRevision || 0;
    req.roles = user.roles;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.sendStatus(403);
    }
    next(error);
  }
};

module.exports = verifyJwt;
