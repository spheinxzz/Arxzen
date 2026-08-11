
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  UserPlus,
  Users,
  MessageCircle,
  Shield,
} from "lucide-react";

function People() {
  return (
    <div className="min-h-screen bg-[#08090c] text-white">
      <header className="border-b border-white/[0.06] bg-[#0a0b0f]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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

          <Link
            to="/home"
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300"
          >
            <ArrowLeft size={14} />
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="max-w-2xl">
          <div className="mb-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
              <Users size={18} />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400">
              Arxzen People
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Find people
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Search for an Arxzen username to find someone
              and start a conversation.
            </p>
          </div>

          <section className="rounded-2xl border border-white/[0.06] bg-[#0b0d11]">
            <div className="border-b border-white/[0.05] p-4">
              <label
                htmlFor="people-search"
                className="mb-2 block text-xs font-medium text-zinc-400"
              >
                Search username
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700"
                />

                <input
                  id="people-search"
                  type="search"
                  placeholder="Search by username..."
                  className="h-12 w-full rounded-xl border border-white/[0.06] bg-[#080a0e] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-800 focus:border-blue-500/40"
                />
              </div>
            </div>

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] text-zinc-700">
                <Users size={20} />
              </div>

              <h2 className="mt-4 text-sm font-medium text-zinc-400">
                Search for someone
              </h2>

              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-700">
                Enter a username above to find an Arxzen
                account.
              </p>
            </div>
          </section>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <InfoCard
              icon={<UserPlus size={15} />}
              title="Find users"
              description="Search Arxzen usernames."
            />

            <InfoCard
              icon={<MessageCircle size={15} />}
              title="Start conversations"
              description="Open a conversation with a user."
            />

            <InfoCard
              icon={<Shield size={15} />}
              title="Protected"
              description="User access is handled by Arxzen."
            />
          </div>

          <footer className="mt-8 border-t border-white/[0.04] pt-4 text-[9px] text-zinc-800">
            Arxzen · People
          </footer>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#0b0d11] p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-zinc-600">
        {icon}
      </div>

      <p className="mt-3 text-xs font-medium text-zinc-400">
        {title}
      </p>

      <p className="mt-1 text-[10px] leading-5 text-zinc-700">
        {description}
      </p>
    </div>
  );
}

export default People;