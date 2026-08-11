import { useState } from "react";

function MessageInput({ onSend }) {
  const [content, setContent] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const value = content.trim();

    if (!value) {
      return;
    }

    onSend(value);
    setContent("");
  }

  return (
    <div className="border-t border-white/[0.06] bg-[#090a0f] p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-white/[0.07] bg-[#0e1016] p-2"
      >
        <button
          type="button"
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-zinc-600 transition hover:bg-white/[0.05] hover:text-zinc-300"
        >
          +
        </button>

        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              event.currentTarget.form.requestSubmit();
            }
          }}
          rows={1}
          placeholder="Message..."
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700"
        />

        <button
          type="submit"
          disabled={!content.trim()}
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-400 disabled:bg-white/[0.04] disabled:text-zinc-700"
        >
          ↑
        </button>
      </form>

      <p className="mx-auto mt-2 max-w-4xl px-2 text-[10px] text-zinc-700">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
}

export default MessageInput;