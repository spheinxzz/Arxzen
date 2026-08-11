function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = ""
}) {
  const variants = {
    primary:
      "bg-white text-black hover:bg-zinc-200",
    secondary:
      "border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800",
    ghost:
      "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
    danger:
      "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-lg px-4 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        "disabled:opacity-50",
        variants[variant] || variants.primary,
        className
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default Button;