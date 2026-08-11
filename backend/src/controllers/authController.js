const {
  supabase,
  authClient
} = require("../config/supabase");

function cleanUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24);
}

function fallbackUsername(user) {
  const metadata = user?.user_metadata || {};

  const candidates = [
    metadata.username,
    metadata.preferred_username,
    metadata.user_name,
    metadata.full_name,
    metadata.name,
    user?.email?.split("@")[0]
  ];

  for (const candidate of candidates) {
    const username = cleanUsername(candidate);

    if (username.length >= 3) {
      return username;
    }
  }

  return `user${String(user.id).replace(/-/g, "").slice(0, 8)}`;
}

function getDisplayName(user) {
  const metadata = user?.user_metadata || {};

  return (
    metadata.display_name ||
    metadata.full_name ||
    metadata.name ||
    user?.email?.split("@")[0] ||
    "Arxzen User"
  );
}

function getAvatarUrl(user) {
  const metadata = user?.user_metadata || {};

  return (
    metadata.avatar_url ||
    metadata.picture ||
    null
  );
}

async function usernameExists(username, userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .limit(1);

  if (error) {
    throw error;
  }

  return Array.isArray(data) && data.length > 0;
}

async function generateUniqueUsername(user) {
  const base = fallbackUsername(user);

  let username = base;
  let counter = 1;

  while (await usernameExists(username, user.id)) {
    username = `${base}${counter}`;
    counter += 1;

    if (counter > 9999) {
      username =
        `${base}${Math.random()
          .toString(36)
          .slice(2, 8)}`;

      break;
    }
  }

  return username;
}

async function ensureProfile(user, provider = "email") {
  if (!user?.id) {
    throw new Error(
      "ARX-PROFILE-000: Authenticated user ID is missing."
    );
  }

  const {
    data: existingProfile,
    error: lookupError
  } = await supabase
    .from("profiles")
    .select(
      "id,username,display_name,bio,avatar_url,is_online,last_seen_at,created_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existingProfile) {
    return existingProfile;
  }

  const username =
    await generateUniqueUsername(user);

  const displayName =
    getDisplayName(user);

  const avatarUrl =
    getAvatarUrl(user);

  const profile = {
    id: user.id,
    username,
    display_name: displayName,
    bio: "",
    avatar_url: avatarUrl,
    is_online: true
  };

  const {
    data: createdProfile,
    error: createError
  } = await supabase
    .from("profiles")
    .insert(profile)
    .select(
      "id,username,display_name,bio,avatar_url,is_online,last_seen_at,created_at"
    )
    .single();

  if (createError) {
    if (
      createError.code === "23505"
    ) {
      const {
        data: retryProfile,
        error: retryError
      } = await supabase
        .from("profiles")
        .select(
          "id,username,display_name,bio,avatar_url,is_online,last_seen_at,created_at"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (retryError) {
        throw retryError;
      }

      if (retryProfile) {
        return retryProfile;
      }
    }

    throw createError;
  }

  return createdProfile;
}

async function register(req, res, next) {
  try {
    const {
      email,
      password,
      username,
      displayName
    } = req.body;

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    const cleanUsername =
      cleanUsernameValue(username);

    const cleanDisplayName =
      String(displayName || "").trim();

    if (!cleanEmail) {
      return res.status(400).json({
        error:
          "ARX-REG-002: Email is required."
      });
    }

    if (!password) {
      return res.status(400).json({
        error:
          "ARX-REG-003: Password is required."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error:
          "ARX-REG-004: Password must contain at least 8 characters."
      });
    }

    if (!cleanUsername) {
      return res.status(400).json({
        error:
          "ARX-REG-005: Username is required."
      });
    }

    if (!cleanDisplayName) {
      return res.status(400).json({
        error:
          "ARX-REG-006: Display name is required."
      });
    }

    const {
      data: existingUsers,
      error: existingUserError
    } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (existingUserError) {
      throw existingUserError;
    }

    const existingUser =
      existingUsers?.users?.find(
        (user) =>
          user.email?.toLowerCase() ===
          cleanEmail
      );

    if (existingUser) {
      return res.status(409).json({
        error:
          "ARX-REG-001: A user with this email address has already been registered."
      });
    }

    const usernameTaken =
      await usernameExists(
        cleanUsername,
        "00000000-0000-0000-0000-000000000000"
      );

    if (usernameTaken) {
      return res.status(409).json({
        error:
          "ARX-REG-007: That username is already registered."
      });
    }

    const {
      data,
      error
    } =
      await supabase.auth.admin.createUser({
        email: cleanEmail,
        password,
        email_confirm: false,
        user_metadata: {
          username: cleanUsername,
          display_name: cleanDisplayName
        }
      });

    if (error) {
      return res.status(400).json({
        error:
          "ARX-REG-001: " +
          error.message
      });
    }

    if (!data?.user) {
      return res.status(500).json({
        error:
          "ARX-REG-008: Account was not created."
      });
    }

    const profile =
      await ensureProfile(
        data.user,
        "email"
      );

    return res.status(201).json({
      message: "Account created",
      registered: true,
      user: data.user,
      profile
    });
  } catch (error) {
    next(error);
  }
}

function cleanUsernameValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24);
}

async function login(req, res, next) {
  try {
    const email =
      String(req.body.email || "")
        .trim()
        .toLowerCase();

    const password =
      req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        error:
          "ARX-LOGIN-000: Email and password are required."
      });
    }

    const {
      data,
      error
    } =
      await authClient.auth.signInWithPassword({
        email,
        password
      });

    if (error || !data?.user) {
      return res.status(401).json({
        error:
          "ARX-LOGIN-001: Account is not registered or the credentials are invalid."
      });
    }

    const profile =
      await ensureProfile(
        data.user,
        "email"
      );

    return res.json({
      message: "Login successful",
      registered: true,
      user: data.user,
      profile,
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
    const { email } =
      req.body || {};

    if (
      !email ||
      !String(email).trim()
    ) {
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

    const { error } =
      await authClient.auth.resetPasswordForEmail(
        String(email)
          .trim()
          .toLowerCase(),
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

    let profile = null;

    if (data?.user) {
      profile =
        await ensureProfile(
          data.user,
          "email"
        );
    }

    return res.json({
      message: "Email verified",
      registered: true,
      user:
        data?.user || null,
      profile,
      session:
        data?.session || null
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

async function startOAuth(
  provider,
  req,
  res,
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

    const callback =
      `${backend}/api/auth/oauth/${provider}/callback`;

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

async function finishOAuth(
  provider,
  req,
  res,
  next
) {
  try {
    const { code } =
      req.query;

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

    const profile =
      await ensureProfile(
        data.user,
        provider
      );

    const frontend =
      process.env.FRONTEND_URL;

    if (!frontend) {
      return res.status(500).json({
        error:
          `ARX-OAUTH-${provider.toUpperCase()}-004: FRONTEND_URL is not configured.`
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
      `${frontend}/oauth/callback#access_token=${accessToken}&refresh_token=${refreshToken}&provider=${provider}&registered=true`
    );
  } catch (error) {
    next(error);
  }
}

async function googleOAuth(
  req,
  res,
  next
) {
  return startOAuth(
    "google",
    req,
    res,
    next
  );
}

async function googleOAuthCallback(
  req,
  res,
  next
) {
  return finishOAuth(
    "google",
    req,
    res,
    next
  );
}

async function discordOAuth(
  req,
  res,
  next
) {
  return startOAuth(
    "discord",
    req,
    res,
    next
  );
}

async function discordOAuthCallback(
  req,
  res,
  next
) {
  return finishOAuth(
    "discord",
    req,
    res,
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
