const supabase = require("../config/supabase");

async function list(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("message_requests")
      .select("*")
      .or(
        `sender_id.eq.${req.user.id},recipient_id.eq.${req.user.id}`
      )
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

async function create(req, res, next) {
  try {
    const recipientId = req.params.userId;
    const message = req.body.message || null;

    if (recipientId === req.user.id) {
      return res.status(400).json({
        error: "Cannot request yourself"
      });
    }

    const { data: existing } =
      await supabase
        .from("message_requests")
        .select("id")
        .eq("sender_id", req.user.id)
        .eq("recipient_id", recipientId)
        .eq("status", "pending")
        .maybeSingle();

    if (existing) {
      return res.status(409).json({
        error: "Request already exists"
      });
    }

    const { data, error } =
      await supabase
        .from("message_requests")
        .insert({
          sender_id: req.user.id,
          recipient_id: recipientId,
          message,
          status: "pending"
        })
        .select()
        .single();

    if (error) {
      return next(error);
    }

    await supabase
      .from("notifications")
      .insert({
        user_id: recipientId,
        type: "message_request",
        title: "New message request",
        message: "You received a new message request",
        related_user_id: req.user.id,
        related_request_id: data.id
      });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { status } = req.body;

    if (
      ![
        "accepted",
        "declined",
        "cancelled"
      ].includes(status)
    ) {
      return res.status(400).json({
        error: "Invalid status"
      });
    }

    let query = supabase
      .from("message_requests")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", req.params.id);

    if (status === "cancelled") {
      query = query.eq(
        "sender_id",
        req.user.id
      );
    } else {
      query = query.eq(
        "recipient_id",
        req.user.id
      );
    }

    const { data, error } =
      await query.select().single();

    if (error || !data) {
      return res.status(404).json({
        error: "Request not found"
      });
    }

    if (status === "accepted") {
      const { data: conversation } =
        await supabase
          .from("conversations")
          .insert({
            type: "direct",
            created_by: req.user.id
          })
          .select()
          .single();

      if (conversation) {
        await supabase
          .from("conversation_members")
          .insert([
            {
              conversation_id:
                conversation.id,
              user_id:
                data.sender_id
            },
            {
              conversation_id:
                conversation.id,
              user_id:
                data.recipient_id
            }
          ]);
      }
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  create,
  update
};
