import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";

import {
  getSession,
} from "../services/sessionService";

import {
  useMessages,
} from "../hooks/useMessages";


function Messages() {
  const {
    conversationId,
  } = useParams();

  const navigate =
    useNavigate();

  const session =
    getSession();

  const {
    conversations,
    getConversation,
    createConversation,
    sendMessage,
  } = useMessages();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");


  const activeConversation =
    conversationId
      ? getConversation(
          conversationId
        )
      : null;


  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return conversations;
      }

      return conversations.filter(
        (conversation) =>
          conversation.username
            ?.toLowerCase()
            .includes(query) ||
          conversation.displayName
            ?.toLowerCase()
            .includes(query)
      );
    }, [
      conversations,
      search,
    ]);


  function handleSend(event) {
    event.preventDefault();

    if (
      !activeConversation ||
      !message.trim()
    ) {
      return;
    }

    sendMessage(
      activeConversation.uuid,
      message
    );

    setMessage("");
  }


  return (
    <div className="flex min-h-screen bg-[#07090d] text-white">

      <aside className="hidden w-[280px] shrink-0 border-r border-white/[0.06] bg-[#0a0b0f] md:flex md:flex-col">

        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">

          <Link
            to="/home"
            className="flex items-center gap-2"
          >
            <img
              src="/icons/Arxzen.svg"
              alt="Arxzen"
              className="h-8 w-8 rounded-lg"
            />

            <span className="text-sm font-semibold">
              Messages
            </span>
          </Link>


          <button
            type="button"
            onClick={() =>
              navigate("/messages")
            }
            className="rounded-lg p-2 text-zinc-600 hover:bg-white/[0.04] hover:text-white"
          >
            <Plus size={16} />
          </button>

        </div>


        <div className="border-b border-white/[0.05] p-3">

          <div className="flex h-10 items-center gap-2 rounded-lg border border-white/[0.06] bg-[#080a0e] px-3">

            <Search
              size={14}
              className="text-zinc-700"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search conversations"
              className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-zinc-800"
            />

          </div>

        </div>


        <div className="flex-1 overflow-y-auto">

          {filtered.length === 0 ? (
            <div className="p-6 text-center">

              <MessageCircle
                size={20}
                className="mx-auto text-zinc-800"
              />

              <p className="mt-3 text-xs text-zinc-600">
                No conversations
              </p>

            </div>
          ) : (
            filtered.map(
              (conversation) => (
                <ConversationRow
                  key={
                    conversation.uuid
                  }
                  conversation={
                    conversation
                  }
                  active={
                    conversation.uuid ===
                    conversationId
                  }
                />
              )
            )
          )}

        </div>


        <div className="border-t border-white/[0.05] p-3">

          <Link
            to="/home"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-600 hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={14} />

            Dashboard
          </Link>

        </div>

      </aside>


      <main className="flex min-w-0 flex-1 flex-col">

        <header className="flex h-16 items-center border-b border-white/[0.06] px-4 sm:px-6">

          <Link
            to="/home"
            className="mr-4 rounded-lg p-2 text-zinc-600 hover:bg-white/[0.04] hover:text-white md:hidden"
          >
            <ArrowLeft size={17} />
          </Link>


          {activeConversation ? (
            <div>

              <p className="text-sm font-semibold">
                {activeConversation.displayName}
              </p>

              <p className="text-[10px] text-zinc-700">
                @{activeConversation.username}
              </p>

            </div>
          ) : (
            <div>

              <p className="text-sm font-semibold">
                Messages
              </p>

              <p className="text-[10px] text-zinc-700">
                Your conversations
              </p>

            </div>
          )}

        </header>


        {!activeConversation ? (
          <div className="flex flex-1 items-center justify-center p-6">

            <div className="max-w-sm text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-zinc-700">
                <MessageCircle size={20} />
              </div>

              <h1 className="mt-5 text-sm font-semibold">
                Select a conversation
              </h1>

              <p className="mt-2 text-xs leading-5 text-zinc-700">
                Choose a conversation from the sidebar or find someone to start a new one.
              </p>

              <Link
                to="/people"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-400"
              >
                Find people
                <ChevronRight size={14} />
              </Link>

            </div>

          </div>
        ) : (
          <>

            <div className="flex-1 overflow-y-auto p-5">

              {(activeConversation.messages ||
                []).length === 0 ? (
                <div className="flex h-full items-center justify-center">

                  <div className="text-center">

                    <p className="text-xs text-zinc-600">
                      No messages yet.
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-800">
                      Send the first message.
                    </p>

                  </div>

                </div>
              ) : (
                <div className="mx-auto max-w-3xl space-y-3">

                  {activeConversation.messages.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex justify-end"
                      >
                        <div className="max-w-[75%] rounded-2xl rounded-br-md bg-blue-500 px-4 py-2.5 text-sm text-white">
                          {item.content}
                        </div>
                      </div>
                    )
                  )}

                </div>
              )}

            </div>


            <form
              onSubmit={handleSend}
              className="border-t border-white/[0.06] p-4"
            >

              <div className="mx-auto flex max-w-3xl gap-2">

                <input
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder="Write a message..."
                  className="h-11 min-w-0 flex-1 rounded-xl border border-white/[0.07] bg-[#0b0d12] px-4 text-sm text-white outline-none placeholder:text-zinc-800 focus:border-blue-500/40"
                />

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="rounded-xl bg-blue-500 px-5 text-xs font-semibold text-white hover:bg-blue-400 disabled:opacity-30"
                >
                  Send
                </button>

              </div>

            </form>

          </>
        )}

      </main>

    </div>
  );
}


function ConversationRow({
  conversation,
  active,
}) {
  return (
    <Link
      to={`/messages/${conversation.uuid}`}
      className={`block border-b border-white/[0.04] px-4 py-3 transition ${
        active
          ? "bg-white/[0.06]"
          : "hover:bg-white/[0.03]"
      }`}
    >

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#15171d] text-xs font-semibold text-zinc-500">
          {conversation.displayName
            ?.charAt(0)
            ?.toUpperCase() ||
            "?"}
        </div>


        <div className="min-w-0">

          <p className="truncate text-xs font-medium text-zinc-300">
            {conversation.displayName}
          </p>

          <p className="truncate text-[10px] text-zinc-700">
            @{conversation.username}
          </p>

        </div>

      </div>

    </Link>
  );
}


export default Messages;