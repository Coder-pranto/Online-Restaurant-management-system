



import { Link, useLocation } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { CartContext } from "../../context/cart";
import SideModal from "../../ui/Modals/SideModal";
import Cart from "../Cart/Cart";
import GoogleTranslateButton from "../../../GoogleTranslate";
import logoImage from "../../assets/c_logo.jpg"; // Add the logo image import

export default function Header() {
  const { getCartSubTotal, removeMultipleFromCart } = useContext(CartContext);
  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState([]);

  const location = useLocation();
  const { restaurantId, tableNumber } = getCookie("resIdAndTableNo");

  const handleMultipleDelete = () => {
    if (selectedFood) {
      if (window.confirm("Are you sure you want to delete selected items?")) {
        removeMultipleFromCart(selectedFood);
      }
    }
  };

  return (
    <section className="bg-primary text-white flex items-center justify-between px-5 py-2">
      <Link to={`/?restaurantid=${restaurantId}&table=${tableNumber}`}>
        <div className="flex flex-col items-center">
          {/* Brand Logo */}
          <img src={logoImage} alt="Brand Logo" className="w-20 h-10 rounded-lg shadow-lg" />

          {/* Digital Menu text */}
          <span className="text-[10px] w-20 font-semibold text-gray-500 mt-1 bg-black px-1 rounded-lg">
            <span className="text-primary text-[12px]">Digital</span><span className="text-blue-400 text-[12px]">Menu</span>
          </span>
        </div>
      </Link>

      <GoogleTranslateButton />

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
