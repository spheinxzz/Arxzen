const { supabase, authClient } = require("../config/supabase");

async function register(req, res, next) {
  try {
    const {
      email,
      password,
      username,
      displayName
    } = req.body;

    const { data, error } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
        user_metadata: {
          username,
          display_name: displayName
        }
      });

    if (error) {
      return res.status(400).json({
        error: "ARX-REG-001: " + error.message
      });
    }

    return res.status(201).json({
      message: "Account created",
      user: data.user
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { data, error } =
      await authClient.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      return res.status(401).json({
        error: "ARX-LOGIN-001: " + error.message
      });
    }

    return res.json({
      message: "Login successful",
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  return res.json({
    message: "Logged out successfully"
  });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        error: "ARX-PASS-001: Email is required."
      });
    }

    const frontend =
      process.env.FRONTEND_URL;

    if (!frontend) {
      return res.status(500).json({
        error:
          "ARX-PASS-000: FRONTEND_URL is not configured."
      });
    }

    const { error } =
      await authClient.auth.resetPasswordForEmail(
        String(email).trim().toLowerCase(),
        {
          redirectTo:
            `${frontend}/reset-password`
        }
      );

    if (error) {
      return res.status(400).json({
        error: "ARX-PASS-002: " + error.message
      });
    }

    return res.json({
      message: "Password reset email sent"
    });
  } catch (error) {
    next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { email, code } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({
        error:
          "ARX-VERIFY-001: Email and verification code are required."
      });
    }

    const { data, error } =
      await authClient.auth.verifyOtp({
        email: String(email)
          .trim()
          .toLowerCase(),
        token: String(code),
        type: "email"
      });

    if (error) {
      return res.status(400).json({
        error:
          "ARX-VERIFY-002: " +
          error.message
      });
    }

    return res.json({
      message: "Email verified",
      user: data?.user || null,
      session: data?.session || null
    });
  } catch (error) {
    next(error);
  }
}

async function getSession(req, res) {
  return res.json({
    user: req.user
  });
}

async function googleOAuth(req, res, next) {
  try {
    const backend =
      process.env.BACKEND_URL;

    if (!backend) {
      return res.status(500).json({
        error:
          "ARX-OAUTH-GOOGLE-000: BACKEND_URL is not configured."
      });
    }

    const { data, error } =
      await authClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            `${backend}/api/auth/oauth/google/callback`
        }
      });

    if (error || !data?.url) {
      return res.status(400).json({
        error:
          "ARX-OAUTH-GOOGLE-001: Unable to start Google authentication.",
        details: error?.message || null
      });
    }

    return res.redirect(data.url);
  } catch (error) {
    next(error);
  }
}

async function googleOAuthCallback(req, res, next) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error:
          "ARX-OAUTH-GOOGLE-002: Authorization code is missing."
      });
    }

    const { data, error } =
      await authClient.auth.exchangeCodeForSession(
        code
      );

    if (
      error ||
      !data?.session ||
      !data?.user
    ) {
      return res.status(401).json({
        error:
          "ARX-OAUTH-GOOGLE-003: Google authentication failed.",
        details: error?.message || null
      });
    }

    const frontend =
      process.env.FRONTEND_URL;

    if (!frontend) {
      return res.status(500).json({
        error:
          "ARX-OAUTH-GOOGLE-004: FRONTEND_URL is not configured."
      });
    }

    const accessToken =
      encodeURIComponent(
        data.session.access_token
      );

    const refreshToken =
      encodeURIComponent(
        data.session.refresh_token
      );

    return res.redirect(
      `${frontend}/home?oauth=google&access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (error) {
    next(error);
  }
}

async function discordOAuth(req, res, next) {
  try {
    const backend =
      process.env.BACKEND_URL;

    if (!backend) {
      return res.status(500).json({
        error:
          "ARX-OAUTH-DISCORD-000: BACKEND_URL is not configured."
      });
    }

    const { data, error } =
      await authClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo:
            `${backend}/api/auth/oauth/discord/callback`
        }
      });

    if (error || !data?.url) {
      return res.status(400).json({
        error:
          "ARX-OAUTH-DISCORD-001: Unable to start Discord authentication.",
        details: error?.message || null
      });
    }

    return res.redirect(data.url);
  } catch (error) {
    next(error);
  }
}

async function discordOAuthCallback(req, res, next) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error:
          "ARX-OAUTH-DISCORD-002: Authorization code is missing."
      });
    }

    const { data, error } =
      await authClient.auth.exchangeCodeForSession(
        code
      );

    if (
      error ||
      !data?.session ||
      !data?.user
    ) {
      return res.status(401).json({
        error:
          "ARX-OAUTH-DISCORD-003: Discord authentication failed.",
        details: error?.message || null
      });
    }

    const frontend =
      process.env.FRONTEND_URL;

    if (!frontend) {
      return res.status(500).json({
        error:
          "ARX-OAUTH-DISCORD-004: FRONTEND_URL is not configured."
      });
    }

    const accessToken =
      encodeURIComponent(
        data.session.access_token
      );

    const refreshToken =
      encodeURIComponent(
        data.session.refresh_token
      );

    return res.redirect(
      `${frontend}/home?oauth=discord&access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  verifyEmail,
  getSession,
  googleOAuth,
  googleOAuthCallback,
  discordOAuth,
  discordOAuthCallback
};
