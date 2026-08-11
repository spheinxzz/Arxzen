const express = require("express");
const controller = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:id", controller.getProfile);
router.patch("/", auth, controller.updateProfile);

module.exports = router;
