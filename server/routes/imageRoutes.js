const express = require("express");
const { addImage } = require("../controllers/imageController");
const ROLES_LIST = require("../config/rolesList");
const verifyJwt = require("../middleware/verifyJwt");
const verifyRoles = require("../middleware/verifyRoles");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.route("/").post([upload], addImage);

module.exports = router;
