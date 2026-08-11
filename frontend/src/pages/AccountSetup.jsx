import { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AtSign,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  User,
  Mail,
} from "lucide-react";

function AccountSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const provider = (
    searchParams.get("provider") || "email"
  ).toLowerCase();

  const isEmail = provider === "email";
  const isGoogle = provider === "google";
  const isDiscord = provider === "discord";

  const providerName = useMemo(() => {
    if (isGoogle) return "Google";
    if (isDiscord) return "Discord";
    return "Email";
  }, [isGoogle, isDiscord]);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!username.trim()) {
      return "ARX-020: A username is required.";
    }

    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
      return "ARX-021: Username must contain 3-24 letters, numbers, or underscores.";
    }

    if (!isDiscord && !displayName.trim()) {
      return "ARX-022: A display name is required.";
    }

    if (isEmail && !email.trim()) {
      return "ARX-023: An email address is required.";
    }

    if (isEmail && !password) {
      return "ARX-024: A password is required.";
    }

    if (isEmail && password.length < 8) {
      return "ARX-025: Password must contain at least 8 characters.";
    }

    if (
      isEmail &&
      password !== confirmPassword
    ) {
      return "ARX-026: Passwords do not match.";
    }

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      /*
        Account creation should be connected here
        to your actual auth/account service.

        The information collected here is:

        Email:
          email
          password
          username
          displayName

        Google:
          username
          displayName

        Discord:
          username
          Discord identity
          optional 2FA setup
      */

      const accountData = {
        provider,
        email: isEmail ? email.trim() : null,
        username: username.trim(),
        displayName: isDiscord
          ? username.trim()
          : displayName.trim(),
        password: isEmail ? password : null,
        twoFactorEnabled: isDiscord
          ? twoFactorEnabled
          : false,
      };

      console.log(
        "Account setup data:",
        accountData
      );

      if (isEmail) {
        navigate("/verify-email", {
          replace: true,
          state: {
            email: email.trim(),
            username: username.trim(),
          },
        });

        return;
      }

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Account setup error:",
        err
      );

      setError(
        "ARX-001: Unable to connect to Arxzen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]" />

        <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.05] blur-[140px]" />
      </div>

      {/* Header */}
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
                Account setup
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

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-77px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0d12] shadow-2xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Sidebar */}
            <aside className="relative hidden border-r border-white/[0.06] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%)]" />

              <div className="relative flex min-h-[690px] flex-col justify-between p-10">
                <div>
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-12 w-12 rounded-2xl"
                  />

                  <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Step 1
                  </p>

                  <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                    Set up
                    <br />
                    your identity.
                  </h1>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-600">
                    Your account identity determines how
                    other people find and recognize you
                    throughout Arxzen.
                  </p>
                </div>

                <div className="space-y-3">
                  <SetupStep
                    active
                    number="01"
                    title="Account identity"
                    description={`Connected through ${providerName}`}
                  />

                  <SetupStep
                    number="02"
                    title="Verification"
                    description={
                      isEmail
                        ? "Verify your email address"
                        : "Confirm your account"
                    }
                  />

                  <SetupStep
                    number="03"
                    title="Arxzen"
                    description="Enter the platform"
                  />
                </div>
              </div>
            </aside>

            {/* Form */}
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mx-auto max-w-lg">
                {/* Mobile brand */}
                <div className="mb-8 lg:hidden">
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-11 w-11 rounded-xl"
                  />
                </div>

                <div className="mb-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                    <User size={18} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Account setup
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight">
                    Create your identity
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    You're registering through{" "}
                    <span className="text-zinc-400">
                      {providerName}
                    </span>
                    .
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-500/[0.15] bg-red-500/[0.05] p-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

                      <div>
                        <p className="text-sm font-medium text-red-400">
                          Setup failed
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-400/60">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email */}
                  {isEmail && (
                    <Field
                      label="Email address"
                      htmlFor="email"
                      icon={<Mail size={16} />}
                    >
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="setup-input"
                      />
                    </Field>
                  )}

                  {/* Display name */}
                  {!isDiscord && (
                    <Field
                      label="Display name"
                      htmlFor="displayName"
                      icon={<User size={16} />}
                    >
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(event) =>
                          setDisplayName(
                            event.target.value
                          )
                        }
                        placeholder="How people see you"
                        maxLength={40}
                        required
                        className="setup-input"
                      />
                    </Field>
                  )}

                  {/* Username */}
                  <Field
                    label="Username"
                    htmlFor="username"
                    icon={<AtSign size={16} />}
                  >
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-zinc-700">
                        @
                      </span>

                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) =>
                          setUsername(
                            event.target.value
                          )
                        }
                        placeholder="username"
                        maxLength={24}
                        required
                        className="setup-input pl-9"
                      />
                    </div>
                  </Field>

                  {/* Discord identity */}
                  {isDiscord && (
                    <div className="rounded-2xl border border-[#5865F2]/15 bg-[#5865F2]/[0.04] p-4">
                      <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/10 text-[#7289DA]">
                          <ShieldCheck size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-zinc-300">
                            Discord identity
                          </p>

                          <p className="mt-1 text-xs leading-5 text-zinc-600">
                            Your Discord username will be
                            used as your Arxzen identity.
                            You won't need a separate
                            Arxzen password.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email password */}
                  {isEmail && (
                    <>
                      <Field
                        label="Password"
                        htmlFor="password"
                        icon={<LockKeyhole size={16} />}
                      >
                        <PasswordInput
                          id="password"
                          value={password}
                          onChange={setPassword}
                          show={showPassword}
                          setShow={setShowPassword}
                          placeholder="Create a secure password"
                        />
                      </Field>

                      <Field
                        label="Confirm password"
                        htmlFor="confirmPassword"
                        icon={<LockKeyhole size={16} />}
                      >
                        <PasswordInput
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={setConfirmPassword}
                          show={showConfirmPassword}
                          setShow={
                            setShowConfirmPassword
                          }
                          placeholder="Enter your password again"
                        />
                      </Field>
                    </>
                  )}

                  {/* Discord 2FA */}
                  {isDiscord && (
                    <button
                      type="button"
                      onClick={() =>
                        setTwoFactorEnabled(
                          (current) => !current
                        )
                      }
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        twoFactorEnabled
                          ? "border-blue-500/30 bg-blue-500/[0.05]"
                          : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          twoFactorEnabled
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-white/[0.04] text-zinc-600"
                        }`}
                      >
                        {twoFactorEnabled ? (
                          <Check size={18} />
                        ) : (
                          <ShieldCheck size={18} />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-300">
                          Enable 2FA
                        </p>

                        <p className="mt-1 text-xs text-zinc-700">
                          Protect your Arxzen account with
                          an authenticator.
                        </p>
                      </div>

                      <div
                        className={`h-5 w-9 rounded-full p-1 transition ${
                          twoFactorEnabled
                            ? "bg-blue-500"
                            : "bg-white/[0.08]"
                        }`}
                      >
                        <div
                          className={`h-3 w-3 rounded-full bg-white transition-transform ${
                            twoFactorEnabled
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        />
                      </div>
                    </button>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Setting up..."
                      : "Continue"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-[10px] leading-5 text-zinc-800">
                  You can review your account security
                  settings after setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .setup-input {
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

        .setup-input::placeholder {
          color: rgb(39 39 42);
        }

        .setup-input:focus {
          border-color: rgba(59,130,246,0.5);
          background: rgba(255,255,255,0.025);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  htmlFor,
  icon,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-400"
      >
        <span className="text-zinc-700">
          {icon}
        </span>

        {label}
      </label>

      {children}
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete="new-password"
        required
        className="setup-input pr-12"
      />

      <button
        type="button"
        onClick={() =>
          setShow((current) => !current)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-700 transition hover:bg-white/[0.04] hover:text-zinc-400"
      >
        {show ? (
          <EyeOff size={17} />
        ) : (
          <Eye size={17} />
        )}
      </button>
    </div>
  );
}

function SetupStep({
  number,
  title,
  description,
  active = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        active
          ? "border-blue-500/15 bg-blue-500/[0.04]"
          : "border-white/[0.05] bg-white/[0.015]"
      }`}
    >
      <div className="flex gap-3">
        <span
          className={`text-[10px] font-bold ${
            active
              ? "text-blue-400"
              : "text-zinc-800"
          }`}
        >
          {number}
        </span>

        <div>
          <p
            className={`text-xs font-medium ${
              active
                ? "text-zinc-300"
                : "text-zinc-600"
            }`}
          >
            {title}
          </p>

          <p className="mt-1 text-[11px] text-zinc-800">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AccountSetup;