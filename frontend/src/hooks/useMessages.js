import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getSession,
} from "../services/sessionService";

const CONVERSATIONS_KEY =
  "arxzen_conversations";

function readConversations() {
  try {
    const raw =
      localStorage.getItem(
        CONVERSATIONS_KEY
      );

    if (!raw) {
      return [];
    }

    const data =
      JSON.parse(raw);

    return Array.isArray(data)
      ? data
      : [];
  } catch {
    return [];
  }
}

function writeConversations(
  conversations
) {
  localStorage.setItem(
    CONVERSATIONS_KEY,
    JSON.stringify(
      conversations
    )
  );
}

export function useMessages() {
  const session =
    getSession();

  const userId =
    session?.user_id;

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadConversations =
    useCallback(() => {
      if (!userId) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const all =
        readConversations();

      const mine =
        all.filter(
          (conversation) =>
            conversation.owner_id ===
            userId
        );

      setConversations(mine);
      setLoading(false);
    }, [userId]);

  useEffect(() => {
    loadConversations();

    const handler = () =>
      loadConversations();

    window.addEventListener(
      "arxzen:conversations",
      handler
    );

    return () => {
      window.removeEventListener(
        "arxzen:conversations",
        handler
      );
    };
  }, [loadConversations]);

  const createConversation =
    useCallback(
      ({
        username,
        displayName,
        userId: recipientId,
      }) => {
        if (!userId) {
          throw new Error(
            "ARX-009: No active session."
          );
        }

        if (!username) {
          throw new Error(
            "ARX-020: Username is required."
          );
        }

        const all =
          readConversations();

        const existing =
          all.find(
            (conversation) =>
              conversation.owner_id ===
                userId &&
              conversation.username ===
                username
          );

        if (existing) {
          return existing;
        }

        const conversation = {
          uuid:
            crypto.randomUUID(),

          owner_id:
            userId,

          recipient_id:
            recipientId || null,

          username,

          displayName:
            displayName ||
            username,

          messages: [],

          unread: 0,

          created_at:
            Date.now(),

          updated_at:
            Date.now(),
        };

        all.push(conversation);

        writeConversations(all);

        window.dispatchEvent(
          new Event(
            "arxzen:conversations"
          )
        );

        return conversation;
      },
      [userId]
    );

  const getConversation =
    useCallback(
      (uuid) => {
        const all =
          readConversations();

        return (
          all.find(
            (conversation) =>
              conversation.uuid ===
                uuid &&
              conversation.owner_id ===
                userId
          ) || null
        );
      },
      [userId]
    );

  const sendMessage =
    useCallback(
      (uuid, content) => {
        if (!userId) {
          throw new Error(
            "ARX-009: No active session."
          );
        }

        const text =
          content?.trim();

        if (!text) {
          throw new Error(
            "ARX-021: Message cannot be empty."
          );
        }

        const all =
          readConversations();

        const index =
          all.findIndex(
            (conversation) =>
              conversation.uuid ===
                uuid &&
              conversation.owner_id ===
                userId
          );

        if (index === -1) {
          throw new Error(
            "ARX-022: Conversation does not exist."
          );
        }

        const message = {
          id:
            crypto.randomUUID(),

          conversation_uuid:
            uuid,

          sender_id:
            userId,

          content: text,

          created_at:
            Date.now(),
        };

        all[index] = {
          ...all[index],

          messages: [
            ...(all[index].messages ||
              []),
            message,
          ],

          updated_at:
            Date.now(),
        };

        writeConversations(all);

        window.dispatchEvent(
          new Event(
            "arxzen:conversations"
          )
        );

        return message;
      },
      [userId]
    );

  return {
    conversations,
    loading,
    createConversation,
    getConversation,
    sendMessage,
    refresh:
      loadConversations,
  };
}