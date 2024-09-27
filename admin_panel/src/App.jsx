import { RouterProvider } from "react-router-dom";
import routers from "./router/router";
import { Toaster } from "react-hot-toast";
import { OrderProvider } from "./context/OrderHistoryContext";

function App() {
  return (
    <div>
      <OrderProvider>
        <RouterProvider router={routers} />
        <Toaster />
      </OrderProvider>

    </div>
  );
}

export default App;
