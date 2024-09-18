/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import Table from "../../components/Table";
import visitorsImg from "../../assets/cardImage/visitors.png";
import orderImg from "../../assets/cardImage/order.png";
import incomeImg from "../../assets/cardImage/income.png";
import DashboardCard from "../../components/cards/DashboardCard";
// import burger from "../../assets/food/burger.png";
import filterIcon from "../../assets/filtericon/filter1.png";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function OrderHistory() {

  const restaurantId = Cookies.get('restaurantId');
  const authToken = Cookies.get('token');

  const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false);

  const [OrderHistories, setOrderHistories] = useState([]);
  const [foodOrderGroup, setFoodOrderGroup] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [approvedOrder, setApprovedOrder] = useState(0);
  const [caneledOrder, setCaneledOrder] = useState(0);
  const [pendingOrder, setPendingOrder] = useState(0);


  const fetchData = async () => {
    try {
      const response = await axios.get(`https://digitalmenu-ax0i.onrender.com/api/v1/order/${restaurantId}`, {
        headers: {
          "Authorization": `${authToken}`,
        }
      })
      const allData = response.data
      setOrderHistories(allData);
      setTotalOrder(allData.length);
      const arr1 = allData.filter((a) => a.status === 'pending');
      setPendingOrder(arr1.length);
      const arr2 = allData.filter((a) => a.status === 'approved');
      setApprovedOrder(arr2.length);
      const arr3 = allData.filter((a) => a.status === 'rejected');
      setCaneledOrder(arr3.length);
      // console.log(response.data)
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`https://digitalmenu-ax0i.onrender.com/api/v1/order/${restaurantId}`, {
        headers: {
          "Authorization": `${authToken}`,
        }
      })
      const allData = response.data

      const foodItems = allData.reduce((acc, order) => {
        order.items.forEach((item) => {
          const { _id, name, food_image } = item.foodId;
          if (!acc[name]) {
            acc[name] = { id: _id, quantity: 0, image: food_image };
          }
          acc[name].quantity += item.quantity;
        });
        return acc;
      }, {});

      const foodItemsArray = Object.entries(foodItems).map(([itemName, itemData]) => ({
        id: itemData.id,
        name: itemName,
        quantity: itemData.quantity,
        image: itemData.image
      }));

      setFoodOrderGroup(foodItemsArray);
      console.log("A", foodItemsArray)

      console.log("B", foodOrderGroup);
    } catch (error) {
      console.error('Error fetching order group data:', error);
    }
  }


  const cardInfo = [
    {
      name: "Total Orders",
      amount: totalOrder,
      icon: visitorsImg,
    },
    {
      name: "Completed Orders",
      amount: approvedOrder,
      icon: orderImg,
    },
    {
      name: "Canceled Order",
      amount: caneledOrder,
      icon: incomeImg,
    },
    {
      name: "Pending Order",
      amount: pendingOrder,
      icon: incomeImg,
    },
  ];

  useEffect(() => {
    fetchData();
    fetchOrders();
  }, [])


  const filterItems = [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "This year",
  ];

  return (
    <div>
      <Header headerTitle="Hello, DeshIt-BD" isShowFilter={false} />
      <div className="flex lg:flex-row xs:flex-col gap-8 ">
        <div className="w-[70%]">
          <div className="mt-8 ml-6 flex flex-wrap gap-3 pr-5">
            {cardInfo.map((item) => (
              <DashboardCard key={item.name} cardInfo={item} />
            ))}
          </div>
          <div className="mt-12 ml-6">
            <Table />
          </div>
        </div>

        <div className="bg-white mt-9 lg:w-[30%] xs:w-[70%] xs:ml-6 lg:ml-0 mr-5 rounded-lg shadow-lg">
          <div className="flex mt-6 justify-between items-center">
            <h1 className="w-[90%] font-bold text-lg ml-4">Detail Order</h1>
            <img
              src={filterIcon}
              alt=""
              title="filter"
              className="w-[8%] cursor-pointer mr-5"
              onClick={() => setIsFilterOptionOpen(!isFilterOptionOpen)}
            />

            <div className="relative">
              {isFilterOptionOpen && (
                <div className="bg-white absolute right-5 top-6 z-10 shadow-xl">
                  <ul className="w-[150px] p-2 text-sm font bold text-center font-bold">
                    {filterItems.map((item, index) => (
                      <li
                        key={index}
                        className={`py-2 hover:text-[#FFA901] cursor-pointer ${index !== filterItems.length - 1
                          ? "border-b-[1px] border-[#aaa]"
                          : ""
                          }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Overlay for close filter card */}
            {isFilterOptionOpen && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => setIsFilterOptionOpen(false)}
              ></div>
            )}
          </div>

          <h1 className="text-center mt-4 font-bold text-sm">ITEMS</h1>

          <h1 className="relative text-center mt-4 ">
            {/* THE LINE */}
            <span className="underscore"></span>
          </h1>

          {/* items */}
          <div className="">
            {foodOrderGroup.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between mt-4"
              >
                <div className="w-[75%] flex gap-2 items-center mx-4">
                  <img
                    src={`https://digitalmenu-ax0i.onrender.com/api/v1/${food.image}`}
                    alt={"img"}
                    className="w-[50px] rounded "
                  />
                  <div className="w-[70%]">
                    <h2 className="text-xm font-bold">
                      {/* {food.name} ({food.quantity}) */}
                      {food.name}
                    </h2>
                  </div>
                </div>
                <div className="w-[25%]">
                  <p className="text-xs text-gray-400">
                    {food.quantity} items
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
