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
      await authClient.auth.exchangeCodeForSession(code);

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

    const frontend = process.env.FRONTEND_URL;

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
      `${frontend}/register#oauth=google&access_token=${accessToken}&refresh_token=${refreshToken}`
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
      await authClient.auth.exchangeCodeForSession(code);

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

    const frontend = process.env.FRONTEND_URL;

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
      `${frontend}/register#oauth=discord&access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (error) {
    next(error);
  }
}
  discordOAuth,
  discordOAuthCallback
};
