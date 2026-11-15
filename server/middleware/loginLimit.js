const rateLimit = require("express-rate-limit");
const crypto = require("crypto");
const { normalizeEmail, validEmail } = require("../utils/accountValidation");

const loginLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, please try again after a minute",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const accountLoginLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  skip: (req) => !validEmail(normalizeEmail(req.body?.email)),
  keyGenerator: (req) => crypto.createHash("sha256").update(normalizeEmail(req.body.email).normalize("NFC")).digest("hex"),
  message: { message: "Too many sign-in attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimit, accountLoginLimit };
