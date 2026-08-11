const { supabase, authClient } = require("../config/supabase");

const TESTER_ACCESS_CODE =
  process.env.TESTER_ACCESS_CODE ||
  "ARXZEN-TEST-0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

function clean(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return clean(value).toLowerCase();
}

function makeUsername(user) {
  const metadata = user?.user_metadata || {};

  if (metadata.username) {
    return clean(metadata.username);
  }

  if (metadata.user_name) {
    return clean(metadata.user_name);
  }

  const email = normalizeEmail(user?.email);

  if (email) {
    return email
      .split("@")[0]
      .replace(/[^a-zA-Z0-9_]/g, "")
      .slice(0, 30) || "user";
  }

  return "user";
}

function makeDisplayName(user) {
  const metadata = user?.user_metadata || {};

  if (metadata.display_name) {
    return clean(metadata.display_name);
  }

  if (metadata.full_name) {
    return clean(metadata.full_name);
  }

  if (metadata.name) {
    return clean(metadata.name);
  }

  if (metadata.user_name) {
    return clean(metadata.user_name);
  }

  const username = makeUsername(user);

  if (username) {
    return username;
  }

  return "User";
}

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

async function register(req, res, next) {
  try {
    const {
      email,
      password,
      username,
      displayName,
      testerCode
    } = req.body || {};

    const cleanEmail = normalizeEmail(email);
    const cleanUsername = clean(username);
    const cleanDisplayName = clean(displayName);
    const cleanTesterCode = clean(testerCode);

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

    if (cleanTesterCode !== TESTER_ACCESS_CODE) {
      return res.status(403).json({
        error:
          "ARX-REG-006: Invalid tester access code."
      });
    }

    /*
     * Check whether this email already exists.
     *
     * Supabase's admin API does not provide a direct
     * get-user-by-email method in every version, so we
     * search through the users list.
     */

    let existingUser = null;
    let page = 1;
    const perPage = 1000;

    while (!existingUser) {
      const {
        data,
        error
      } = await supabase.auth.admin.listUsers({
        page,
        perPage
      });

      if (error) {
        return res.status(500).json({
          error:
            "ARX-REG-000: Unable to check registered accounts.",
          details: error.message
        });
      }

      const users = data?.users || [];

      existingUser = users.find(
        (user) =>
          normalizeEmail(user.email) === cleanEmail
      );

      if (
        users.length < perPage ||
        existingUser
      ) {
        break;
      }

      page++;
    }

    if (existingUser) {
      return res.status(409).json({
        error:
          "ARX-REG-001: A user with this email address has already been registered."
      });
    }

    const {
      data,
      error
    } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: false,
      user_metadata: {
        username: cleanUsername,
        display_name: cleanDisplayName,
        arxzen_registered: true,
        registration_method: "password"
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

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

async function login(req, res, next) {
  try {
    const {
      email,
      password
    } = req.body || {};

    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password) {
      return res.status(400).json({
        error:
          "ARX-LOGIN-000: Email and password are required."
      });
    }

    /*
     * Make sure the account actually exists in
     * the registered Arxzen accounts.
     */

    let registeredUser = null;
    let page = 1;
    const perPage = 1000;

    while (!registeredUser) {
      const {
        data,
        error
      } = await supabase.auth.admin.listUsers({
        page,
        perPage
      });

      if (error) {
        return res.status(500).json({
          error:
            "ARX-LOGIN-000: Unable to check registered accounts.",
          details: error.message
        });
      }

      const users = data?.users || [];

      registeredUser = users.find(
        (user) =>
          normalizeEmail(user.email) === cleanEmail &&
          user.user_metadata?.arxzen_registered === true
      );

      if (
        users.length < perPage ||
        registeredUser
      ) {
        break;
      }

      page++;
    }

    if (!registeredUser) {
      return res.status(404).json({
        error:
          "ARX-LOGIN-002: This account is not registered with Arxzen."
      });
    }

    const {
      data,
      error
    } = await authClient.auth.signInWithPassword({
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

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

async function logout(req, res) {
  return res.json({
    message: "Logged out successfully"
  });
}

/*
|--------------------------------------------------------------------------
| Session
|--------------------------------------------------------------------------
*/

async function getSession(req, res) {
  return res.json({
    user: req.user
  });
}

/*
|--------------------------------------------------------------------------
| Password reset
|--------------------------------------------------------------------------
*/

async function forgotPassword(req, res, next) {
  try {
    const {
      email
    } = req.body || {};

    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
      return res.status(400).json({
        error:
          "ARX-PASS-001: Email is required."
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

    const {
      error
    } =
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
          "ARX-PASS-002: " +
          error.message
      });
    }

    return res.json({
      message:
        "Password reset email sent"
    });
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Email verification
|--------------------------------------------------------------------------
*/

async function verifyEmail(req, res, next) {
  try {
    const {
      email,
      code
    } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({
        error:
          "ARX-VERIFY-001: Email and verification code are required."
      });
    }

    const {
      data,
      error
    } =
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

/*
|--------------------------------------------------------------------------
| OAuth helper
|--------------------------------------------------------------------------
*/

async function startOAuth(
  req,
  res,
  provider,
  next
) {
  try {
    const backend =
      process.env.BACKEND_URL;

    if (!backend) {
      return res.status(500).json({
        error:
          `ARX-OAUTH-${provider.toUpperCase()}-000: BACKEND_URL is not configured.`
      });
    }

    const mode =
      req.query.mode === "register"
        ? "register"
        : "login";

    /*
     * Registration through OAuth requires the tester
     * code. This prevents OAuth from bypassing the
     * private testing gate.
     */

    if (mode === "register") {
      const testerCode =
        clean(req.query.testerCode);

      if (
        testerCode !== TESTER_ACCESS_CODE
      ) {
        return res.status(403).json({
          error:
            "ARX-OAUTH-REG-001: A valid tester access code is required to register."
        });
      }
    }

    const callback =
      `${backend}/api/auth/oauth/${provider}/callback?mode=${mode}`;

    const {
      data,
      error
    } =
      await authClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callback
        }
      });

    if (error || !data?.url) {
      return res.status(400).json({
        error:
          `ARX-OAUTH-${provider.toUpperCase()}-001: Unable to start ${provider} authentication.`,
        details:
          error?.message || null
      });
    }

    return res.redirect(data.url);
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| OAuth account registration/login
|--------------------------------------------------------------------------
*/

async function finishOAuth(
  req,
  res,
  provider,
  next
) {
  try {
    const {
      code,
      mode
    } = req.query;

    /*
     * Supabase may return an OAuth implicit-flow
     * response directly to the frontend. This backend
     * endpoint is specifically for PKCE/code flow.
     */

    if (!code) {
      return res.status(400).json({
        error:
          `ARX-OAUTH-${provider.toUpperCase()}-002: Authorization code is missing.`
      });
    }

    const {
      data,
      error
    } =
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
          `ARX-OAUTH-${provider.toUpperCase()}-003: ${provider} authentication failed.`,
        details:
          error?.message || null
      });
    }

    const user = data.user;
    const metadata =
      user.user_metadata || {};

    const isRegistered =
      metadata.arxzen_registered === true;

    /*
     * LOGIN:
     *
     * OAuth must already belong to a registered
     * Arxzen account.
     */

    if (mode !== "register") {
      if (!isRegistered) {
        /*
         * Remove an OAuth-created account that isn't
         * registered with Arxzen.
         */

        try {
          await supabase.auth.admin.deleteUser(
            user.id
          );
        } catch (deleteError) {
          console.error(
            "Unable to remove unregistered OAuth user:",
            deleteError
          );
        }

        return res.status(403).json({
          error:
            "ARX-OAUTH-LOGIN-001: This account is not registered with Arxzen. Please register first."
        });
      }
    }

    /*
     * REGISTER:
     *
     * Mark the OAuth account as a real Arxzen
     * registered account.
     */

    let finalUser = user;

    if (
      mode === "register" &&
      !isRegistered
    ) {
      const username =
        makeUsername(user);

      const displayName =
        makeDisplayName(user);

      const {
        data: updatedData,
        error: updateError
      } =
        await supabase.auth.admin.updateUserById(
          user.id,
          {
            user_metadata: {
              ...metadata,
              username,
              display_name: displayName,
              arxzen_registered: true,
              registration_method: provider
            }
          }
        );

      if (updateError) {
        return res.status(500).json({
          error:
            `ARX-OAUTH-${provider.toUpperCase()}-004: Unable to register OAuth account.`,
          details:
            updateError.message
        });
      }

      finalUser =
        updatedData.user || user;
    }

    const frontend =
      process.env.FRONTEND_URL;

    if (!frontend) {
      return res.status(500).json({
        error:
          `ARX-OAUTH-${provider.toUpperCase()}-005: FRONTEND_URL is not configured.`
      });
    }

    /*
     * Do NOT put tokens into the query string.
     *
     * Supabase's browser OAuth flow returns the
     * session in the URL hash, which the React
     * OAuthCallback page processes.
     */

    return res.redirect(
      `${frontend}/oauth/callback?provider=${provider}&mode=${mode || "login"}`
    );
  } catch (error) {
    next(error);
  }
}

/*
|--------------------------------------------------------------------------
| Google OAuth
|--------------------------------------------------------------------------
*/

async function googleOAuth(req, res, next) {
  return startOAuth(
    req,
    res,
    "google",
    next
  );
}

async function googleOAuthCallback(
  req,
  res,
  next
) {
  return finishOAuth(
    req,
    res,
    "google",
    next
  );
}

/*
|--------------------------------------------------------------------------
| Discord OAuth
|--------------------------------------------------------------------------
*/

async function discordOAuth(req, res, next) {
  return startOAuth(
    req,
    res,
    "discord",
    next
  );
}

async function discordOAuthCallback(
  req,
  res,
  next
) {
  return finishOAuth(
    req,
    res,
    "discord",
    next
  );
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
