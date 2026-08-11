import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const navigation = [
  {
    name: "Home",
    path: "/home",
    icon: "⌂"
  },
  {
    name: "Messages",
    path: "/messages",
    icon: "◌"
  },
  {
    name: "Profile",
    path: "/profile/me",
    icon: "○"
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "⚙"
  }
];

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-[#07080c] text-zinc-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.06] bg-[#0a0b10] md:flex md:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/[0.06] px-5">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-sm font-black shadow-lg shadow-blue-500/20">
              A
            </div>

            <span className="text-lg font-bold tracking-tight">
              Arxzen
            </span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-5">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-700">
            Navigate
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-lg text-base transition",
                        isActive
                          ? "bg-blue-500/10"
                          : "bg-transparent"
                      ].join(" ")}
                    >
                      {item.icon}
                    </span>

                    <span>{item.name}</span>

                    {item.name === "Messages" && (
                      <span className="ml-auto rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                        2
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Future sections */}
          <div className="mt-8">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-700">
              Arxzen
            </p>

            <button
              type="button"
              disabled
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.02]">
                ★
              </span>

              <span>Achievements</span>

              <span className="ml-auto text-[9px]">
                SOON
              </span>
            </button>

            <button
              type="button"
              disabled
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.02]">
                ◈
              </span>

              <span>Plugins</span>

              <span className="ml-auto text-[9px]">
                SOON
              </span>
            </button>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold">
                {user?.displayName
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a0b10] bg-emerald-500" />
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile/me")}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-medium">
                {user?.displayName || "Arxzen User"}
              </p>

              <p className="truncate text-xs text-zinc-600">
                @{user?.username || "username"}
              </p>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="rounded-lg p-2 text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#090a0f]/90 px-5 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-sm font-black">
              A
            </div>

            <span className="font-bold">
              Arxzen
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-zinc-400"
          >
            ⚙
          </button>
        </header>

        <main className="min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;