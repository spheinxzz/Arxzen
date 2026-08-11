import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { verifyEmail } from "../services/authService";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ||
    "your email address";

  const [code, setCode] = useState([
    "",
    "",
    "",
    "",
    "",
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendCooldown, setResendCooldown] =
    useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  function updateCode(index, value) {
    const digit = value.replace(/\D/g, "");

    if (!digit) {
      const next = [...code];
      next[index] = "";
      setCode(next);
      return;
    }

    const next = [...code];
    next[index] = digit[0];

    setCode(next);
    setError("");
    setSuccess("");

    if (
      index < code.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < code.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = [...code];

    pasted.split("").forEach(
      (digit, index) => {
        next[index] = digit;
      }
    );

    setCode(next);

    const nextIndex = Math.min(
      pasted.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const verificationCode = code.join("");

    setError("");
    setSuccess("");

    if (verificationCode.length !== 6) {
      setError(
        "ARX-027: Enter the complete 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      const result = await verifyEmail({
        email,
        code: verificationCode,
      });

      if (!result?.message) {
        throw new Error("ARX-001: Unable to verify email.");
      }

      setSuccess(
        result.message || "Email verified successfully."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 900);
    } catch (err) {
      console.error(
        "Email verification error:",
        err
      );

      setError(
        err?.message || "ARX-001: Unable to connect to Arxzen."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    if (resendCooldown > 0) return;

    setError("");
    setSuccess("");

    try {
      /*
        Connect this to your actual resend
        verification-code service.
      */

      setSuccess(
        "A new verification code has been sent."
      );

      setResendCooldown(30);
    } catch (err) {
      console.error(
        "Resend code error:",
        err
      );

      setError(
        "ARX-003: Email code couldn't be sent."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]" />

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
                Verification
              </p>
            </div>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={15} />

            Sign in
          </Link>
        </nav>
      </header>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-77px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b0d12] shadow-2xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left panel */}
            <aside className="relative hidden overflow-hidden border-r border-white/[0.06] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.12),transparent_40%)]" />

              <div className="relative flex min-h-[620px] flex-col justify-between p-10">
                <div>
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-12 w-12 rounded-2xl"
                  />

                  <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Security
                  </p>

                  <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
                    Verify
                    <br />
                    your email.
                  </h1>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-600">
                    Confirming your email helps protect
                    your account and ensures that you
                    control the address associated with it.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-zinc-400">
                        Account protection
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-zinc-700">
                        Never share your verification
                        code with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Verification panel */}
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mx-auto max-w-md">
                {/* Mobile logo */}
                <div className="mb-8 lg:hidden">
                  <img
                    src="/icons/Arxzen.svg"
                    alt="Arxzen"
                    className="h-11 w-11 rounded-xl"
                  />
                </div>

                <div className="mb-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/[0.08] text-blue-400">
                    <Mail size={20} />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Email verification
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight">
                    Check your inbox
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    We sent a 6-digit verification code
                    to
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-zinc-300">
                    {email}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-5 rounded-2xl border border-red-500/[0.15] bg-red-500/[0.05] p-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />

                      <div>
                        <p className="text-sm font-medium text-red-400">
                          Verification failed
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-400/60">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="mb-5 rounded-2xl border border-green-500/[0.15] bg-green-500/[0.05] p-4">
                    <div className="flex gap-3">
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-green-400"
                      />

                      <p className="text-sm text-green-400">
                        {success}
                      </p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                >
                  <label className="mb-3 block text-sm font-medium text-zinc-400">
                    Verification code
                  </label>

                  <div
                    className="flex gap-2 sm:gap-3"
                    onPaste={handlePaste}
                  >
                    {code.map(
                      (digit, index) => (
                        <input
                          key={index}
                          ref={(element) => {
                            inputRefs.current[
                              index
                            ] = element;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(event) =>
                            updateCode(
                              index,
                              event.target.value
                            )
                          }
                          onKeyDown={(event) =>
                            handleKeyDown(
                              index,
                              event
                            )
                          }
                          className="h-14 w-full rounded-xl border border-white/[0.07] bg-[#080a0f] text-center text-lg font-semibold text-white outline-none transition focus:border-blue-500/50 focus:bg-white/[0.025]"
                          aria-label={`Verification digit ${
                            index + 1
                          }`}
                        />
                      )
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify email"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </form>

                {/* Resend */}
                <div className="mt-7 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-400">
                        Didn't receive the code?
                      </p>

                      <p className="mt-1 text-[11px] text-zinc-700">
                        Check your spam or junk folder.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resendCode}
                      disabled={
                        resendCooldown > 0
                      }
                      className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/[0.06] disabled:cursor-not-allowed disabled:text-zinc-800"
                    >
                      <RefreshCw
                        size={14}
                        className={
                          resendCooldown === 0
                            ? ""
                            : "opacity-50"
                        }
                      />

                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend code"}
                    </button>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-700 transition hover:text-zinc-400"
                >
                  <ArrowLeft size={13} />

                  Use a different registration method
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default VerifyEmail;