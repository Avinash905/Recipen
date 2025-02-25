const express = require("express");
const {
    login,
    refreshToken,
    logout,
} = require("../controllers/authController");
const loginLimit = require("../middleware/loginLimit");

const router = express.Router();

router.route("/login").post(loginLimit, login);
router.route("/refresh").get(refreshToken);
router.route("/logout").post(logout);

module.exports = router;
