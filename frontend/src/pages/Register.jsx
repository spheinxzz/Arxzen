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
  const [error, setError] = useState("");

  /*
   * Temporary frontend gate.
   *
   * IMPORTANT:
   * This should eventually be validated by the
   * backend instead of exposing the code here.
   */
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

    const cleanEmail = email.trim();
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

      /*
       * Email verification should happen before
       * allowing the user into the application.
       *
       * The backend/Supabase should return whether
       * verification is required.
       */

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

      setError(
        err?.message ||
          "ARX-010: Unable to create your Arxzen account."
      );
    } finally {
      setLoading(false);
    }
  }

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

              <div className="relative flex min-h-[700px] flex-col justify-between p-10">
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
                        disabled={loading}
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

function ErrorMessage({ message }) {
  return (
    <div className="mb-5 rounded-2xl border border-red-500/[0.15] bg-red-500/[0.05] p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

        <div>
          <p className="text-sm font-medium text-red-400">
            Unable to continue
          </p>

          <p className="mt-1 text-xs leading-5 text-red-400/60">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;