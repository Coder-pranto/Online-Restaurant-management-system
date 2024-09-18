/* eslint-disable react/prop-types */

export default function InputField({
  label,
  name,
  defaultValue,
  register,
  type = "text",
  error,
  placeholder,
  options,
}) {
  return (
    <div className="w-full mb-2">
      <label className="block font-bold my-2">
        {label} <span className="text-red-500">*</span>
      </label>

      {type === "select" ? (
        <select
          {...register(name)}
          className="border-[1px] border-[#aaa] p-2 lg:w-[390px] md:w-[350px] sm:w-[300px] rounded-lg bg-[#FFF7E9]"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          defaultValue={defaultValue}
          {...register(name)}
          type={type}
          className="w-full border-[1px] border-[#aaa] p-2 rounded-lg bg-[#FFF7E9]"
          placeholder={placeholder}
        />
      )}

      <p className="text-red-500 text-sm">{error?.message?.split("type")[0]}</p>
    </div>
  );
}
