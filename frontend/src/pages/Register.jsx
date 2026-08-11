import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

import {
  registerAccount,
  loginWithGoogle,
  loginWithDiscord,
} from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("code");
  const [testerCode, setTesterCode] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");
  const [error, setError] = useState("");

  const TESTER_ACCESS_CODE =
    "ARXZEN-TEST-0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

  function handleTesterCode(event) {
    event.preventDefault();

    setError("");

    const enteredCode = testerCode.trim();

    if (!enteredCode) {
      setError(
        "ARX-TEST-001: Tester access code is required."
      );
      return;
    }

    if (enteredCode !== TESTER_ACCESS_CODE) {
      setError(
        "ARX-TEST-002: Invalid tester access code."
      );
      return;
    }

    setStep("account");
  }

  async function handleRegister(event) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const cleanDisplayName = displayName.trim();

    if (!cleanEmail) {
      setError(
        "ARX-004: Email address is required."
      );
      return;
    }

    if (!password) {
      setError(
        "ARX-005: Password is required."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "ARX-006: Password must contain at least 8 characters."
      );
      return;
    }

    if (!cleanUsername) {
      setError(
        "ARX-007: Username is required."
      );
      return;
    }

    if (!cleanDisplayName) {
      setError(
        "ARX-008: Display name is required."
      );
      return;
    }

    setLoading(true);

    try {
      const account = await registerAccount({
        email: cleanEmail,
        password,
        username: cleanUsername,
        displayName: cleanDisplayName,
        testerCode: testerCode.trim(),
      });

      if (!account) {
        throw new Error(
          "ARX-010: Account creation failed."
        );
      }

      navigate("/verify-email", {
        replace: true,
        state: {
          email: cleanEmail,
          username: cleanUsername,
        },
      });
    } catch (err) {
      console.error(
        "Registration error:",
        err
      );

      const message =
        err?.response?.data?.error ||
        err?.message ||
        "ARX-010: Unable to create your Arxzen account.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    if (oauthLoading) return;

    setError("");
    setOauthLoading("google");

    try {
      await loginWithGoogle({
        mode: "register",
        testerCode: testerCode.trim(),
      });
    } catch (err) {
      console.error(
        "Google registration error:",
        err
      );

      setOauthLoading("");
      setError(
        err?.message ||
          "ARX-OAUTH-GOOGLE-001: Unable to start Google registration."
      );
    }
  }

  async function handleDiscordRegister() {
    if (oauthLoading) return;

    setError("");
    setOauthLoading("discord");

    try {
      await loginWithDiscord({
        mode: "register",
        testerCode: testerCode.trim(),
      });
    } catch (err) {
      console.error(
        "Discord registration error:",
        err
      );

      setOauthLoading("");
      setError(
        err?.message ||
          "ARX-OAUTH-DISCORD-001: Unable to start Discord registration."
      );
    }
  }

  const oauthDisabled =
    loading || oauthLoading !== "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080c] text-white">
      <div className="absolute left-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[140px]" />

      <div className="absolute bottom-[-220px] right-[-160px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[140px]" />

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
            to="/login"
            className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-77px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0d12] shadow-2xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="relative hidden overflow-hidden border-r border-white/[0.06] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.13),transparent_38%)]" />

              <div className="relative flex min-h-[760px] flex-col justify-between p-10">
                <div>
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-12 w-12 rounded-2xl"
                  />

                  <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Private testing
                  </p>

                  <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                    Join
                    <br />
                    Arxzen.
                  </h1>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-600">
                    Create your Arxzen account and
                    join the private communication
                    platform.
                  </p>
                </div>

                <div className="space-y-3">
                  <InfoCard
                    icon={<ShieldCheck size={17} />}
                    title="Private testing"
                    description="Registration is currently limited to approved testers."
                  />

                  <InfoCard
                    icon={<Mail size={17} />}
                    title="Email verification"
                    description="Your email address must be verified before account access."
                  />

                  <InfoCard
                    icon={<Check size={17} />}
                    title="Secure account"
                    description="Authentication is handled through the Arxzen backend and Supabase."
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

                {step === "code" && (
                  <>
                    <div className="mb-8">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                        <LockKeyhole size={18} />
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                        Tester access
                      </p>

                      <h2 className="mt-3 text-3xl font-bold tracking-tight">
                        Enter your code
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Arxzen is currently in private
                        testing. Enter your tester
                        access code to continue.
                      </p>
                    </div>

                    {error && (
                      <ErrorMessage message={error} />
                    )}

                    <form
                      onSubmit={handleTesterCode}
                      className="space-y-5"
                    >
                      <Field
                        id="tester-code"
                        label="Tester access code"
                        icon={
                          <LockKeyhole size={15} />
                        }
                        type="password"
                        value={testerCode}
                        onChange={setTesterCode}
                        placeholder="Enter your tester code"
                        autoComplete="off"
                      />

                      <button
                        type="submit"
                        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400"
                      >
                        Continue

                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </button>
                    </form>

                    <p className="mt-6 text-center text-[10px] leading-5 text-zinc-800">
                      Tester access is currently
                      required to create an Arxzen
                      account.
                    </p>
                  </>
                )}

                {step === "account" && (
                  <>
                    <div className="mb-8">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                        <User size={18} />
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                        Create account
                      </p>

                      <h2 className="mt-3 text-3xl font-bold tracking-tight">
                        Your Arxzen account
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Set up your account information
                        to continue.
                      </p>
                    </div>

                    {error && (
                      <ErrorMessage message={error} />
                    )}

                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={oauthDisabled}
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {oauthLoading === "google" ? (
                          "Connecting to Google..."
                        ) : (
                          <>
                            <GoogleIcon />
                            Continue with Google
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleDiscordRegister}
                        disabled={oauthDisabled}
                        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {oauthLoading === "discord" ? (
                          "Connecting to Discord..."
                        ) : (
                          <>
                            <DiscordIcon />
                            Continue with Discord
                          </>
                        )}
                      </button>
                    </div>

                    <div className="my-7 flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/[0.06]" />

                      <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-700">
                        or
                      </span>

                      <div className="h-px flex-1 bg-white/[0.06]" />
                    </div>

                    <form
                      onSubmit={handleRegister}
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
                        <label
                          htmlFor="password"
                          className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-400"
                        >
                          <LockKeyhole
                            size={15}
                            className="text-zinc-700"
                          />

                          Password
                        </label>

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
                            placeholder="Create a password"
                            autoComplete="new-password"
                            className="register-input pr-12"
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
                          >
                            {showPassword ? (
                              <EyeOff size={17} />
                            ) : (
                              <Eye size={17} />
                            )}
                          </button>
                        </div>
                      </div>

                      <Field
                        id="username"
                        label="Username"
                        icon={<User size={15} />}
                        value={username}
                        onChange={setUsername}
                        placeholder="Choose a username"
                        autoComplete="username"
                      />

                      <Field
                        id="display-name"
                        label="Display name"
                        icon={<User size={15} />}
                        value={displayName}
                        onChange={setDisplayName}
                        placeholder="Your display name"
                        autoComplete="name"
                      />

                      <button
                        type="submit"
                        disabled={loading || oauthLoading !== ""}
                        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading
                          ? "Creating account..."
                          : "Create account"}

                        {!loading && (
                          <ArrowRight
                            size={17}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        )}
                      </button>
                    </form>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep("code");
                      }}
                      className="mt-6 w-full text-xs text-zinc-700 transition hover:text-zinc-400"
                    >
                      Back to tester code
                    </button>
                  </>
                )}

                <p className="mt-8 text-center text-[11px] leading-5 text-zinc-700">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 transition hover:text-blue-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .register-input {
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

        .register-input::placeholder {
          color: rgb(39 39 42);
        }

        .register-input:focus {
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
        className="register-input"
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
    <div className="flex gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/[0.06] text-blue-400">
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

function ErrorMessage({ message }) {
  return (
    <div className="mb-5 rounded-xl border border-red-500/[0.12] bg-red-500/[0.04] p-4">
      <p className="text-sm font-medium text-red-400">
        Unable to continue
      </p>

      <p className="mt-1 text-xs leading-5 text-red-400/60">
        {message}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 21.92c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.92Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 14.01a5.85 5.85 0 0 1 0-3.76V7.72H3.3a9.75 9.75 0 0 0 0 8.82l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.22c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.33 14.63 2.46 12 2.46a9.74 9.74 0 0 0-8.7 5.26l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="text-[#5865F2]"
    >
      <path d="M19.54 5.14A16.15 16.15 0 0 0 15.5 3.9l-.49 1.02a14.9 14.9 0 0 0-5.99 0L8.53 3.9c-1.42.24-2.77.66-4.04 1.24C1.94 9.06 1.25 12.9 1.6 16.69a16.2 16.2 0 0 0 4.97 2.51l1.2-1.63c-.66-.24-1.3-.54-1.9-.9l.46-.36c3.67 1.72 7.65 1.72 11.28 0l.46.36c-.6.36-1.24.66-1.9.9l1.2 1.63a16.2 16.2 0 0 0 4.97-2.51c.42-4.4-.71-8.2-2.8-11.55ZM8.35 14.25c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2c1.12 0 2.01.99 2 2.2 0 1.21-.88 2.2-2 2.2Zm7.3 0c-1.1 0-2-.99-2-2.2s.88-2.2 2-2.2c1.12 0 2.01.99 2 2.2 0 1.21-.88 2.2-2 2.2Z" />
    </svg>
  );
}

export default Register;
