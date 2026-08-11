import {
  Bell,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


function Notifications() {
  return (
    <main className="min-h-screen bg-[#07090d] text-white">

      <header className="flex h-16 items-center border-b border-white/[0.06] px-5">

        <Link
          to="/home"
          className="mr-4 text-xs text-zinc-600 hover:text-white"
        >
          Dashboard
        </Link>

        <h1 className="text-sm font-semibold">
          Notifications
        </h1>

      </header>


      <section className="mx-auto max-w-2xl p-5">

        <div className="rounded-xl border border-white/[0.06] bg-[#0b0d11] p-10 text-center">

          <Bell
            size={22}
            className="mx-auto text-zinc-800"
          />

          <p className="mt-4 text-xs font-medium text-zinc-500">
            No notifications
          </p>

          <p className="mt-1 text-[10px] text-zinc-800">
            You're all caught up.
          </p>

        </div>

      </section>

    </main>
  );
}

export default Notifications;