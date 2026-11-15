const express = require("express");
const {
  getAllUsers,
  updateUser,
  disableUser,
  enableUser,
} = require("../controllers/userController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");
const { writeLimit } = require("../middleware/requestLimits");

const router = express.Router();

router.route("/").get([verifyJwt, verifyRoles(ROLES_LIST.Admin)], getAllUsers);

router
  .route("/:id")
  .put(
    [
      verifyJwt,
      writeLimit,
      verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.ProUser, ROLES_LIST.Admin),
    ],
    updateUser
  );

router
  .route("/disable/:id")
  .put([verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin)], disableUser);

router.route("/enable/:id").put([verifyJwt, writeLimit, verifyRoles(ROLES_LIST.Admin)], enableUser);

module.exports = router;
