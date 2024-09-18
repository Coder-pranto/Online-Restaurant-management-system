import { useContext, useEffect, useState } from "react";
import AddOnsCard from "../../ui/Cards/AddOnsCard";
import Button from "../../ui/Buttons/Button";
import RadioButton from "../../ui/RadioButton/RadioButton";
import Div from "../../ui/Div/Div";
import { CartContext } from "../../context/cart";
import { toast } from "react-toastify";

export default function FoodCard({ data, baseURL, onClose }) {
  const { cartItems, addToCart, discountedPrice } = useContext(CartContext);
  const [addOns, setAddOns] = useState([]);
  const [selectedItemValue, setSelectedItemValue] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedSpicy, setSelectedSpicy] = useState({});

  // console.log({ selectedPiece, selectedSize, selectedSpicy });
  // console.log(addOns);
  // console.log({ data });

  const filteredCartItem = cartItems.find((item) => item._id === data?._id);
  const quantity = filteredCartItem?.quantity ? filteredCartItem?.quantity : 0;
  const getPiece = filteredCartItem?.piece ? filteredCartItem?.piece : "";
  const getSize = filteredCartItem?.size ? filteredCartItem?.size : "";
  const getSpicy = filteredCartItem?.spicyLevel
    ? filteredCartItem?.spicyLevel
    : "";
  const getAddOns = filteredCartItem?.addons || [];

  const handleSelectedButton = (e, selectData) => {
    const name = e.target.name;

    // console.log(name, selectData);
    if (name === "pieceName") {
      return setSelectedPiece(selectData);
    } else if (name === "sizeName") {
      return setSelectedSize(selectData);
    } else if (name === "spicyName") {
      return setSelectedSpicy(selectData);
    }
  };

  useEffect(() => {
    setSelectedItemValue(quantity);
    setSelectedPiece(getPiece);
    setSelectedSize(getSize);
    setSelectedSize(getSize);
    setSelectedSpicy(getSpicy);
    setAddOns([...getAddOns]);
  }, []);
  // console.log(selectedItemValue);

  const foodCart = {
    _id: data?._id,
    food_image: baseURL + data?.food_image,
    name: data?.name,
    ingredients: data?.ingredients,
    price: data?.price,
    isOffer: data?.isOffer,
    discountType: data?.discount_type,
    discountValue: data?.discount_value,
    addons: addOns,
    piece: selectedPiece,
    size: selectedSize,
    spicyLevel: selectedSpicy,
    quantity: selectedItemValue,
    preparationTime: data?.preparationTime,
  };

  const handleQuantity = (operation, item) => {
    // console.log({ operation, item });
    if (operation === "increment") {
      setSelectedItemValue(selectedItemValue + 1);
    } else {
      setSelectedItemValue(selectedItemValue - 1);
    }
  };

  // console.log({ foodCart, cartItems, data });

  return (
    <div className="flex flex-col gap-5">
      <img
        className="w-full h-[150px] object-cover rounded-xl"
        src={baseURL + data?.food_image}
        alt="food"
      />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{data?.name}</span>
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              data?.isOffer && "line-through text-gray-500"
            }`}
          >
            {data?.price} TK{" "}
          </p>
          {data?.isOffer && (
            <p className="text-sm font-semibold ">
              {discountedPrice(
                data?.price,
                data?.discount_type,
                data?.discount_value
              )}{" "}
              TK
            </p>
          )}
        </div>
      </div>

      <Div title="Description">
        <p className="text-xs mb-9">{data?.description}</p>
      </Div>

      <div className="flex justify-between">
        <Div title="Ingredients">
          <ul className="list-disc ml-4 text-[10px]">
            {data?.ingredients?.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </Div>

        <Div title="Quantity">
          <div className="flex items-center gap-3">
            <Button
              text="-"
              variant="primary"
              size="sm"
              onClick={() => handleQuantity("decrement", foodCart)}
              disabled={selectedItemValue === 0}
            />
            <span className="text-sm text-center w-4 font-semibold">
              {selectedItemValue}
            </span>
            <Button
              text="+"
              variant="primary"
              size="sm"
              onClick={() => handleQuantity("increment", foodCart)}
            />
          </div>
        </Div>
      </div>
      {/* pieces */}
      {data?.pieces.length > 0 && (
        <Div title="Pieces">
          <div className="mt-5 grid grid-cols-4 gap-2">
            {data?.pieces?.map((piece, index) => (
              <RadioButton
                key={index}
                label={piece.pieces + "p - " + piece.price + "tk"}
                checked={piece._id === selectedPiece?._id}
                defaultValue={piece._id}
                id="pieces"
                onChange={(e) => handleSelectedButton(e, piece)}
                name="pieceName"
              />
            ))}
          </div>
        </Div>
      )}

      {/* sizes */}
      {data?.sizes?.length > 0 && (
        <Div title="Sizes">
          <div className="mt-5 grid grid-cols-2 gap-2">
            {data?.sizes?.map((size, index) => (
              <RadioButton
                key={index}
                label={size.size + " - " + size.price + " " + "tk"}
                id="sizes"
                checked={size?._id === selectedSize?._id}
                defaultValue={size._id}
                onChange={(e) => handleSelectedButton(e, size)}
                name="sizeName"
              />
            ))}
          </div>
        </Div>
      )}
      {data?.spicyLevels?.length > 0 && (
        <Div title="Spicy Level">
          <div className="mt-5 grid grid-cols-4">
            {data?.spicyLevels?.map((spicyLevel, index) => (
              <RadioButton
                key={index}
                label={spicyLevel}
                id="spicy"
                checked={selectedSpicy === spicyLevel}
                defaultValue={spicyLevel}
                onChange={(e) => handleSelectedButton(e, spicyLevel)}
                name="spicyName"
              />
            ))}
          </div>
        </Div>
      )}

      <Div title="Add Ons">
        <div className="grid grid-cols-3 gap-4">
          <AddOnsCard
            menuId={data?.categoryId?._id}
            addOns={addOns}
            setAddOns={setAddOns}
            selectedItemValue={selectedItemValue}
          />
        </div>
      </Div>

      <Button
        text="Add To Cart"
        size="xl"
        disabled={selectedItemValue === 0}
        onClick={() => {
          addToCart(foodCart);
          toast.success("Added to cart successfully!");
          onClose();
        }}
      />
    </div>
  );
}
