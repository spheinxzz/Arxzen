import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  KeyRound,
  Shield,
} from "lucide-react";
import {
  updatePassword,
} from "../services/authService";

function Security() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePassword(event) {
    event.preventDefault();
    setStatus("");

    if (newPassword.length < 8) {
      setStatus("ARX-004: Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("ARX-005: Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setStatus("Password updated.");
    } catch {
      setStatus("ARX-001: Unable to update your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-5">
          <Link
            to="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <h1 className="text-sm font-semibold">Security</h1>
            <p className="text-[10px] text-zinc-700">
              Protect your Arxzen account
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <div className="space-y-5">
          <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">
            <div className="flex items-center gap-4 border-b border-white/[0.05] px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
                <Shield size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Password security
                </h2>

                <p className="mt-1 text-[11px] text-zinc-700">
                  Password changes are supported through the API contract for this workspace.
                </p>
              </div>
            </div>

            <div className="px-5 py-4 text-[11px] text-zinc-700">
              Two-factor authentication is not implemented by the current backend API surface, so the 2FA controls are intentionally not exposed in the UI.
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">
            <div className="flex items-center gap-4 border-b border-white/[0.05] px-5 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-400">
                <KeyRound size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Change password
                </h2>

                <p className="mt-1 text-[11px] text-zinc-700">
                  Use a strong password that you do not reuse elsewhere.
                </p>
              </div>
            </div>

            <form onSubmit={handlePassword} className="space-y-4 p-5">
              <input
                type="password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="New password"
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#080a0f] px-4 text-sm text-white outline-none placeholder:text-zinc-800 focus:border-blue-500/40"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm new password"
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#080a0f] px-4 text-sm text-white outline-none placeholder:text-zinc-800 focus:border-blue-500/40"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex h-10 items-center gap-2 rounded-lg bg-white/[0.05] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] disabled:opacity-50"
              >
                <Check size={14} />
                Update password
              </button>
            </form>
          </section>

          {status && (
            <div className="rounded-xl border border-white/[0.06] bg-[#0b0d11] px-4 py-3 text-xs text-zinc-500">
              {status}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Security;