const express = require("express");
const controller = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const { validateBody } = require("../middleware/validationMiddleware");

const router = express.Router();


router.get(
  "/oauth/google",
  controller.googleOAuth
);

router.get(
  "/oauth/google/callback",
  controller.googleOAuthCallback
);

router.get(
  "/oauth/discord",
  controller.discordOAuth
);

router.get(
  "/oauth/discord/callback",
  controller.discordOAuthCallback
);

router.get("/", (req, res) => {
  res.json({
    service: "Arxzen Authentication",
    status: "online"
  });
});

router.post(
  "/register",
  validateBody(["email", "password"]),
  controller.register
);

router.post(
  "/login",
  validateBody(["email", "password"]),
  controller.login
);

router.post(
  "/logout",
  auth,
  controller.logout
);

router.post(
  "/forgot-password",
  validateBody(["email"]),
  controller.forgotPassword
);

router.post(
  "/verify-email",
  validateBody(["email", "code"]),
  controller.verifyEmail
);

router.get(
  "/session",
  auth,
  controller.getSession
);

module.exports = router;
