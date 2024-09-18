import useFetch from "../../hooks/useFetch";

export default function AddOnsCard({
  addOns,
  setAddOns,
  selectedItemValue,
  menuId,
}) {
  const { data, baseURL } = useFetch(`addons/${menuId}`);

  return (
    <>
      {data.map((addOn) => {
        const filteredAddOn = addOns?.find((item) => item?.id === addOn?._id);
        return (
          <div
            className={`relative w-full h-[120px] sm:h-[150px] mx-auto ${
              selectedItemValue > 0
                ? "opacity-100"
                : "opacity-40 cursor-not-allowed"
            }`}
            key={addOn._id}
            onClick={() => {
              if (selectedItemValue > 0)
                if (!filteredAddOn)
                  setAddOns((prev) => [
                    ...prev,
                    {
                      id: addOn._id,
                      price: addOn.price,
                      addOnsName: addOn?.name,
                    },
                  ]);
                else {
                  setAddOns((prev) => [
                    ...prev.filter((item) => item?.id !== addOn?._id),
                  ]);
                  alert("Addons removed");
                }
            }}
          >
            <h5 className="absolute w-full text-center text-white bg-slate-700 opacity-50 rounded-t-md text-xs md:text-md ">
              {addOn?.price} TK
            </h5>
            <img
              className="w-full h-full object-cover  rounded-md"
              src={baseURL + addOn?.addonsImage}
              alt={addOn?.name}
            />
            <h5 className="absolute bottom-0 w-full text-center text-white bg-slate-700 opacity-50 rounded-b-md text-xs md:text-md ">
              {addOn?.name}
            </h5>
            {filteredAddOn?.id === addOn._id && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-xs text-white px-3 py-2 rounded-lg">
                Added!
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}
