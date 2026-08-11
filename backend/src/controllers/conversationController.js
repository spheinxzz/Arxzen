const supabase = require("../config/supabase");

async function list(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("conversation_members")
      .select(`
        conversation_id,
        joined_at,
        last_read_at,
        is_admin,
        conversations (
          id,
          type,
          name,
          avatar_url,
          created_by,
          created_at,
          updated_at
        )
      `)
      .eq("user_id", req.user.id);

    if (error) {
      return next(error);
    }

    res.json(
      (data || []).map(row => ({
        ...row.conversations,
        joinedAt: row.joined_at,
        lastReadAt: row.last_read_at,
        isAdmin: row.is_admin
      }))
    );
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const {
      type = "direct",
      name = null,
      avatarUrl = null,
      participantIds = []
    } = req.body;

    const participants = [
      req.user.id,
      ...participantIds.filter(
        id => id !== req.user.id
      )
    ];

    const uniqueParticipants =
      [...new Set(participants)];

    if (uniqueParticipants.length < 2) {
      return res.status(400).json({
        error: "At least two participants are required"
      });
    }

    const { data: conversation, error } =
      await supabase
        .from("conversations")
        .insert({
          type,
          name,
          avatar_url: avatarUrl,
          created_by: req.user.id
        })
        .select()
        .single();

    if (error) {
      return next(error);
    }

    const members =
      uniqueParticipants.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
        is_admin: userId === req.user.id
      }));

    const { error: memberError } =
      await supabase
        .from("conversation_members")
        .insert(members);

    if (memberError) {
      await supabase
        .from("conversations")
        .delete()
        .eq("id", conversation.id);

      return next(memberError);
    }

    res.status(201).json(conversation);
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    const { data: membership } =
      await supabase
        .from("conversation_members")
        .select("user_id")
        .eq("conversation_id", req.params.id)
        .eq("user_id", req.user.id)
        .maybeSingle();

    if (!membership) {
      return res.status(403).json({
        error: "Not a conversation member"
      });
    }

    const { data, error } =
      await supabase
        .from("conversations")
        .select(`
          *,
          conversation_members (
            user_id,
            joined_at,
            last_read_at,
            is_admin
          )
        `)
        .eq("id", req.params.id)
        .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Conversation not found"
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
  get
};
