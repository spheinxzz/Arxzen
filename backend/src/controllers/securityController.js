const supabase = require("../config/supabase");

async function listSessions(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("user_id", req.user.id)
      .is("revoked_at", null)
      .order("last_active_at", {
        ascending: false
      });

    if (error) {
      return next(error);
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
}

async function revokeSession(req, res, next) {
  try {
    const { data, error } =
      await supabase
        .from("user_sessions")
        .update({
          revoked_at:
            new Date().toISOString()
        })
        .eq("id", req.params.id)
        .eq("user_id", req.user.id)
        .select()
        .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Session not found"
      });
    }

    res.json({
      message: "Session revoked",
      session: data
    });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    const { password } = req.body || {};

    const newPassword = password || req.body?.newPassword;

    if (!newPassword || String(newPassword).trim().length < 8) {
      return res.status(400).json({
        error: "A new password with at least 8 characters is required"
      });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      req.user.id,
      {
        password: String(newPassword)
      }
    );

    if (error) {
      return next(error);
    }

    res.json({
      message: "Password updated",
      user: data?.user || null
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listSessions,
  revokeSession,
  changePassword
};
