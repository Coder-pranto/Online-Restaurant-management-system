export default function Button({
  mxSize,
  text,
  variant,
  size,
  onClick,
  disabled,
}) {
  const sizes = {
    sm: "w-[20px] h-[20px] rounded-full flex items-center justify-center",
    md: "w-1/3 py-2 rounded-md",
    lg: "w-1/2 py-2 rounded-md",
    xl: "w-full py-2 px-3 rounded-md",
  };

  return (
    <button
      type="button"
      className={`${
        size === "sm"
          ? sizes.sm
          : size === "lg"
          ? sizes.lg
          : size === "xl"
          ? sizes.xl
          : sizes.md
      } ${
        mxSize === true ? "mx-0" : "mx-auto"
      } block border-2 border-[#FFA901] text-[#FFA901] font-semibold text-xs my-4 uppercase ${
        variant === "primary" ? "bg-primary text-white" : ""
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
