const express = require("express");
const controller = require("../controllers/securityController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/sessions", auth, controller.listSessions);
router.delete("/sessions/:id", auth, controller.revokeSession);
router.patch("/password", auth, controller.changePassword);

module.exports = router;
