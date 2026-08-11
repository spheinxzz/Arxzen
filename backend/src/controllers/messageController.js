const supabase = require("../config/supabase");

async function isMember(conversationId, userId) {
  const { data } = await supabase
    .from("conversation_members")
    .select("user_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  return !!data;
}

async function list(req, res, next) {
  try {
    if (
      !(await isMember(
        req.params.conversationId,
        req.user.id
      ))
    ) {
      return res.status(403).json({
        error: "Not a conversation member"
      });
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq(
        "conversation_id",
        req.params.conversationId
      )
      .order("created_at", {
        ascending: true
      });

    if (error) {
      return next(error);
    }

    res.json(data || []);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const {
      conversationId,
      content,
      messageType = "text"
    } = req.body;

    if (!conversationId || !content?.trim()) {
      return res.status(400).json({
        error: "conversationId and content are required"
      });
    }

    if (
      !(await isMember(
        conversationId,
        req.user.id
      ))
    ) {
      return res.status(403).json({
        error: "Not a conversation member"
      });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: req.user.id,
        content: content.trim(),
        message_type: messageType
      })
      .select()
      .single();

    if (error) {
      return next(error);
    }

    await supabase
      .from("conversations")
      .update({
        updated_at: new Date().toISOString()
      })
      .eq("id", conversationId);

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    if (!req.body.content?.trim()) {
      return res.status(400).json({
        error: "Content is required"
      });
    }

    const { data, error } = await supabase
      .from("messages")
      .update({
        content: req.body.content.trim(),
        edited_at: new Date().toISOString()
      })
      .eq("id", req.params.id)
      .eq("sender_id", req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Message not found"
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .update({
        content: "[deleted]",
        deleted_at: new Date().toISOString()
      })
      .eq("id", req.params.id)
      .eq("sender_id", req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Message not found"
      });
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  update,
  remove
};
