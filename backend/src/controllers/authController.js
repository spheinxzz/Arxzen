const supabase = require("../config/supabase");
const { authClient } = require("../config/supabase");

async function register(req, res, next) {
  try {
    const {
      email,
      password,
      username,
      displayName
    } = req.body;

    const { data, error } = await supabase.auth.admin.createUser({
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
        error: error.message
      });
    }

    res.status(201).json({
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
        error: error.message
      });
    }

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.json({
    message: "Logged out successfully"
  });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body || {};

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        error: "Email is required"
      });
    }

    const { error } = await authClient.auth.resetPasswordForEmail(
      String(email).trim(),
      {
        redirectTo: `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password`
      }
    );

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
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
        error: "Email and verification code are required"
      });
    }

    const { data, error } = await authClient.auth.verifyOtp({
      email: String(email).trim().toLowerCase(),
      token: String(code),
      type: "email"
    });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.json({
      message: "Email verified",
      user: data?.user || null,
      session: data?.session || null
    });
  } catch (error) {
    next(error);
  }
}

async function getSession(req, res) {
  res.json({
    user: req.user
  });
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  verifyEmail,
  getSession
};
