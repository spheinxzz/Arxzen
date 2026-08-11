const express = require("express");
const controller = require("../controllers/requestController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, controller.list);
router.post("/:userId", auth, controller.create);
router.patch("/:id", auth, controller.update);

module.exports = router;
