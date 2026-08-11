import { Link } from "react-router-dom";
import { Edit3, Shield } from "lucide-react";

function ProfileCard({ profile }) {
  const username = profile?.username || "Username";
  const displayName = profile?.displayName || "Username";
  const bio = profile?.bio || "No bio yet.";
  const avatar = profile?.avatar || "";

  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#0b0d11]">
      <div className="h-24 rounded-t-xl bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_65%)]" />

      <div className="px-5 pb-5">
        <div className="-mt-10 flex items-end justify-between">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-20 w-20 rounded-2xl border-4 border-[#0b0d11] object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#0b0d11] bg-[#15171d] text-xl font-semibold text-zinc-500">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}

          <Link
            to="/settings"
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-[11px] text-zinc-500 transition hover:bg-white/[0.04] hover:text-white"
          >
            <Edit3 size={13} />
            Edit profile
          </Link>
        </div>

        <div className="mt-4">
          <h2 className="text-base font-semibold">{displayName}</h2>

          <p className="mt-1 text-xs text-zinc-700">
            @{username}
          </p>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {bio}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2 text-[10px] text-zinc-700">
          <Shield size={13} />
          Arxzen account
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;