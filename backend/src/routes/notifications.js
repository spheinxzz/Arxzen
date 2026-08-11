const express = require("express");
const controller = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, controller.list);
router.patch("/:id/read", auth, controller.markRead);
router.delete("/:id", auth, controller.remove);

module.exports = router;
