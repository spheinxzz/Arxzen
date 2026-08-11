const supabase = require("../config/supabase");

async function getUser(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id,username,display_name,bio,avatar_url,is_online,last_seen_at,created_at"
      )
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function searchUsers(req, res, next) {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id,username,display_name,bio,avatar_url,is_online"
      )
      .or(
        `username.ilike.%${query}%,display_name.ilike.%${query}%`
      )
      .limit(25);

    if (error) {
      return next(error);
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUser,
  searchUsers
};
