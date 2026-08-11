const express = require("express");
const controller = require("../controllers/userController");

const router = express.Router();

router.get("/search", controller.searchUsers);
router.get("/:id", controller.getUser);

module.exports = router;
