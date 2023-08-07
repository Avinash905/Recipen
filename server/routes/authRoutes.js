const express = require("express");
const {
  register,
  login,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refreshToken);

module.exports = router;
