import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Mail,
} from "lucide-react";

import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("ARX-001: Email address is required.");
      return;
    }

    setLoading(true);

    try {
      const result = await forgotPassword(cleanEmail);
      setSuccess(result?.message || "Password reset email sent.");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err?.message || "ARX-030: Unable to send a reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-5 text-white">

      <div className="w-full max-w-md">

        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-xs text-zinc-600 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>


        <div className="rounded-2xl border border-white/[0.06] bg-[#0b0d11] p-7">

          <Mail
            size={22}
            className="text-blue-400"
          />

          <h1 className="mt-5 text-xl font-semibold">
            Reset password
          </h1>

          <p className="mt-2 text-xs leading-5 text-zinc-700">
            Enter the email associated with your account.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs text-green-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-xs font-medium text-zinc-400">
              Email address
            </label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#080a0f] px-4 text-sm text-white outline-none placeholder:text-zinc-800 focus:border-blue-500/40"
              placeholder="you@example.com"
              autoComplete="email"
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 px-4 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

        </div>

      </div>

    </main>
  );
}

export default ForgotPassword;