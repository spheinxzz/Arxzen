const express = require("express");
const controller = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:conversationId", auth, controller.list);
router.post("/", auth, controller.create);
router.patch("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);

module.exports = router;
