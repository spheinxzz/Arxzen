const supabase = require("../config/supabase");

async function list(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", {
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

async function markRead(req, res, next) {
  try {
    const { data, error } =
      await supabase
        .from("notifications")
        .update({
          read_at:
            new Date().toISOString()
        })
        .eq("id", req.params.id)
        .eq("user_id", req.user.id)
        .select()
        .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Notification not found"
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { error } =
      await supabase
        .from("notifications")
        .delete()
        .eq("id", req.params.id)
        .eq("user_id", req.user.id);

    if (error) {
      return next(error);
    }

    res.json({
      message: "Notification deleted"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  markRead,
  remove
};
