import CartItem from "../../components/Cart/CartItem";
import SubHeader from "../../components/Header/SubHeader";
import Button from "../../ui/Buttons/Button";
import OrderSummary from "../../components/Payment/OrderSummary";
import Div from "../../ui/Div/Div";
import { useContext, useState } from "react";
import { CartContext } from "../../context/cart";
import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import LocationComparison from "../../utils/CatchLocation/LocationComparison";
import { io } from "socket.io-client";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";

export default function Payment() {
  const {
    cartItems,
    getSingleFoodTotal,
    getAddOnsTotal,
    getCartSubTotal,
    clearCart,
    totalPreperationTime,
  } = useContext(CartContext);
  const { restaurantId, tableNumber } = getCookie("resIdAndTableNo");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const navigate = useNavigate();
  const socket = io("https://digitalmenu-ax0i.onrender.com");
  // const socket = io("http://localhost:5005");

  /* <- Getting Location of user -> */
  const getLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        setLocationError(error.message || "Error getting user location");
      }
    } else {
      setLocationError("Location is not supported by this browser");
    }
  };

  /* <- handlePaymentType -> */
  const handlePaymentType = (type) =>
    type === "card" ? setPaymentMethod("card") : setPaymentMethod("cash");

  /* <- handlingOrder -> */
  const handleOrderPayment = async () => {
    if (cartItems.length === 0) alert("Cart is empty!");
    else {
      try {
        setLoading(true);

        const userLocation = await getLocation();
        // console.log(userLocation);

        const order = {
          items: cartItems.map((cartItem) => {
            return {
              foodId: cartItem._id,
              addons: cartItem.addons.map((addon) => addon.id),
              quantity: cartItem.quantity,
              // size: { type: String, default: null },
              sizeName: cartItem.size.size,
              // pieces: cartItem.piece.pieces,
              pieceName: cartItem.piece.pieces,
              spicyLevel: cartItem.spicyLevel,
              itemPrice: cartItem.price,
            };
          }),

          paymentStatus: "Ordered",
          paymentMethod: paymentMethod,
          totalPrice: getCartSubTotal(),
          restaurantId: restaurantId,
          tableNumber: tableNumber,
          customerCoords: userLocation,
          totalNumberOfFood: cartItems.length,
          averagePreparationTime: totalPreperationTime(),
        };

        /* Connectin with socket and post order */
        if (locationError) toast.error(locationError);

        if (userLocation) {
          socket.emit("newOrder", order);
          socket.on("newOrder", (newOrder) => {
            navigate("/payment-success", { state: { newOrder: newOrder } });
            clearCart();
            setLoading(false);
            socket.disconnect();
          });
          socket.on("newOrderError", (error) => {
            toast.error(error.error);
            socket.disconnect();
          });
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <section>
      <Link
        to={`/?restaurantid=${restaurantId}&table=${tableNumber}`}
        className="flex gap-2 text-[10px] text-red-500 mb-2"
      >
        <FontAwesomeIcon icon={faReply} />
        <span>Back to home</span>
      </Link>
      <h2 className="text-2xl font-semibold">Payment</h2>
      <div className="border border-white dark:border-gray-400 mt-2" />

      <div className="flex flex-col gap-6">
        <Div title="Paid By">
          <div className="flex gap-8 -mt-4">
            <Button
              text="cash"
              size="lg"
              variant={paymentMethod === "cash" && "primary"}
              onClick={() => handlePaymentType("cash")}
            />
            <Button
              text="card"
              size="lg"
              variant={paymentMethod === "card" && "primary"}
              onClick={() => handlePaymentType("card")}
            />
          </div>
        </Div>

        {/* order items */}

        <Div title="Order Items">
          {cartItems.map((cart) => (
            <CartItem
              key={cart?._id}
              type="payment"
              image={cart?.food_image}
              foodName={cart?.name}
              ingredients={cart?.ingredients?.map((item) => item)}
              price={getSingleFoodTotal(cart)}
            />
          ))}
        </Div>
        <Div title="Order Summary">
          <OrderSummary
            subTotal={getCartSubTotal()}
            VAT={50}
            serviceCharge={60}
            discount={((10 / 100) * getCartSubTotal()).toFixed(2)}
          />
        </Div>

        {!loading ? (
          <Button
            text="Confirm"
            size="xl"
            variant="primary"
            onClick={handleOrderPayment}
          />
        ) : (
          <Button text="Confirming..." size="xl" variant="primary" />
        )}
      </div>
    </section>
  );
}
