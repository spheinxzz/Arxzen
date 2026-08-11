const { supabase, authClient } = require("../config/supabase");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getFrontendUrl() {
  const frontend = process.env.FRONTEND_URL;

  if (!frontend) {
    throw new Error("FRONTEND_URL is not configured.");
  }

  return frontend.replace(/\/$/, "");
}

async function findAuthUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } =
      await supabase.auth.admin.listUsers({
        page,
        perPage
      });

    if (error) {
      throw error;
    }

    const users = data?.users || [];

    const user = users.find(
      (account) =>
        normalizeEmail(account.email) === normalizedEmail
    );

    if (user) {
      return user;
    }

    if (users.length < perPage) {
      return null;
    }

    page += 1;
  }
}

async function register(req, res, next) {
  try {
    const {
      email,
      password,
      username,
      displayName
    } = req.body || {};

    const cleanEmail = normalizeEmail(email);
    const cleanUsername = String(username || "").trim();
    const cleanDisplayName =
      String(displayName || "").trim();

    if (!cleanEmail) {
      return res.status(400).json({
        error: "ARX-REG-002: Email is required."
      });
    }

    if (!password) {
      return res.status(400).json({
        error: "ARX-REG-003: Password is required."
      });
    }

    if (!cleanUsername) {
      return res.status(400).json({
        error: "ARX-REG-004: Username is required."
      });
    }

    if (!cleanDisplayName) {
      return res.status(400).json({
        error: "ARX-REG-005: Display name is required."
      });
    }

    const existingUser =
      await findAuthUserByEmail(cleanEmail);

    if (existingUser) {
      return res.status(409).json({
        error:
          "ARX-REG-006: An Arxzen account with this email address is already registered."
      });
    }

    const { data, error } =
      await supabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: false,
        user_metadata: {
          username: cleanUsername,
          display_name: cleanDisplayName,
          arxzen_registered: true
        }
      });

    if (error) {
      if (
        error.message
          ?.toLowerCase()
          .includes("already been registered")
      ) {
        return res.status(409).json({
          error:
            "ARX-REG-006: An Arxzen account with this email address is already registered."
        });
      }

      return res.status(400).json({
        error:
          "ARX-REG-001: " + error.message
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
    const { email, password } = req.body || {};

    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password) {
      return res.status(400).json({
        error:
          "ARX-LOGIN-002: Email and password are required."
      });
    }

    const registeredUser =
      await findAuthUserByEmail(cleanEmail);

    if (!registeredUser) {
      return res.status(404).json({
        error:
          "ARX-LOGIN-003: This Arxzen account is not registered."
      });
    }

    const isRegistered =
      registeredUser.user_metadata?.arxzen_registered === true;

    if (!isRegistered) {
      return res.status(403).json({
        error:
          "ARX-LOGIN-004: This account is not registered with Arxzen."
      });
    }

    const { data, error } =
      await authClient.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

    if (error) {
      return res.status(401).json({
        error:
          "ARX-LOGIN-001: " + error.message
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
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
      return res.status(400).json({
        error: "ARX-PASS-001: Email is required."
      });
    }

    const frontend = process.env.FRONTEND_URL;

    if (!frontend) {
      return res.status(500).json({
        error:
          "ARX-PASS-000: FRONTEND_URL is not configured."
      });
    }

    const registeredUser =
      await findAuthUserByEmail(cleanEmail);

    if (!registeredUser) {
      return res.status(404).json({
        error:
          "ARX-PASS-003: This Arxzen account is not registered."
      });
    }

    const { error } =
      await authClient.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo:
            `${frontend.replace(/\/$/, "")}/reset-password`
        }
      );

    if (error) {
      return res.status(400).json({
        error:
          "ARX-PASS-002: " + error.message
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
        email: normalizeEmail(email),
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
    const backend = process.env.BACKEND_URL;

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
            `${backend.replace(/\/$/, "")}/api/auth/oauth/google/callback`
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

    const user = data.user;

    const registered =
      user.user_metadata?.arxzen_registered === true;

    if (!registered) {
      await supabase.auth.admin.deleteUser(
        user.id
      );

      return res.status(403).json({
        error:
          "ARX-OAUTH-GOOGLE-005: This Google account is not registered with Arxzen."
      });
    }

    const frontend = getFrontendUrl();

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
    const backend = process.env.BACKEND_URL;

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
            `${backend.replace(/\/$/, "")}/api/auth/oauth/discord/callback`
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

    const user = data.user;

    const registered =
      user.user_metadata?.arxzen_registered === true;

    if (!registered) {
      await supabase.auth.admin.deleteUser(
        user.id
      );

      return res.status(403).json({
        error:
          "ARX-OAUTH-DISCORD-005: This Discord account is not registered with Arxzen."
      });
    }

    const frontend = getFrontendUrl();

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
  discordOAuth,
  discordOAuthCallback
};
