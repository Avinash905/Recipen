const express = require("express");
const {
    getAllUsers,
    updateUser,
    disableUser,
    createUser,
    getUser,
} = require("../controllers/userController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");
const verifyOwn = require("../middleware/verifyOwn");

const router = express.Router();

router
    .route("/list")
    .get([verifyJwt, verifyRoles(ROLES_LIST.Admin)], getAllUsers);

router.route("/create").post(createUser);

router
    .route("/:id")
    .get(
        [
            verifyJwt,
            verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Admin),
            verifyOwn(),
        ],
        getUser
    );

router
    .route("/:id")
    .put(
        [
            verifyJwt,
            verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Admin),
            verifyOwn(),
        ],
        updateUser
    );

router
    .route("/disable/:id")
    .put(
        [
            verifyJwt,
            verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Admin),
            verifyOwn(),
        ],
        disableUser
    );

module.exports = router;
