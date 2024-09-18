import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

const cookies = new Cookies();

const PrivateRoute = ({ children }) => {
    const user = cookies.get('email');
    // console.log('from private route', user);
    return user ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
