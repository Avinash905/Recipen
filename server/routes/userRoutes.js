const express = require("express");
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const ROLES_LIST = require("../config/rolesList");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
  .put(verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser), updateUser)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

module.exports = router;
