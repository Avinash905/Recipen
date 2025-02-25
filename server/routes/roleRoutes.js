const express = require("express");
const {
    getAllRoles,
    getRole,
    addRole,
    updateRole,
    deleteRole,
} = require("../controllers/roleController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router
    .route("/list")
    .get(
        [verifyJwt, verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Admin)],
        getAllRoles
    );

router.route("/create").post([verifyJwt], addRole);

router
    .route("/:id")
    .get(
        [verifyJwt, verifyRoles(ROLES_LIST.BasicUser, ROLES_LIST.Admin)],
        getRole
    )
    .put([verifyJwt, verifyRoles(ROLES_LIST.Admin)], updateRole);

router
    .route("/delete/:id")
    .delete([verifyJwt, verifyRoles(ROLES_LIST.Admin)], deleteRole);

module.exports = router;
