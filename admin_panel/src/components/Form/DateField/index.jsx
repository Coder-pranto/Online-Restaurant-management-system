/* eslint-disable react/prop-types */

export default function DateField({
  label,
  name,
  register,
  error,
  defaultValue,
}) {
  return (
    <div className="mb-3">
      <label className="block font-bold mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        defaultValue={defaultValue}
        {...register(name)}
        type="date"
        className="border-[1px] border-[#aaa] p-2 w-full rounded-lg bg-[#FFF7E9]"
      />
      <p className="text-red-500 text-sm">{error?.message?.split("type")[0]}</p>
    </div>
  );
}
