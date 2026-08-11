import useAuth from "../../hooks/useAuth";
import useMessages from "../../hooks/useMessages";

import Message from "./Message";
import MessageInput from "./MessageInput";
import ConversationMenu from "./ConversationMenu";

function Conversation({
  conversation,
  onBack
}) {
  const { user } = useAuth();

  const {
  messages,
  loading,
  sendMessage
} = useMessages(
  conversation.uuid
);

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#090a0f] px-4 py-3">
        {/* Mobile Back */}
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.05] hover:text-white sm:hidden"
          title="Back"
        >
          ←
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold">
            {conversation.displayName
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>

          {conversation.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#090a0f] bg-emerald-500" />
          )}
        </div>

        {/* User Info */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">
            {conversation.displayName}
          </h1>

          <p className="truncate text-xs text-zinc-600">
            {conversation.online
              ? "Online"
              : `@${conversation.username}`}
          </p>
        </div>

        {/* Menu */}
        <ConversationMenu />
      </header>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <ConversationIntro
            conversation={conversation}
          />

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-blue-500" />

              <p className="mt-3 text-sm text-zinc-600">
                Loading messages...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-600">
                No messages yet.
              </p>

              <p className="mt-1 text-xs text-zinc-700">
                Send the first message.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Composer */}
      <MessageInput
        onSend={sendMessage}
      />
    </div>
  );
}

function ConversationIntro({
  conversation
}) {
  return (
    <div className="mb-8 border-b border-white/[0.05] pb-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold">
        {conversation.displayName
          ?.charAt(0)
          ?.toUpperCase() || "?"}
      </div>

      <h2 className="mt-4 text-lg font-semibold">
        {conversation.displayName}
      </h2>

      <p className="mt-1 text-sm text-zinc-600">
        @{conversation.username}
      </p>

      <p className="mt-3 text-xs text-zinc-700">
        This is the beginning of your conversation.
      </p>
    </div>
  );
}

export default Conversation;