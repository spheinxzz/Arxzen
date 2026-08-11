const supabase = require("../config/supabase");

async function getProfile(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Profile not found"
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updates = {};

    if (req.body.username !== undefined)
      updates.username = req.body.username;

    if (req.body.displayName !== undefined)
      updates.display_name = req.body.displayName;

    if (req.body.bio !== undefined)
      updates.bio = req.body.bio;

    if (req.body.avatarUrl !== undefined)
      updates.avatar_url = req.body.avatarUrl;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) {
      return next(error);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
