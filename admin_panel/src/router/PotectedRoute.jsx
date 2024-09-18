/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = Cookies.get('token') !== undefined;
    return (
      <Route
        {...rest}
        element={isAuthenticated ? <Element /> : <Navigate to="/login" replace/>}
      />
    );
  };

  export default ProtectedRoute;