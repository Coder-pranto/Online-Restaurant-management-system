import Cookies from "js-cookie";
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    Cookies.get("cartItems") ? JSON.parse(Cookies.get("cartItems")) : []
  );

  // console.log({ cartItems });

  const filteredCartItem = (foodItem) =>
    cartItems.find((item) => item._id === foodItem?._id);

  const addToCart = (item) => {
    // console.log({item})
    const isItemInCart = filteredCartItem(item);
    // console.log(isItemInCart);
    // const foodPrice = filteredCartItem

    if (isItemInCart) {
      console.log({ isItemInCart });
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                ...item,
              }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item }]);
    }
  };

  const addToCartQuantity = (item) => {
    // console.log({item})
    const isItemInCart = filteredCartItem(item);

    if (isItemInCart) {
      console.log({ isItemInCart });
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: item?.quantity + 1,
              }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCartQuantity = (item) => {
    const isItemInCart = filteredCartItem(item);

    if (isItemInCart.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem._id !== item._id));
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                addons: item?.addons,
                quantity: cartItem.quantity - 1,
              }
            : cartItem
        )
      );
    }
  };

  const removeMultipleFromCart = (ids) =>
    setCartItems(cartItems.filter((cartItem) => !ids.includes(cartItem._id)));

  const clearCart = () => setCartItems([]);

  const getAddOnsTotal = (addOns) =>
    addOns.reduce((totalPrice, itemPrice) => totalPrice + itemPrice.price, 0);

  const discountedPrice = (price, discountType, discountValue) => {
    if (discountType === "percentage") {
      return price - (discountValue / 100) * price;
    } else return price - discountValue;
  };

  const getSingleFoodTotal = (item) => {
    const discount = discountedPrice(
      item.price,
      item.discountType,
      item.discountValue
    );
    const itemPrice = parseFloat(item.price || 0);
    const sizePrice = parseFloat(item?.size?.price || 0);
    const piecePrice = parseFloat(item?.piece?.price || 0);
    const addOnsBill = parseFloat(getAddOnsTotal(item?.addons));
    const productQuantity = parseFloat(item.quantity);

    if (sizePrice || piecePrice || addOnsBill) {
      if (sizePrice && piecePrice && addOnsBill) {
        const totalBill = sizePrice + piecePrice + addOnsBill;
        return totalBill * productQuantity;
      } else if (piecePrice && sizePrice) {
        const totalWithPieceAndSize = piecePrice + sizePrice;
        return totalWithPieceAndSize * productQuantity;
      } else if (piecePrice && addOnsBill) {
        const totalWithPieceAndAddOns = piecePrice + addOnsBill;
        return totalWithPieceAndAddOns * productQuantity;
      } else if (sizePrice && addOnsBill) {
        const totalWithSizeAndAddOns = sizePrice + addOnsBill;
        return totalWithSizeAndAddOns * productQuantity;
      } else if (addOnsBill) {
        const totalWithAddOns = item?.isOffer
          ? discount + addOnsBill
          : itemPrice + addOnsBill;
        return totalWithAddOns * productQuantity;
      } else if (piecePrice) {
        const totalWithPiece = item?.isOffer
          ? discount + piecePrice
          : itemPrice + piecePrice;
        return totalWithPiece * productQuantity;
      } else if (sizePrice) {
        const totalWithSize = item?.isOffer
          ? discount + sizePrice
          : itemPrice + sizePrice;
        return totalWithSize * productQuantity;
      }
    }

    if (item?.isOffer) return discount * productQuantity;

    return itemPrice * productQuantity;
  };

  // const getCartSubTotal = () =>
  //   cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartSubTotal = () =>
    cartItems.reduce((total, item) => total + getSingleFoodTotal(item), 0);

  const totalPreperationTime = () =>
    cartItems.reduce(
      (accumulator, current) =>
        accumulator + current.preparationTime / cartItems.length,
      0
    );

  // console.log("time:", totalPreperationTime(), "Total:", getCartSubTotal());

  useEffect(() => {
    Cookies.set("cartItems", JSON.stringify(cartItems), { expires: 5 / 1440 });
  }, [cartItems]);

  useEffect(() => {
    const cartItems = Cookies.get("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addToCartQuantity,
        removeFromCartQuantity,
        removeMultipleFromCart,
        discountedPrice,
        clearCart,
        getSingleFoodTotal,
        getCartSubTotal,
        getAddOnsTotal,
        totalPreperationTime,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
