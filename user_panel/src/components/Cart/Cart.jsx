import { useContext } from "react";
import CartItem from "./CartItem";
import Button from "../../ui/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/cart";

export default function Cart({ setSideModalOpen, setSelectedFood }) {
  const { cartItems, getSingleFoodTotal, getAddOnsTotal } =
    useContext(CartContext);

  const navigate = useNavigate();

  return (
    <section>
      {cartItems.length > 0 ? (
        <div className="h-[calc(100vh-200px)] flex flex-col justify-between">
          <div>
            {cartItems.map((cart) => (
              <CartItem
                key={cart?._id}
                food={cart}
                type="cart"
                image={cart?.food_image}
                foodName={cart?.name}
                ingredients={cart?.ingredients?.map((item) => item)}
                price={getSingleFoodTotal(cart)}
                selectedItemValue={cart?.quantity}
                setSelectedFood={setSelectedFood}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              text="Order"
              variant="primary"
              size="lg"
              onClick={() => {
                navigate("/payment");
                setSideModalOpen(false);
              }}
            />
            <Button
              text="Add More"
              size="lg"
              onClick={() => setSideModalOpen(false)}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h5 className="text-center text-sm text-gray-800 dark:text-white">
            Cart is empty! Please add some food to your cart.
          </h5>
        </div>
      )}
    </section>
  );
}
