import { Link } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";

import {
  getSessionUser,
  getSession,
} from "../services/sessionService";

import { useMessages } from "../hooks/useMessages";


function Home() {
  const user =
    getSessionUser();

  const session =
    getSession();

  const {
    conversations = [],
  } = useMessages();


  const username =
    user?.username || "User";

  const displayName =
    user?.displayName ||
    user?.username ||
    "User";


  return (
    <div className="flex min-h-screen bg-[#07090d] text-white">

      {/* SIDEBAR */}

      <aside className="hidden w-[220px] shrink-0 border-r border-white/[0.06] bg-[#0a0b0f] md:flex md:flex-col">

        <div className="flex h-[64px] items-center border-b border-white/[0.05] px-4">
          <Link
            to="/home"
            className="flex items-center gap-2.5"
          >
            <img
              src="/icons/Arxzen.svg"
              alt="Arxzen"
              className="h-8 w-8 rounded-lg"
            />

            <span className="text-sm font-semibold">
              Arxzen
            </span>
          </Link>
        </div>


        <nav className="flex-1 p-3">

          <NavItem
            to="/home"
            icon={<MessageCircle size={16} />}
            label="Home"
            active
          />

          <NavItem
            to="/messages"
            icon={<MessageCircle size={16} />}
            label="Messages"
          />

          <NavItem
            to="/people"
            icon={<Users size={16} />}
            label="People"
          />

          <NavItem
            to="/notifications"
            icon={<Bell size={16} />}
            label="Notifications"
          />


          <div className="my-4 h-px bg-white/[0.05]" />


          <p className="px-2 pb-2 text-[9px] font-medium uppercase tracking-wider text-zinc-700">
            Account
          </p>


          <NavItem
            to={`/profile/${username}`}
            icon={<User size={16} />}
            label="Profile"
          />

          <NavItem
            to="/settings"
            icon={<Settings size={16} />}
            label="Settings"
          />

          <NavItem
            to="/settings/security"
            icon={<Shield size={16} />}
            label="Security"
          />

        </nav>


        <div className="border-t border-white/[0.05] p-3">

          <Link
            to={`/profile/${username}`}
            className="flex items-center gap-2.5 rounded-lg p-2 transition hover:bg-white/[0.04]"
          >

            <Avatar
              name={displayName}
              online
            />

            <div className="min-w-0">

              <p className="truncate text-xs font-medium text-zinc-300">
                {displayName}
              </p>

              <p className="truncate text-[10px] text-zinc-700">
                @{username}
              </p>

            </div>

          </Link>

        </div>

      </aside>


      {/* MAIN */}

      <main className="min-w-0 flex-1">

        {/* TOP BAR */}

        <header className="flex h-[64px] items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">

          <div>

            <h1 className="text-sm font-semibold">
              Home
            </h1>

            <p className="text-[10px] text-zinc-700">
              Your Arxzen activity
            </p>

          </div>


          <div className="flex items-center gap-2">

            <Link
              to="/messages"
              className="hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-300 sm:flex"
            >
              <Search size={14} />
              Search
            </Link>


            <Link
              to="/settings"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-zinc-600 transition hover:bg-white/[0.04] hover:text-zinc-300"
            >
              <Settings size={15} />
            </Link>

          </div>

        </header>


        {/* CONTENT */}

        <div className="mx-auto max-w-[1000px] p-4 sm:p-6">

          {/* MOBILE NAV */}

          <div className="mb-5 flex gap-1 overflow-x-auto md:hidden">

            <MobileNav
              to="/home"
              label="Home"
              active
            />

            <MobileNav
              to="/messages"
              label="Messages"
            />

            <MobileNav
              to="/people"
              label="People"
            />

            <MobileNav
              to="/settings"
              label="Settings"
            />

          </div>


          {/* WELCOME */}

          <section className="mb-5">

            <h2 className="text-xl font-semibold tracking-tight">
              Welcome back, {displayName}
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              What are you up to?
            </p>

          </section>


          {/* SEARCH */}

          <Link
            to="/messages"
            className="mb-5 flex h-11 items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0c0e13] px-4 text-xs text-zinc-700 transition hover:border-white/[0.1] hover:text-zinc-500"
          >

            <Search size={15} />

            Search for a username...

            <span className="ml-auto hidden rounded-md border border-white/[0.05] px-1.5 py-0.5 text-[9px] text-zinc-800 sm:block">
              /
            </span>

          </Link>


          {/* GRID */}

          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">


            {/* CONVERSATIONS */}

            <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">

              <div className="flex h-12 items-center justify-between border-b border-white/[0.05] px-4">

                <div className="flex items-center gap-2">

                  <MessageCircle
                    size={15}
                    className="text-zinc-600"
                  />

                  <h3 className="text-xs font-semibold">
                    Recent conversations
                  </h3>

                </div>


                <Link
                  to="/messages"
                  className="text-[10px] text-zinc-700 transition hover:text-zinc-400"
                >
                  View all
                </Link>

              </div>


              {conversations.length === 0 ? (
                <EmptyConversations />
              ) : (
                <div>

                  {conversations.map(
                    (conversation) => (
                      <Conversation
                        key={
                          conversation.id ||
                          conversation.uuid
                        }
                        conversation={
                          conversation
                        }
                      />
                    )
                  )}

                </div>
              )}

            </section>


            {/* RIGHT COLUMN */}

            <aside className="space-y-4">


              {/* ACCOUNT */}

              <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">

                <div className="border-b border-white/[0.05] px-4 py-3">

                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                    Account
                  </p>

                </div>


                <div className="p-4">

                  <div className="flex items-center gap-3">

                    <Avatar
                      name={displayName}
                      online
                    />

                    <div>

                      <p className="text-xs font-medium text-zinc-300">
                        {displayName}
                      </p>

                      <p className="text-[10px] text-zinc-700">
                        @{username}
                      </p>

                    </div>

                  </div>


                  <Link
                    to={`/profile/${username}`}
                    className="mt-4 flex h-9 items-center justify-center rounded-lg border border-white/[0.06] text-[11px] text-zinc-500 transition hover:bg-white/[0.03] hover:text-zinc-300"
                  >
                    View profile
                  </Link>

                </div>

              </section>


              {/* SESSION */}

              {session && (
                <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">

                  <div className="border-b border-white/[0.05] px-4 py-3">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                      Session
                    </p>

                  </div>


                  <div className="p-4">

                    <p className="text-[9px] uppercase tracking-wider text-zinc-700">
                      Session ID
                    </p>

                    <p className="mt-2 break-all font-mono text-[10px] text-zinc-500">
                      {session.session_id}
                    </p>

                  </div>

                </section>
              )}


              {/* QUICK ACTIONS */}

              <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">

                <div className="border-b border-white/[0.05] px-4 py-3">

                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                    Quick actions
                  </p>

                </div>


                <div className="p-2">

                  <QuickAction
                    to="/messages"
                    icon={
                      <Plus size={14} />
                    }
                    label="New conversation"
                  />

                  <QuickAction
                    to="/people"
                    icon={
                      <Search size={14} />
                    }
                    label="Find a user"
                  />

                  <QuickAction
                    to="/settings/security"
                    icon={
                      <Shield size={14} />
                    }
                    label="Security"
                  />

                </div>

              </section>

            </aside>

          </div>


          {/* FOOTER */}

          <footer className="mt-8 flex items-center justify-between border-t border-white/[0.04] pt-4 text-[9px] text-zinc-800">

            <span>
              Arxzen v0.1
            </span>

            <div className="flex gap-4">

              <Link
                to="/settings"
                className="hover:text-zinc-600"
              >
                Settings
              </Link>

              <span>
                Communication Platform
              </span>

            </div>

          </footer>

        </div>

      </main>

    </div>
  );
}


/* ================================
NAV ITEM
================================ */

function NavItem({
  to,
  icon,
  label,
  active = false,
}) {
  return (
    <Link
      to={to}
      className={`mb-1 flex h-9 items-center gap-3 rounded-lg px-3 text-xs transition ${
        active
          ? "bg-white/[0.06] text-white"
          : "text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300"
      }`}
    >
      {icon}

      <span>
        {label}
      </span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </Link>
  );
}


/* ================================
MOBILE NAV
================================ */

function MobileNav({
  to,
  label,
  active = false,
}) {
  return (
    <Link
      to={to}
      className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] ${
        active
          ? "border-white/[0.08] bg-white/[0.05] text-white"
          : "border-white/[0.05] text-zinc-600"
      }`}
    >
      {label}
    </Link>
  );
}


/* ================================
CONVERSATION
================================ */

function Conversation({
  conversation,
}) {
  const conversationId =
    conversation.uuid ||
    conversation.id;

  const username =
    conversation.username ||
    conversation.user?.username ||
    "Unknown";

  const displayName =
    conversation.displayName ||
    conversation.display_name ||
    conversation.user?.displayName ||
    conversation.user?.username ||
    "Unknown";


  return (
    <Link
      to={`/messages/${conversationId}`}
      className="group flex items-center gap-3 border-b border-white/[0.04] px-4 py-3 transition last:border-0 hover:bg-white/[0.025]"
    >

      <Avatar
        name={displayName}
        online={
          conversation.online === true
        }
      />


      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <p className="truncate text-xs font-medium text-zinc-300">
            {displayName}
          </p>

          {username && (
            <span className="truncate text-[9px] text-zinc-800">
              @{username}
            </span>
          )}

        </div>


        <p className="mt-1 truncate text-[11px] text-zinc-700">
          {conversation.lastMessage ||
            conversation.message ||
            "No messages yet"}
        </p>

      </div>


      <div className="flex shrink-0 items-center gap-2">

        {conversation.time && (
          <span className="text-[9px] text-zinc-800">
            {conversation.time}
          </span>
        )}


        {conversation.unread > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[8px] font-semibold text-white">
            {conversation.unread}
          </span>
        )}


        <ChevronRight
          size={13}
          className="text-zinc-900 transition group-hover:text-zinc-600"
        />

      </div>

    </Link>
  );
}


/* ================================
QUICK ACTION
================================ */

function QuickAction({
  to,
  icon,
  label,
}) {
  return (
    <Link
      to={to}
      className="flex h-9 items-center gap-3 rounded-lg px-3 text-[11px] text-zinc-600 transition hover:bg-white/[0.035] hover:text-zinc-300"
    >

      {icon}

      <span>
        {label}
      </span>

      <ChevronRight
        size={12}
        className="ml-auto text-zinc-800"
      />

    </Link>
  );
}


/* ================================
AVATAR
================================ */

function Avatar({
  name,
  online = false,
}) {
  const letter =
    name?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <div className="relative shrink-0">

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15171d] text-[11px] font-semibold text-zinc-500">
        {letter}
      </div>


      {online && (
        <span className="absolute bottom-[-1px] right-[-1px] h-2.5 w-2.5 rounded-full border-2 border-[#0b0d11] bg-green-400" />
      )}

    </div>
  );
}


/* ================================
EMPTY STATE
================================ */

function EmptyConversations() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] text-zinc-700">
        <MessageCircle size={18} />
      </div>


      <p className="mt-4 text-xs font-medium text-zinc-500">
        No conversations yet
      </p>


      <p className="mt-1 max-w-xs text-[10px] leading-5 text-zinc-800">
        Search for someone's username to start
        a conversation.
      </p>


      <Link
        to="/messages"
        className="mt-5 rounded-lg border border-white/[0.06] px-4 py-2 text-[10px] text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-300"
      >
        Find someone
      </Link>

    </div>
  );
}


export default Home;