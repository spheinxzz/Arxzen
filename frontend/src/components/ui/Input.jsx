function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-zinc-300"
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="
          w-full rounded-lg border border-zinc-700
          bg-zinc-900 px-4 py-3 text-white
          placeholder:text-zinc-600
          outline-none transition
          focus:border-zinc-400
          disabled:cursor-not-allowed disabled:opacity-50
        "
      />
    </div>
  );
}

export default Input;