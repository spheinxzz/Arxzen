import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Globe2,
  MessageCircle,
} from "lucide-react";

import {
  login,
  loginWithGoogle,
  loginWithDiscord,
} from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError(
        "ARX-001: Email address is required."
      );
      return;
    }

    if (!password) {
      setError(
        "ARX-002: Password is required."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        cleanEmail,
        password
      );

      if (!result) {
        throw new Error(
          "ARX-003: Unable to authenticate your account."
        );
      }

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
          "ARX-003: Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setOauthLoading("google");

    try {
      await loginWithGoogle({
        mode: "login",
      });
    } catch (err) {
      console.error(
        "Google login error:",
        err
      );

      setError(
        err?.message ||
          "ARX-AUTH-020: This Google account is not registered with Arxzen."
      );

      setOauthLoading("");
    }
  }

  async function handleDiscordLogin() {
    setError("");
    setOauthLoading("discord");

    try {
      await loginWithDiscord({
        mode: "login",
      });
    } catch (err) {
      console.error(
        "Discord login error:",
        err
      );

      setError(
        err?.message ||
          "ARX-AUTH-021: This Discord account is not registered with Arxzen."
      );

      setOauthLoading("");
    }
  }

  const oauthDisabled =
    loading || oauthLoading !== "";

  return (
    <main className="min-h-screen bg-[#07080b] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[140px]" />

        <div className="absolute bottom-[-220px] right-[-160px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[140px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.05]">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <img
              src="/icons/Arxzen.svg"
              alt="Arxzen"
              className="h-10 w-10 rounded-xl object-cover"
            />

            <div>
              <p className="text-[15px] font-bold">
                Arxzen
              </p>

              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                Communication
              </p>
            </div>
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Create account
          </Link>
        </nav>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-77px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0d12] shadow-2xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">

            <aside className="relative hidden overflow-hidden border-r border-white/[0.06] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.13),transparent_38%)]" />

              <div className="relative flex min-h-[700px] flex-col justify-between p-10">
                <div>
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-12 w-12 rounded-2xl"
                  />

                  <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Private communication
                  </p>

                  <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                    Welcome
                    <br />
                    back.
                  </h1>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-600">
                    Sign in to your Arxzen account
                    and continue your conversations,
                    connections, and private
                    communication.
                  </p>
                </div>

                <div className="space-y-3">
                  <InfoCard
                    icon={<ShieldCheck size={17} />}
                    title="Private by design"
                    description="Your account and conversations are protected through Arxzen's authentication system."
                  />

                  <InfoCard
                    icon={<LockKeyhole size={17} />}
                    title="Secure session"
                    description="Your authenticated session is restored automatically when you return."
                  />
                </div>
              </div>
            </aside>

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mx-auto max-w-md">

                <div className="mb-8 lg:hidden">
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-11 w-11 rounded-xl"
                  />
                </div>

                <div className="mb-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                    <LockKeyhole size={18} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Account access
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight">
                    Sign in to Arxzen
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Enter your account credentials
                    to continue.
                  </p>
                </div>

                {error && (
                  <ErrorMessage message={error} />
                )}

                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <Field
                    id="email"
                    label="Email address"
                    icon={<Mail size={15} />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400"
                      >
                        <LockKeyhole
                          size={15}
                          className="text-zinc-700"
                        />

                        Password
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-xs text-zinc-700 transition hover:text-blue-400"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="login-input pr-12"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) =>
                              !current
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-700 transition hover:bg-white/[0.04] hover:text-zinc-400"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      oauthLoading !== ""
                    }
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Signing in..."
                      : "Sign in"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.05]" />

                  <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-800">
                    or continue with
                  </span>

                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>

                <div className="space-y-3">
                  <OAuthButton
                    icon={<Globe2 size={17} />}
                    label="Continue with Google"
                    loading={
                      oauthLoading === "google"
                    }
                    disabled={oauthDisabled}
                    onClick={
                      handleGoogleLogin
                    }
                  />

                  <OAuthButton
                    icon={
                      <MessageCircle size={17} />
                    }
                    label="Continue with Discord"
                    loading={
                      oauthLoading === "discord"
                    }
                    disabled={oauthDisabled}
                    onClick={
                      handleDiscordLogin
                    }
                  />
                </div>

                <div className="my-7 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/[0.05]" />

                  <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-800">
                    Arxzen
                  </span>

                  <div className="h-px flex-1 bg-white/[0.05]" />
                </div>

                <p className="text-center text-[11px] leading-5 text-zinc-700">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-400 transition hover:text-blue-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .login-input {
          height: 48px;
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: #080a0f;
          padding: 0 16px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: 150ms ease;
        }

        .login-input::placeholder {
          color: rgb(39 39 42);
        }

        .login-input:focus {
          border-color: rgba(59,130,246,0.5);
          background: rgba(255,255,255,0.025);
        }
      `}</style>
    </main>
  );
}

function Field({
  id,
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-400"
      >
        <span className="text-zinc-700">
          {icon}
        </span>

        {label}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="login-input"
      />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-400">
          {title}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-zinc-700">
          {description}
        </p>
      </div>
    </div>
  );
}

function OAuthButton({
  icon,
  label,
  loading,
  disabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-400" />
      ) : (
        icon
      )}

      {loading
        ? "Connecting..."
        : label}
    </button>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="mb-5 rounded-2xl border border-red-500/[0.15] bg-red-500/[0.05] p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

        <div>
          <p className="text-sm font-medium text-red-400">
            Unable to sign in
          </p>

          <p className="mt-1 text-xs leading-5 text-red-400/60">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;