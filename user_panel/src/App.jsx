import { RouterProvider } from "react-router-dom";
import { router } from "./routers/router";
import { CartProvider } from "./context/cart";
import { ViewProvider } from "./context/view";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <CartProvider>
      <ViewProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </ViewProvider>
    </CartProvider>
  );
}
