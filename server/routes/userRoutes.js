const express = require("express");
const {
    getAllUsers,
    updateUser,
    disableUser,
    createUser,
} = require("../controllers/userController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
    .route("/list")
    .get([verifyJwt, verifyRoles(ROLES_LIST.Admin)], getAllUsers);

router.route("/create").post([verifyJwt], createUser);

router
    .route("/:id")
    .put(
        [
            verifyJwt,
            verifyRoles(
                ROLES_LIST.BasicUser,
                ROLES_LIST.ProUser,
                ROLES_LIST.Admin
            ),
        ],
        updateUser
    );

router
    .route("/disable/:id")
    .put([verifyJwt, verifyRoles(ROLES_LIST.Admin)], disableUser);

module.exports = router;
