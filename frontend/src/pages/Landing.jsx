import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Users,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#07080c] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[140px]" />

        <div className="absolute bottom-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-indigo-600/[0.05] blur-[140px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/[0.05]">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <img
              src="/icons/Arxzen.svg"
              alt="Arxzen"
              className="h-10 w-10 rounded-xl object-cover"
            />

            <div className="text-left">
              <p className="text-[15px] font-bold tracking-tight">
                Arxzen
              </p>

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-700">
                Communication
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
            >
              Log in
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Create account
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-8 sm:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-blue-500/[0.15] bg-blue-500/[0.05] px-3.5 py-2 text-xs font-medium text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              A new way to communicate
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              Communication
              <br />

              <span className="text-zinc-600">
                without the noise.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Arxzen is a Random Communication Platform made by me :)
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/register")}
                className="group flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Get started

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-zinc-300 transition hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute inset-0 rounded-[30px] bg-blue-500/[0.06] blur-[80px]" />

            <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0b0d12] shadow-2xl">
              <div className="flex h-12 items-center gap-2 border-b border-white/[0.06] px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />

                <div className="ml-4 h-7 flex-1 rounded-lg bg-white/[0.025]" />
              </div>

              <div className="grid min-h-[360px] grid-cols-[190px_1fr]">
                <div className="border-r border-white/[0.05] p-4">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/Arxzen.svg"
                      alt=""
                      className="h-7 w-7 rounded-lg"
                    />

                    <span className="text-xs font-semibold">
                      Arxzen
                    </span>
                  </div>

                  <div className="mt-7 space-y-1">
                    <div className="rounded-lg bg-blue-500/[0.08] px-3 py-2 text-xs text-blue-400">
                      Messages
                    </div>

                    <div className="px-3 py-2 text-xs text-zinc-700">
                      Profile
                    </div>

                    <div className="px-3 py-2 text-xs text-zinc-700">
                      Settings
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Messages
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-700">
                        Your conversations
                      </p>
                    </div>

                    <MessageCircle
                      size={18}
                      className="text-zinc-700"
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-500/10" />

                      <div>
                        <div className="h-2.5 w-24 rounded-full bg-white/[0.07]" />
                        <div className="mt-2 h-2 w-40 rounded-full bg-white/[0.035]" />
                      </div>
                    </div>

                    <div className="ml-auto flex max-w-[65%] items-start justify-end gap-3">
                      <div>
                        <div className="ml-auto h-2.5 w-28 rounded-full bg-blue-500/20" />
                        <div className="mt-2 ml-auto h-2 w-36 rounded-full bg-blue-500/10" />
                      </div>

                      <div className="h-9 w-9 rounded-full bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-white/[0.05] bg-white/[0.01]">
          <div className="mx-auto grid max-w-6xl gap-px bg-white/[0.05] sm:grid-cols-3">
            <Feature
              icon={<MessageCircle size={20} />}
              title="Real conversations"
              description="Connect with people through username-based conversations instead of one giant public chat."
            />

            <Feature
              icon={<ShieldCheck size={20} />}
              title="Built around security"
              description="Sessions, account protection, authentication and privacy are part of the platform."
            />

            <Feature
              icon={<Users size={20} />}
              title="Built to grow"
              description="Communities, groups, bots, AI and developer tools can grow alongside the platform."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-5 py-28 text-center sm:px-8">
          <Sparkles
            size={24}
            className="mx-auto text-blue-400"
          />

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-5xl">
            Your conversations.
            <br />

            <span className="text-zinc-600">
              Your identity.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-zinc-700">
            Create your Arxzen account
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-8 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-semibold transition hover:bg-blue-400"
          >
            Create an account
          </button>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-xs text-zinc-800 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <img
              src="/icons/Arxzen.svg"
              alt=""
              className="h-5 w-5 rounded-md"
            />

            <span>
              Arxzen
            </span>
          </div>

          <span>
            random Communication Platform made my me :), building like ai because vibe coders are jews
          </span>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-[#0b0d12] p-7 sm:p-8">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
        {icon}
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-700">
        {description}
      </p>
    </div>
  );
}

export default Landing;