const rateLimit = require("express-rate-limit");

const limit = (options) => rateLimit({
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
  ...options,
});

const registrationLimit = limit({ windowMs: 15 * 60 * 1000, max: 30 });
const refreshLimit = limit({ windowMs: 60 * 1000, max: 120 });
const writeLimit = limit({ windowMs: 60 * 1000, max: 120, keyGenerator: (req) => req.user });

module.exports = { registrationLimit, refreshLimit, writeLimit };
