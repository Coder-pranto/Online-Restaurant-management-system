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
import Loader from "../../components/Loader";

export default function OrderHistory() {
  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");

  const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false);

  const [allHistories, setAllHistories] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [orderHistories, setOrderHistories] = useState([]);
  const [foodOrderGroup, setFoodOrderGroup] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [approvedOrder, setApprovedOrder] = useState(0);
  const [canceledOrder, setCanceledOrder] = useState(0);
  const [pendingOrder, setPendingOrder] = useState(0);
  const [loading, setLoading] = useState(null);

  // console.log({ foodOrderGroup });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/order/${restaurantId}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      const allData = response.data;
      setAllHistories(allData);
      setOrderHistories(allData);
      setTotalOrder(allData.length);
      const arr1 = allData.filter((a) => a.status === "pending");
      setPendingOrder(arr1.length);
      const arr2 = allData.filter((a) => a.status === "approved");
      setApprovedOrder(arr2.length);
      const arr3 = allData.filter((a) => a.status === "rejected");
      setCanceledOrder(arr3.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/order/${restaurantId}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      const allData = response.data;
      // console.log(allData);
      setOrderHistories(allData);
      handleOrdersItem(allData);
    } catch (error) {
      console.error("Error fetching order group data:", error);
    }
  };

  const handleOrdersItem = (orderedData) => {
    const foodItems = orderedData.reduce((acc, order) => {
      order.items.forEach((item) => {
        const { _id, name, food_image } = item.foodId;
        if (!acc[name]) {
          acc[name] = { id: _id, quantity: 0, image: food_image };
        }
        acc[name].quantity += item.quantity;
      });
      return acc;
    }, {});

    const foodItemsArray = Object.entries(foodItems).map(
      ([itemName, itemData]) => ({
        id: itemData.id,
        name: itemName,
        quantity: itemData.quantity,
        image: itemData.image,
      })
    );

    setFoodOrderGroup(foodItemsArray);
  };

  const cardInfo = [
    {
      name: "Total Orders",
      amount: totalOrder,
      icon: visitorsImg,
    },
    {
      name: "Complete Order",
      amount: approvedOrder,
      icon: orderImg,
    },
    {
      name: "Cancel Order",
      amount: canceledOrder,
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
  }, []);

  const filterItems = [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "This year",
  ];

  // handle dates filter
  const handleDateOfFilter = (item) => {
    const toDaysDate = new Date();
    setIsFilterOptionOpen(false);

    //  console.log(filteredData);
    if (item === "Today") {
      toDaysDate.setDate(toDaysDate.getDate());
      const filteredData = allHistories.filter((order) => {
        const orderedDate = new Date(order.createdAt.split("T")[0]);
        return (
          orderedDate.toISOString().split("T")[0] ===
          toDaysDate.toISOString().split("T")[0]
        );
      });
      return handleOrdersItem(filteredData);
    } else if (item === "Yesterday") {
      toDaysDate.setDate(toDaysDate.getDate() - 1);

      const filteredData = allHistories.filter((order) => {
        const orderedDate = new Date(order.createdAt.split("T")[0]);
        return (
          orderedDate.toISOString().split("T")[0] ===
          toDaysDate.toISOString().split("T")[0]
        );
      });
      return handleOrdersItem(filteredData);
    } else if (item === "This week") {
      toDaysDate.setDate(toDaysDate.getDate() - 7);
      const filteredData = allHistories.filter((order) => {
        const orderedDate = new Date(order.createdAt.split("T")[0]);
        return (
          orderedDate.toISOString().split("T")[0] >=
          toDaysDate.toISOString().split("T")[0]
        );
      });
      return handleOrdersItem(filteredData);
    } else if (item === "This month") {
      toDaysDate.setDate(toDaysDate.getDate() - 30);
      const filteredData = allHistories.filter((order) => {
        const orderedDate = new Date(order.createdAt.split("T")[0]);

        return (
          orderedDate.toISOString().split("T")[0] >=
          toDaysDate.toISOString().split("T")[0]
        );
      });
      return handleOrdersItem(filteredData);
    } else if (item === "This year") {
      toDaysDate.setDate(toDaysDate.getDate() - 365);

      const filteredData = allHistories.filter((order) => {
        const orderedDate = new Date(order.createdAt.split("T")[0]);
        return (
          orderedDate.toISOString().split("T")[0] >=
          toDaysDate.toISOString().split("T")[0]
        );
      });
      return handleOrdersItem(filteredData);
    }
  };

  return (
    <div>
      <Header headerTitle="Today's Food Order" isShowFilter={false} />
      <div className="flex lg:flex-row flex-col gap-8 mx-2">
        <div className="w-full">
          {/* <div className="mt-8 flex flex-wrap justify-center gap-3 px-8"> */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-3 px-8">
            {cardInfo.map((item) => (
              <DashboardCard key={item.name} cardInfo={item} />
            ))}
          </div>
          <div className="w-full lg:px-2 mt-12">
            <Table fetchData={fetchData} orderHistories={allHistories} />
          </div>
        </div>

        <div className="bg-white mt-9 lg:w-[30%] w-full lg:ml-0 mr-5 rounded-lg shadow-lg mb-2 text-xs lg:text-sm">
          <div className="flex mt-6 justify-between items-center">
            <h1 className="w-[90%] font-bold text-lg ml-4">Detail Order</h1>
            <img
              src={filterIcon}
              alt="filter"
              title="filter"
              className="w-[4%] lg:w-[8%] cursor-pointer mr-5"
              onClick={() => setIsFilterOptionOpen(!isFilterOptionOpen)}
            />

            <div className="relative">
              {isFilterOptionOpen && (
                <div className="bg-white absolute right-3 top-6 z-10 shadow-xl border-2 rounded-lg">
                  <ul className="w-[150px] p-2 text-xs lg:text-sm font bold text-center font-bold ">
                    {filterItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleDateOfFilter(item)}
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
          <div className="mt-8">
            {foodOrderGroup.length > 0 ? (
              loading ? (
                <Loader />
              ) : (
                foodOrderGroup.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between mt-4"
                  >
                    <div className="w-[75%] flex gap-2 items-center mx-4">
                      <img
                        src={`https://digitalmenu-ax0i.onrender.com/api/v1/${food.image}`}
                        alt={"food_image"}
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
                ))
              )
            ) : (
              <p className="text-center py-6">Not found any orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
