import React from "react";

export default function RadioButton({
  checked,
  defaultValue,
  id,
  label,
  name,
  onChange,
}) {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="radio"
        checked={checked}
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
        className="w-4 h-4 accent-orange-400 ring-white cursor-pointer"
      />
      <label
        htmlFor={id}
        className="ml-2 text-[10px] font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
    </div>
  );
}
