import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ManageAdmin from "../pages/ManageAdmin";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import InitialLayout from "../ApplicationLayout/InitialLayout";
import PrivateRoute from "./privateRoute";

const applicationRouter = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute><InitialLayout/></PrivateRoute>,
        children: [
            {
                path: '/',
                element: <ManageAdmin/>
            },
            {
                path: '/home',
                element: <Home/>
            },
            {
                path: '/manage-admin',
                element: <ManageAdmin/>
            },
        ]
    },
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '*',
        element: <NotFound/>
    }
])

export default applicationRouter;