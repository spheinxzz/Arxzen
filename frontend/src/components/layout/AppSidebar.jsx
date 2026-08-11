import {
  Home,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Search,
  ShieldCheck
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getSession } from "../../services/sessionService";

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();

  const username = session?.username || "user";

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/login", {
        replace: true
      });
    }
  }

  return (
    <aside className="hidden h-screen w-[270px] shrink-0 flex-col border-r border-white/[0.06] bg-[#090a0f] lg:flex">

      <div className="flex h-[76px] items-center border-b border-white/[0.06] px-5">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-3"
        >
          <img
            src="/icons/Arxzen.png"
            alt="Arxzen"
            className="h-10 w-10 rounded-xl object-cover"
          />

          <div className="text-left">
            <p className="text-[15px] font-bold tracking-tight text-white">
              Arxzen
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">
              Communication
            </p>
          </div>
        </button>
      </div>

      <div className="px-4 pt-5">
        <button
          type="button"
          onClick={() => navigate("/messages")}
          className="flex h-10 w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 text-left text-sm text-zinc-600 transition hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-zinc-400"
        >
          <Search size={16} />

          <span>
            Find someone...
          </span>

          <span className="ml-auto rounded-md border border-white/[0.06] px-1.5 py-0.5 text-[10px] text-zinc-700">
            /
          </span>
        </button>
      </div>

      <nav className="flex-1 px-3 pt-5">

        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Workspace
        </p>

        <NavItem
          icon={<Home size={18} />}
          label="Home"
          active={location.pathname === "/home"}
          onClick={() => navigate("/home")}
        />

        <NavItem
          icon={<MessageCircle size={18} />}
          label="Messages"
          active={location.pathname.startsWith("/messages")}
          onClick={() => navigate("/messages")}
        />

        <NavItem
          icon={<User size={18} />}
          label="Profile"
          active={location.pathname.startsWith("/profile")}
          onClick={() => navigate("/profile/me")}
        />

        <div className="my-5 h-px bg-white/[0.05]" />

        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Account
        </p>

        <NavItem
          icon={<ShieldCheck size={18} />}
          label="Security"
          active={false}
          onClick={() => navigate("/settings")}
        />

        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          active={location.pathname === "/settings"}
          onClick={() => navigate("/settings")}
        />
      </nav>

      <div className="border-t border-white/[0.06] p-3">

        <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-sm font-semibold text-blue-400">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-200">
              @{username}
            </p>

            <p className="text-xs text-zinc-700">
              Online
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-red-500/[0.07] hover:text-red-400"
        >
          <LogOut size={17} />

          <span>
            Log out
          </span>
        </button>

      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition",
        active
          ? "bg-blue-500/[0.1] text-blue-400"
          : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-300"
      ].join(" ")}
    >
      {icon}

      <span>
        {label}
      </span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
    </button>
  );
}

export default AppSidebar;