import { createContext, useState } from "react";

export const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [view, setView] = useState("list");

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};
