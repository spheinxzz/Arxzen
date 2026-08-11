import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Lock,
  Shield,
  User,
} from "lucide-react";
import { getCurrentUser, updatePassword } from "../services/authService";
import {
  updateProfile,
  getProfile,
} from "../services/profileService";

function Settings() {
  const currentUser = getCurrentUser();

  const [profile, setProfile] = useState(() => {
    const user = currentUser || {
      username: "Username",
      displayName: "Username",
      bio: "",
      avatarUrl: "",
    };

    return {
      username: user.username || "Username",
      displayName:
        user.displayName ||
        user.username ||
        "Username",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || user.avatar || "",
    };
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const userId =
    currentUser?.id ||
    currentUser?.user_id ||
    "local-user";

  async function saveProfile(event) {
    event.preventDefault();

    setStatus("");

    if (!profile.displayName.trim()) {
      setStatus("ARX-003: Display name is required.");
      return;
    }

    setSaving(true);

    try {
      await updateProfile({
        username: profile.username,
        displayName: profile.displayName.trim(),
        bio: profile.bio.trim(),
        avatarUrl: profile.avatarUrl,
      });

      setStatus("Profile updated.");
    } catch {
      setStatus("ARX-001: Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();

    setStatus("");

    if (!newPassword) {
      setStatus("ARX-003: New password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("ARX-004: Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("ARX-005: Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      await updatePassword(newPassword);

      setNewPassword("");
      setConfirmPassword("");
      setStatus("Password updated.");
    } catch {
      setStatus("ARX-001: Unable to update your password.");
    } finally {
      setSaving(false);
    }
  }

  function handleAvatar(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("ARX-006: Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((current) => ({
        ...current,
        avatarUrl: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-5">
          <Link
            to="/home"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <h1 className="text-sm font-semibold">Settings</h1>
            <p className="text-[10px] text-zinc-700">
              Manage your Arxzen account
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="grid gap-5 md:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-xl border border-white/[0.06] bg-[#0b0d11] p-2">
            <SettingsLink
              to="/settings"
              icon={<User size={15} />}
              label="Profile"
              active
            />

            <SettingsLink
              to="/settings/security"
              icon={<Shield size={15} />}
              label="Security"
            />
          </aside>

          <div className="space-y-5">
            <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">
              <div className="border-b border-white/[0.05] px-5 py-4">
                <h2 className="text-sm font-semibold">Profile</h2>
                <p className="mt-1 text-[11px] text-zinc-700">
                  Update how other people see you.
                </p>
              </div>

              <form onSubmit={saveProfile} className="p-5">
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt=""
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#15171d] text-lg font-semibold text-zinc-500">
                        {profile.displayName
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>
                    )}

                    <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#0b0d11] bg-blue-500 text-white">
                      <Camera size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatar}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-zinc-300">
                      Profile picture
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-700">
                      Choose an image for your profile.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field
                    label="Username"
                    value={profile.username}
                    disabled
                    onChange={() => {}}
                  />

                  <Field
                    label="Display name"
                    value={profile.displayName}
                    onChange={(value) =>
                      setProfile((current) => ({
                        ...current,
                        displayName: value,
                      }))
                    }
                  />

                  <div>
                    <label className="mb-2 block text-xs font-medium text-zinc-400">
                      Bio
                    </label>

                    <textarea
                      value={profile.bio}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          bio: event.target.value,
                        }))
                      }
                      maxLength={250}
                      rows={4}
                      placeholder="Tell people a little about yourself..."
                      className="w-full resize-none rounded-xl border border-white/[0.07] bg-[#080a0f] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-800 focus:border-blue-500/40"
                    />

                    <p className="mt-1 text-right text-[10px] text-zinc-800">
                      {profile.bio.length}/250
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs text-zinc-600">{status}</p>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-10 items-center gap-2 rounded-lg bg-blue-500 px-4 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
                  >
                    <Check size={14} />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">
              <div className="border-b border-white/[0.05] px-5 py-4">
                <h2 className="text-sm font-semibold">Password</h2>
                <p className="mt-1 text-[11px] text-zinc-700">
                  Change the password used to sign in.
                </p>
              </div>

              <form onSubmit={changePassword} className="space-y-4 p-5">
                <Field
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter a new password"
                />

                <Field
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm your new password"
                />

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-10 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] disabled:opacity-50"
                >
                  <Lock size={14} />
                  Change password
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsLink({ to, icon, label, active = false }) {
  return (
    <Link
      to={to}
      className={`mb-1 flex h-9 items-center gap-3 rounded-lg px-3 text-xs transition ${
        active
          ? "bg-white/[0.06] text-white"
          : "text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300"
      }`}
    >
      {icon}
      {label}
      <ChevronRight size={13} className="ml-auto opacity-30" />
    </Link>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#080a0f] px-4 text-sm text-white outline-none transition placeholder:text-zinc-800 focus:border-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40"
      />
    </div>
  );
}

export default Settings;