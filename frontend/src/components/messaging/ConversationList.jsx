const conversations = [
  {
    uuid: "34656dsfv-45g4254-34xgf234dqfaw-4gwrxg23x",
    username: "alex",
    displayName: "Alex",
    lastMessage: "Yeah, I'm looking forward to it.",
    online: true,
    unread: 2
  },
  {
    uuid: "8c4e7a12-93f5-4b62-a891-27d5f4c90311",
    username: "nova",
    displayName: "Nova",
    lastMessage: "I'm working on the messaging system.",
    online: false,
    unread: 0
  },
  {
    uuid: "f1a98d43-6c22-4e75-b891-53c7d2a10462",
    username: "cyber",
    displayName: "Cyber",
    lastMessage: "See you tomorrow.",
    online: true,
    unread: 1
  }
];

function ConversationList({
  selectedConversation,
  onSelect
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/[0.06] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">
              Messages
            </h1>

            <p className="mt-1 text-xs text-zinc-600">
              Private conversations
            </p>
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-500 transition hover:bg-white/[0.08] hover:text-white"
            title="New message"
          >
            +
          </button>
        </div>
      </div>

      <div className="border-b border-white/[0.06] p-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
          <span className="text-zinc-600">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search messages"
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {conversations.map((conversation) => {
          const selected =
            selectedConversation?.uuid ===
            conversation.uuid;

          return (
            <button
              key={conversation.uuid}
              type="button"
              onClick={() =>
                onSelect(conversation)
              }
              className={[
                "mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition",
                selected
                  ? "bg-blue-500/10"
                  : "hover:bg-white/[0.03]"
              ].join(" ")}
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-sm font-semibold">
                  {conversation.displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                {conversation.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0b10] bg-emerald-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={[
                      "truncate text-sm font-medium",
                      selected
                        ? "text-blue-400"
                        : "text-zinc-200"
                    ].join(" ")}
                  >
                    {conversation.displayName}
                  </p>

                  {conversation.unread > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>

                <p className="mt-1 truncate text-xs text-zinc-600">
                  {conversation.lastMessage}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ConversationList;
