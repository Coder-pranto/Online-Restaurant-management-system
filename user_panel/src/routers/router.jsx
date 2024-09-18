import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/root";
import Payment from "../pages/Payment";
import PaymentSuccess from "../pages/PaymentSuccess";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
    ],
  },
]);
