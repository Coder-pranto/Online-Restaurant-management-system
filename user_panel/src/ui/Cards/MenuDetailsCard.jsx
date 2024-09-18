import { faBagShopping, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ViewContext } from "../../context/view";
import { CartContext } from "../../context/cart";

export default function MenuDetailsCard({
  menuName,
  menuImage,
  menuDetails,
  menuPrice,
  setOpenModal,
  onClick,
  menuOfferAvailable,
  menuDiscountType,
  menuDiscountValue,
  menuIsPopular
}) {
  const { view } = useContext(ViewContext);
  const { discountedPrice } = useContext(CartContext);

  return (
    <div
      className={`flex ${view === "list" ? "flex-row h-[120px]" : "flex-col h-[180px]"
        }  shadow-lg rounded-xl`}
    >
      <img
        className={`${view === "list" ? "w-1/3 min-h-full" : "w-full h-1/3"
          } object-cover rounded-l-xl`}
        src={menuImage}
        alt={menuName}
      />

      <div
        className={`relative ${view === "list" ? "w-2/3" : "w-full h-full"
          } flex flex-col gap-1 px-3 py-2`}
      >
        <h5
          className={`text-[12px] font-bold ${view === "list" ? "" : "line-clamp-1"
            }`}
        >
          {menuName}
        </h5>
        <p className="line-clamp-2 text-[10px] text-gray-500">{menuDetails}</p>
         <div className="">
         {menuIsPopular && (
            <span className="">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-xs" />
              <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500 text-xs" />
              <span className="font-semibold text-xs"> (Popular)</span>
            </span>
          )}
         </div>
        <div
          className="absolute bottom-2
       w-4/5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold ${menuOfferAvailable && "line-through text-gray-500"
                }`}
            >
              {menuPrice} TK
            </span>
            {menuOfferAvailable && (
              <span className="text-[10px] font-bold">
                {discountedPrice(
                  menuPrice,
                  menuDiscountType,
                  menuDiscountValue
                )}{" "}
                TK
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-2 rounded-full p-1 shadow-md"
            onClick={() => {
              setOpenModal();
              onClick();
            }}
          >
            <FontAwesomeIcon
              icon={faBagShopping}
              size="xs"
              className="text-primary"
            />
            <span className="text-[10px] font-semibold">Add</span>
          </div>
        </div>
      </div>
    </div>
  );
}
