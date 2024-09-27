import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/BaseUrl";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Cookies from "universal-cookie";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const cookies = new Cookies();

  const handleLogin = async () => {
    try {
      const credential = { email, password };
      const data = await axios.post(`${baseUrl}/super-admin/login`, credential);
      if (data.data.status === 'success') {
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + 1 * 60 * 60 * 1000); 
  
        cookies.set('email', data.data.data.email, { path: '/', expires: expirationTime });
        cookies.set('adminToken', data.data.data.token, { path: '/', expires: expirationTime });
        navigate('/manage-admin');
        enqueueSnackbar('Login Successful', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Login Failed', { variant: 'error' });
      console.log(error.message);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-md rounded-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Super Admin Login</h2>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 p-2 w-full border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 p-2 w-full border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="button"
              className="w-full p-3 bg-orange-600 text-white rounded-md"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;



