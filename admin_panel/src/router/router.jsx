import { Navigate, createBrowserRouter } from "react-router-dom";
import InitialLayout from "../layout/InitialLayout";
import Dashboard from "../pages/Dashboard";
import OrderHistory from "../pages/OrderHistory";
import TableDashboard from "../pages/TableOrder/TableDashboard";
import Menu from "../pages/Menu";
import Offer from "../pages/Offer";
import Employee from "../pages/Employee";
import Expenses from "../pages/Expenses";
import QrCode from "../pages/QrCode";
import MenuDetails from "../pages/MenuDetails";
import OfferDetails from "../pages/OfferDetails";
import Stock from "../pages/Stock";
import Login from "../pages/Login";
import MenuSelection from "../pages/TableOrder/MenuSelection";



const routers = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace={true} />
  },
  {
    path: "/",
    element: <InitialLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/order-history",
        element: <OrderHistory />,
      },
      {
        path: "/table-order",
        element: <TableDashboard/>,
      },
      {
        path: "/table-menu",
        element: <MenuSelection/>,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/menu-details/:id",
        element: <MenuDetails />,
      },
      {
        path: "/offer",
        element: <Offer />,
      },
      {
        path: "/offer-details/:id",
        element: <OfferDetails />,
      },
      {
        path: "/employee",
        element: <Employee />,
      },
      {
        path: "/expenses",
        element: <Expenses />,
      },
      {
        path: "/stock",
        element: <Stock />,
      },
      {
        path: "/qr-code",
        element: <QrCode />,
      },

    ],
  },
  
  {
    path: "/login",
    element: <Login />,
  },
  
]);

export default routers;
