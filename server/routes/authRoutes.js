const express = require("express");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const { loginLimit, accountLoginLimit } = require("../middleware/loginLimit");
const { registrationLimit, refreshLimit } = require("../middleware/requestLimits");

const router = express.Router();

router.route("/login").post(loginLimit, accountLoginLimit, login);
router.route("/register").post(registrationLimit, register);
router.route("/refresh").get(refreshLimit, refreshToken);
router.route("/logout").post(logout);

module.exports = router;
