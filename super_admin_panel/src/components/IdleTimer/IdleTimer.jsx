
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Cookies from "universal-cookie";

const IdleTimer = ({ timeout = 240000 , warningTimeout = 10000 }) => {
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const cookies = new Cookies();
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  useEffect(() => {
    startIdleTimer();

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    return () => {
      clearTimeout(idleTimerRef.current);
      clearTimeout(warningTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  }, []);

  const startIdleTimer = () => {
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      warningTimerRef.current = setTimeout(() => {
        handleLogout();
      }, warningTimeout);
    }, timeout);
  };

  const resetIdleTimer = () => {
    setIsIdle(false);
    clearTimeout(idleTimerRef.current);
    clearTimeout(warningTimerRef.current);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    startIdleTimer();
  };

  const handleLogout = () => {
    cookies.remove('email', { path: '/' });
    cookies.remove('adminToken');
    navigate('/login');
    enqueueSnackbar('You have been logged out due to inactivity.', { variant: 'info' });
    navigate('/login');
  };

  const handleStayLoggedIn = () => {
    setIsIdle(false);
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer();
  };

  return (
    <>
      {isIdle && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-gray-900 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md px-8 py-5 overflow-hidden md:w-1/3">
            <p className="text-base font-medium leading-6 text-gray-700 mb-4">
              You have been idle for a while. Do you want to stay logged in?
            </p>
            <div className="flex justify-between items-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleStayLoggedIn}
              >
                Stay Logged In
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdleTimer;


