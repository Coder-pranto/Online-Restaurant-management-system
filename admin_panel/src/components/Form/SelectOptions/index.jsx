/* eslint-disable react/prop-types */

export default function SelectOption({
  label,
  name,
  options,
  register,
  error,
  setSelectedDivision,
}) {
  return (
    <div className="mb-3">
      <label className="block text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        {...register(name)}
        className="border p-2 w-full"
        onChange={(e) => setSelectedDivision(e.target.value)}
      >
        <option value="" disabled>
          {label}
        </option>
        {options?.map((option, index) => (
          <option key={index} value={option._id}>
            {option.brandName ? option.brandName : option.name || option}
          </option>
        ))}
      </select>
      <p className="text-red-500 text-sm">{error?.message?.split("type")[0]}</p>
    </div>
  );
}
