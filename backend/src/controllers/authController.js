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
      account =>
        normalizeEmail(account.email) === normalizedEmail
    );

    if (user) {
      return user;
    }

    if (users.length < perPage) {
      return null;
    }

    page++;
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

    const existingUser =
      await findAuthUserByEmail(cleanEmail);

    if (!existingUser) {
      return res.status(404).json({
        error:
          "ARX-LOGIN-003: This Arxzen account is not registered."
      });
    }

    if (
      existingUser.user_metadata?.arxzen_registered !== true
    ) {
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

    const existingUser =
      await findAuthUserByEmail(cleanEmail);

    if (!existingUser) {
      return res.status(404).json({
        error:
          "ARX-PASS-003: This Arxzen account is not registered."
      });
    }

    const frontend = getFrontendUrl();

    const { error } =
      await authClient.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo:
            `${frontend}/reset-password`
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
          "ARX-VERIFY-002: " + error.message
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
    const frontend = getFrontendUrl();

    const { data, error } =
      await authClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            `${frontend}/oauth/callback`
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

async function discordOAuth(req, res, next) {
  try {
    const frontend = getFrontendUrl();

    const { data, error } =
      await authClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo:
            `${frontend}/oauth/callback`
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

async function oauthSession(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        error:
          "ARX-OAUTH-SESSION-001: Authentication token is required."
      });
    }

    const token = header.substring(7);

    const { data, error } =
      await authClient.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        error:
          "ARX-OAUTH-SESSION-002: Invalid or expired authentication token."
      });
    }

    const user = data.user;

    if (
      user.user_metadata?.arxzen_registered !== true
    ) {
      return res.status(403).json({
        error:
          "ARX-OAUTH-SESSION-003: This account is not registered with Arxzen."
      });
    }

    return res.json({
      message: "OAuth authentication successful",
      user
    });
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
  discordOAuth,
  oauthSession
};
