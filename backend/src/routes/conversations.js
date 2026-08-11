const express = require("express");
const controller = require("../controllers/conversationController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, controller.list);
router.post("/", auth, controller.create);
router.get("/:id", auth, controller.get);

module.exports = router;
