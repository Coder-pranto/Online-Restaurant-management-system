/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../../components/Sidebar";
import { OrderContext } from "../../context/OrderHistoryContext"
import { useContext, useEffect, useState } from "react";
// for client part
import socketIOClient from "socket.io-client";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function InitialLayout() {
  const [currentRestaurent] = useState(Cookies.get("restaurantId"));
  const { triggerRefresh } = useContext(OrderContext);
  const navigate = useNavigate();

  // Preload notification sound
  const notificationSound = new Audio("/ball.mp3");
  notificationSound.load();

  useEffect(() => {
    const socket = socketIOClient("http://localhost:5005", {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socket.on("newOrder", (data) => {
      if (data.restaurantId === currentRestaurent) {
        playNotificationSound(notificationSound);
        triggerRefresh();

        toast.custom(
          (t) => (
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mt-8">
              <div className="flex items-center mb-4">
                <div className="font-bold text-xl">New order received! 📋</div>
              </div>

              <div className="flex justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  onClick={() => {
                    navigate("/order-history");
                    toast.dismiss(t.id);
                  }}
                >
                  Ok
                </button>
                <button
                  className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => { toast.dismiss(t.id) }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          {
            duration: 1000 * 60,
            icon: "📋",
          }
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [currentRestaurent]);


  const playNotificationSound = () => {
    notificationSound.play()
      .then(() => {
        console.log('audio is playing!')
      })
      .catch(error => {
        console.error("Error playing the sound:", error);
      });
  };

  return (
    <div className="flex">
      <div className="lg:w-[22%]">
        <SideBar />
      </div>
      <div className="lg:w-[78%] w-[100vw] overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}