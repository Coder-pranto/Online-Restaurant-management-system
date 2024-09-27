import { createContext, useState } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [refreshOrders, setRefreshOrders] = useState(false);

  const triggerRefresh = () => setRefreshOrders(!refreshOrders);

  return (
    <OrderContext.Provider value={{ refreshOrders, triggerRefresh }}>
      {children}
    </OrderContext.Provider>
  );
};




