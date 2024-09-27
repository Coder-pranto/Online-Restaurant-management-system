import { useForm } from "react-hook-form";
import InputField from "../../components/Form/InputField";
import axios from 'axios';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";


export default function Login() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');

  const handleDemoLogin = () => {
    const demoEmail = 'desh@gmail.com';
    const demoPassword = '121010';

    // Set the demo email and password in the input fields
    setValue('adminEmail', demoEmail);
    setValue('adminPassword', demoPassword);
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = { email: data.adminEmail, password: data.adminPassword };

      const response = await axios.post('http://localhost:5005/api/v1/restaurant-admin/login', userCredential);

      console.log(response.data.data);

      // Assuming the API returns a token upon successful authentication
      const { token, restaurantId, restaurantName, restaurantLogo } = response.data.data;


      console.log('Authentication successful. Token:', token, " id:", restaurantId, "restaurant name : ", restaurantName, "Logo :", restaurantLogo);

      Cookies.set('token', token, { sameSite: 'None', secure: true });
      Cookies.set("restaurantName", restaurantName, { sameSite: 'None', secure: true });
      Cookies.set("restaurantId", restaurantId, { sameSite: 'None', secure: true });
      Cookies.set("restaurantLogo", restaurantLogo, { sameSite: 'None', secure: true });

      navigate('/dashboard', { replace: true })

      setErrorMessage('');
    } catch (error) {
      console.error('Authentication failed:', error.response.data);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  const showDemoLogin = window.location.hostname === 'digitalmenu-admin-demo.deshit-bd.com';
  console.log("Hostname : ", window.location.hostname);

  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center ">
      <div className="bg-white px-8 py-12 rounded-lg shadow-md max-w-md w-full m-3 border-2 border-[#FFA901]">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <InputField
              label="Admin Email"
              name="adminEmail"
              register={register}
              error={errors}
            />
          </div>

          <div className="mb-4">
            <InputField
              label="Admin Password"
              name="adminPassword"
              register={register}
              error={errors}
              type="password"
            />
          </div>

          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-[#FFA901] rounded-xl py-2 text-white font-bold"
            >
              Login
            </button>
          </div>

          {showDemoLogin && <div className="flex flex-col justify-center mt-2">
            <h3 className="p-3 text-lg font-bold text-blue-500 text-center">For quick demo login click below</h3>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-blue-500 rounded-xl py-2 text-white font-bold"
            >
              Admin
            </button>
          </div>}

        </form>
      </div>
    </div>
  );
}
