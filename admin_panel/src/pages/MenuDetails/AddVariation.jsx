/* eslint-disable react/prop-types */
import InputField from "../../components/Form/InputField";
import { useFieldArray } from "react-hook-form";
import deleteIcon from "../../assets/menu/menu-details/delete.png";

export default function AddVariation({
  register,
  control,
  label,
  name,
  items,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}`,
  });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => {
        return (
          <div
            key={field.id}
            className="mt-2 flex-col justify-center border-2 border-gray-400 rounded-md mx-4 p-2"
          >
            <img
              src={deleteIcon}
              className="cursor-pointer ml-auto"
              onClick={() => remove(index)}
            />
            <div className="mt-2 flex justify-center ">
              <InputField
                type="text"
                label={`${label[0]}`}
                name={`${name}.${index}.${Object.keys(items)[0]}`}
                register={register}
                className="h-10 border"
              />
            </div>
            <div className="mt-2 flex justify-center">
              <InputField
                type="text"
                label={`${label[1]}`}
                name={`${name}.${index}.${Object.keys(items)[1]}`}
                register={register}
              />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => append(items)}
        className="w-28 mx-auto border-2 bg-orange-400 py-1.5 text-white rounded-lg "
      >
        Add {`${name}`}
      </button>
    </div>
  );
}
