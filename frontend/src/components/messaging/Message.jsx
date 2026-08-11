function Message({ message }) {
  const isMine =
    message.sender === "me" ||
    message.senderId === "demo-user";

  return (
    <div
      className={[
        "group flex w-full gap-3",
        isMine
          ? "justify-end"
          : "justify-start"
      ].join(" ")}
    >
      {/* Other user's avatar */}
      {!isMine && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold">
          A
        </div>
      )}

      <div
        className={[
          "relative max-w-[75%] rounded-2xl px-4 py-3 sm:max-w-[65%]",
          isMine
            ? "rounded-br-md bg-blue-500 text-white"
            : "rounded-bl-md border border-white/[0.06] bg-[#101219] text-zinc-200"
        ].join(" ")}
      >
        <p className="break-words text-sm leading-6">
          {message.content}
        </p>

        <div
          className={[
            "mt-1.5 flex items-center gap-2 text-[10px]",
            isMine
              ? "text-blue-100/60"
              : "text-zinc-600"
          ].join(" ")}
        >
          {message.createdAt && (
            <span>
              {message.createdAt}
            </span>
          )}

          {message.edited && (
            <span>
              edited
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;