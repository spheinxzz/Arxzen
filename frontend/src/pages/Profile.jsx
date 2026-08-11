import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Search,
  UserPlus,
} from "lucide-react";

import {
  getCurrentAccounts,
} from "../services/authService";

import {
  getSession,
} from "../services/sessionService";

import {
  useMessages,
} from "../hooks/useMessages";


function People() {
  const navigate =
    useNavigate();

  const session =
    getSession();

  const {
    createConversation,
  } = useMessages();

  const [
    query,
    setQuery,
  ] = useState("");

  const accounts =
    getCurrentAccounts();


  const results =
    query.trim()
      ? accounts.filter(
          (account) =>
            account.username
              .includes(
                query
                  .trim()
                  .toLowerCase()
              ) &&
            account.id !==
              session?.user_id
        )
      : [];


  function openConversation(
    account
  ) {
    const conversation =
      createConversation({
        username:
          account.username,

        displayName:
          account.displayName,

        userId:
          account.id,
      });

    navigate(
      `/messages/${conversation.uuid}`
    );
  }


  return (
    <main className="min-h-screen bg-[#07090d] text-white">

      <header className="flex h-16 items-center border-b border-white/[0.06] px-5">

        <Link
          to="/home"
          className="mr-4 rounded-lg p-2 text-zinc-600 hover:bg-white/[0.04] hover:text-white"
        >
          <ArrowLeft size={17} />
        </Link>

        <div>

          <h1 className="text-sm font-semibold">
            People
          </h1>

          <p className="text-[10px] text-zinc-700">
            Find Arxzen users
          </p>

        </div>

      </header>


      <section className="mx-auto max-w-2xl p-5">

        <div className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0b0d12] px-4">

          <Search
            size={16}
            className="text-zinc-700"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Search username..."
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-800"
          />

        </div>


        <div className="mt-5">

          {query &&
          results.length === 0 ? (
            <Empty />
          ) : (
            results.map(
              (account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between border-b border-white/[0.05] py-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15171d] text-xs font-semibold text-zinc-500">
                      {account.displayName
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <p className="text-sm font-medium">
                        {account.displayName}
                      </p>

                      <p className="text-xs text-zinc-700">
                        @{account.username}
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      openConversation(
                        account
                      )
                    }
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-400"
                  >
                    <UserPlus size={14} />
                    Message
                  </button>

                </div>
              )
            )
          )}

        </div>

      </section>

    </main>
  );
}


function Empty() {
  return (
    <div className="py-16 text-center">

      <Search
        size={22}
        className="mx-auto text-zinc-800"
      />

      <p className="mt-4 text-xs text-zinc-600">
        No users found
      </p>

    </div>
  );
}

export default People;