import Header from "../../components/Header";
import totalItemsImg from "../../assets/cardImage/total-items.png";
import { useEffect, useState } from "react";
import React from 'react'
import DashboardCard from "../../components/cards/DashboardCard";
import editImg from "../../assets/action-button/edit.png";
import { PiArrowElbowRightDownFill } from "react-icons/pi";
import deleteImg from "../../assets/action-button/delete.png";
import DynamicModal from "../../components/Modal";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";

export default function Stock() {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [singleStock, setSingleStock] = useState({});
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  // getting cookies
  const restaurantId = Cookies.get("restaurantId");
  const token = Cookies.get("token");

  const fetchStocks = async () => {
    setLoading(true);
    const response = await axios.get(
      `https://digitalmenu-ax0i.onrender.com/api/v1/stock_limit?restaurantId=${restaurantId}`
    );
    console.log(response.data)
    setStocks(response.data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const response = await axios.get(
      `https://digitalmenu-ax0i.onrender.com/api/v1/category?restaurantId=${restaurantId}`
    );
    const selectedProprties = response.data.map(({ _id, name }) => ({
      _id,
      name,
    }));
    setCategories(selectedProprties);
  };

  useEffect(() => {
    fetchStocks();
    fetchCategories();
  }, [setStocks, setCategories]);


  const cardInfo = [
    {
      name: "Total Stock",
      amount: stocks.length,
      icon: totalItemsImg,
    },
  ];




  useEffect(() => {
    const fetchFoodItemsByCategory = async () => {

      if (selectedCategoryId) {
        try {
          setLoading(true);
          const response = await axios.get(
            `https://digitalmenu-ax0i.onrender.com/api/v1/food/category/${selectedCategoryId}`
          );

          const foodItemsWithQuantity = response.data.map((food) => ({
            ...food,
            quantity: 0, // Initialize quantity to 0
          }));
          setFoodItems(foodItemsWithQuantity);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching food items:", error);
          setLoading(false);
        }
      } else {
        setFoodItems([]);
      }
    };

    fetchFoodItemsByCategory();
  }, [selectedCategoryId, restaurantId]);

  // Function to handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
  };







  // handle delete stock
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `https://digitalmenu-ax0i.onrender.com/api/v1/stock_limit/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("success", response.data);
        fetchStocks();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [expandedCategory, setExpandedCategory] = useState(null);



  const handleCategoryChangeACC = (categoryId) => {
    setExpandedCategory((prevCategory) =>
      prevCategory === categoryId ? null : categoryId
    );
  };


  return (
    <div className="ml-6">
      <Header headerTitle="Hello, DeshIt-BD" isShowFilter={false} />
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="mt-8 ml-6 flex flex-row gap-3 mr-5">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>
        <button
          type="button"
          className="w-full lg:w-[180px] bg-[#FFA901] text-white px-5 py-2 rounded-lg mt-5 lg:mt-0 mr-7 hover:bg-yellow-400"
          onClick={openModal}
        >
          Add New Stock
        </button>
      </div>

      {/* stock details table*/}
      <div className="bg-white lg:ml-6 mt-7 mr-7 p-4 rounded-lg overflow-x-auto text-xs lg:text-base">
        <div className="lg:w-[95%] w-[700px] bg-white p-4 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm">
                <th>Category Name</th>
                <th>Items</th>
                <th>Left Over</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Loader />
              ) : (
                stocks
                  ?.slice()
                  .reverse()
                  .map((stock) => (
                    <React.Fragment key={stock._id}>
                      <tr
                        className="text-sm cursor-pointer h-[80px]"
                        onClick={() => handleCategoryChangeACC(stock._id)}
                      >
                        <td> <div className="flex items-end"> <span>{stock?.category?.name}</span> <PiArrowElbowRightDownFill size={"10px"} /></div></td>
                        <td>{stock?.foodItems?.length}</td>
                        <td>{stock.foodItems.reduce((total, foodItem) => total + foodItem.quantity, 0)}</td>
                        <td>
                          <div className="flex gap-3">
                            <img
                              src={editImg}
                              alt="edit"
                              className="cursor-pointer"
                              onClick={() => {
                                setSingleStock(stock);
                                openEditModal();
                              }}
                            />
                            <img
                              src={deleteImg}
                              alt="delete"
                              className="cursor-pointer"
                              onClick={() => handleDelete(stock?._id)}
                            />
                          </div>
                        </td>
                      </tr>
                      {expandedCategory === stock._id && (
                        <tr>
                          <td colSpan="4">
                            <div className="overflow-x-auto">
                              <table className="w-[95%] mx-auto">
                                <thead>
                                  <tr>
                                    <th className="px-4 py-2">Food Item</th>
                                    <th className="px-4 py-2">Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stock.foodItems.map((foodItem) => (
                                    <tr key={foodItem._id}>
                                      <td className="border border-y-1 px-4 py-2">{foodItem?.food?.name}</td>
                                      <td className="border border-y-1 px-4 py-2">{foodItem?.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}

                    </React.Fragment>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
