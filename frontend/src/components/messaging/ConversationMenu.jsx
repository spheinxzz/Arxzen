import { useEffect, useRef, useState } from "react";

function ConversationMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={[
          "flex h-9 w-9 items-center justify-center rounded-xl transition",
          open
            ? "bg-white/[0.08] text-white"
            : "text-zinc-600 hover:bg-white/[0.05] hover:text-zinc-300"
        ].join(" ")}
        title="Conversation options"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#11131a] p-1 shadow-2xl shadow-black/50">
          <MenuButton>
            <span>○</span>
            View profile
          </MenuButton>

          <MenuButton>
            <span>🔕</span>
            Mute notifications
          </MenuButton>

          <MenuButton>
            <span>⌕</span>
            Search conversation
          </MenuButton>

          <div className="my-1 border-t border-white/[0.06]" />

          <MenuButton danger>
            <span>⊘</span>
            Block user
          </MenuButton>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  children,
  danger = false
}) {
  return (
    <button
      type="button"
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
        danger
          ? "text-red-400 hover:bg-red-500/10"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default ConversationMenu;