import { useContext } from "react";
import Button from "../../ui/Buttons/Button";
import { CartContext } from "../../context/cart";

export default function CartItem({
  food,
  type,
  image,
  foodName,
  ingredients,
  price,
  selectedItemValue,
  setSelectedFood,
}) {
  const { addToCartQuantity, removeFromCartQuantity } = useContext(CartContext);

  return (
    <>
      {type === "cart" && (
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="flex gap-5 text-gray-800 dark:text-white">
              <img
                src={image}
                alt="cart"
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex flex-col justify-evenly">
                <h2 className="text-xs font-bold">{foodName}</h2>
                {food?.size.size && (
                  <p className="text-[10px]">Size : {food?.size.size}</p>
                )}
                {food?.piece.pieces && (
                  <p className="text-[10px]">Pieces : {food?.piece.pieces}</p>
                )}
                {food?.addons.length > 0 && (
                  <div className="flex flex-1">
                    <p className="text-[10px] font-bold">AddOns : &nbsp; </p>
                    <div className="flex flex-col">
                      {food.addons &&
                        food.addons.length > 0 &&
                        food?.addons?.map((addOn, index) => {
                          return (
                            <p key={addOn.id} className="text-[10px]">
                              {index + 1}. {addOn.addOnsName}
                            </p>
                          );
                        })}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Button
                    mxSize={true}
                    text="-"
                    variant="primary"
                    size="sm"
                    onClick={() => removeFromCartQuantity(food)}
                    disabled={selectedItemValue === 1}
                  />
                  <span className="text-xs text-center w-4 font-semibold">
                    {selectedItemValue}
                  </span>
                  <Button
                    mxSize={true}
                    text="+"
                    variant="primary"
                    size="sm"
                    onClick={() => addToCartQuantity(food)}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-around">
              <input
                type="checkbox"
                className="h-4 accent-[#FFA901] cursor-pointer ml-auto"
                onChange={() => setSelectedFood((prev) => [...prev, food?._id])}
              />
              <span className="text-right text-gray-800 dark:text-white text-xs font-semibold">
                {price} TK
              </span>
            </div>
          </div>
          <div className="border border-gray-800 dark:border-white my-4" />
        </div>
      )}

      {type === "payment" && (
        <div className="flex flex-col">
          <div className="flex gap-5">
            <div className="w-1/4">
              <img
                src={image}
                alt="cart"
                className="w-full h-[60px] object-cover rounded-md"
              />
            </div>
            <div className="w-3/4 flex flex-col justify-evenly">
              <h2 className="text-xs font-semibold">{foodName}</h2>
              {/* <span>{ingredients}</span> */}
              <span className="text-xs font-semibold flex-end">{price} TK</span>
            </div>
          </div>
          <div className="border border-gray-400 my-3" />
        </div>
      )}
    </>
  );
}
