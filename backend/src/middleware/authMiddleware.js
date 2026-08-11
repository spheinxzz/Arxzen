const { authClient } = require("../config/supabase");

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }

    const token = header.substring(7);

    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid or expired session"
      });
    }

    req.user = data.user;
    req.accessToken = token;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;
