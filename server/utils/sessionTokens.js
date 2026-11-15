const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Session = require('../models/sessionModel');
const lifetime = 2 * 24 * 60 * 60 * 1000;
const hash = (secret) => crypto.createHash('sha256').update(secret).digest('hex');
const secret = () => crypto.randomBytes(32).toString('base64url');
const tokenParts = (token) => {
  if (typeof token !== 'string') return null;
  const match = /^([a-f0-9]{24})\.([A-Za-z0-9_-]{43})(?:\.([A-Za-z0-9_-]{43}))?$/.exec(token);
  return match ? { id: match[1], secret: match[2], logoutSecret: match[3] } : null;
};
const accessToken = (user, sessionId) => jwt.sign({ UserInfo: {
  userId: user._id.toString(), tokenVersion: user.tokenVersion || 0,
  ...(sessionId ? { sessionId: sessionId.toString() } : {}),
} }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
const userProfile = (user) => ({ userId: user._id.toString(), name: user.name, email: user.email, profilePicture: user.profilePicture, roles: user.roles, favorites: user.favorites, accountDataRevision: user.accountDataRevision || 0 });
const issueSession = async (user) => {
  const newSecret = secret();
  const logoutSecret = secret();
  const session = await Session.create({ user: user._id, tokenVersion: user.tokenVersion || 0, tokenHash: hash(newSecret), logoutHash: hash(logoutSecret), expiresAt: new Date(Date.now() + lifetime) });
  return { sessionId: session._id.toString(), refresh: `${session._id}.${newSecret}.${logoutSecret}` };
};
const setCookie = (res, value) => res.cookie('jwt', value, { httpOnly: true, secure: true, sameSite: 'None', maxAge: lifetime });
module.exports = { lifetime, hash, secret, tokenParts, accessToken, userProfile, issueSession, setCookie };
