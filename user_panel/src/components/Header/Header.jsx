import { Link, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { CartContext } from "../../context/cart";
import SideModal from "../../ui/Modals/SideModal";
import Cart from "../Cart/Cart";

export default function Header() {
  const { getCartSubTotal, removeMultipleFromCart } = useContext(CartContext);
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState([]);

  /* <- Getting location for show cart on header only for root route -> */
  const location = useLocation();

  /* <- Getting cookie of restaurentId for redirecting to home page -> */
  const { restaurantId, tableNumber } = getCookie("resIdAndTableNo");

  /* <- Delete multiple items from cart -> */
  const handleMultipleDelete = () => {
    if (selectedFood) {
      if (window.confirm("Are you sure you want to delete selected items?")) {
        removeMultipleFromCart(selectedFood);
      }
    }
  };

  return (
    <section className="bg-primary text-white flex item-center justify-between px-5 py-2">
      <Link to={`/?restaurantid=${restaurantId}&table=${tableNumber}`}>
        {/* <h1 className="uppercase text-2xl font-semibold font-poppins">
          Digital Menu
        </h1> */}
        <span className="text-xl font-bold text-gray-800 bg-black p-1 rounded-lg font">
          <span className="text-primary">Digital</span><span className="text-blue-400">Menu</span>
        </span>
      </Link>
      {location.pathname === "/" && (
        <div
          className="bg-white dark:bg-gray-800 text-primary flex items-center gap-2 px-2 rounded-full"
          onClick={() => setSideModalOpen(true)}
        >
          <FontAwesomeIcon icon={faBagShopping} size="sm" />
          <span className="text-xs">{getCartSubTotal().toFixed(2)} TK</span>
        </div>
      )}
      <SideModal
        title="Cart"
        isOpen={sideModalOpen}
        onClose={() => setSideModalOpen(false)}
        onDelete={handleMultipleDelete}
      >
        <Cart
          setSideModalOpen={setSideModalOpen}
          setSelectedFood={setSelectedFood}
        />
      </SideModal>
    </section>
  );
}
