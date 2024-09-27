import Header from "../../components/Header";
import totalItemsImg from "../../assets/cardImage/total-items.png";
import React, { useState, useEffect } from "react";
import DashboardCard from "../../components/cards/DashboardCard";
import editImg from "../../assets/action-button/edit.png";
import { PiArrowElbowRightDownFill } from "react-icons/pi";
import deleteImg from "../../assets/action-button/delete.png";
import DynamicModal from "../../components/Modal";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import toast, { Toaster } from 'react-hot-toast';


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
      `http://localhost:5005/api/v1/stock_limit?restaurantId=${restaurantId}`
    );
    // console.log(response.data)
    setStocks(response.data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const response = await axios.get(
      `http://localhost:5005/api/v1/category?restaurantId=${restaurantId}`
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

  const windowWidth = window.innerWidth;


  const modalCustomStyles = {
    content: {
      width: windowWidth < 400 ? "80%" : windowWidth >= 400 && windowWidth < 700 ? "350px" : "450px",
      height: "400px",
      margin: "auto",
      border: "none",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      background: "white",
    },
  };



  useEffect(() => {
    const fetchFoodItemsByCategory = async () => {

      if (selectedCategoryId) {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:5005/api/v1/food/category/${selectedCategoryId}`
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

  const handleAddFoodItem = (foodId, quantity) => {
    const updatedFoodItems = foodItems.map((food) => {
      if (food._id === foodId) {
        return { ...food, quantity: parseInt(quantity) }; // Update quantity
      }
      return food;
    });
    setFoodItems(updatedFoodItems);
  };

  // Inside the handleRemoveFoodItem function
  const handleRemoveFoodItem = (foodId) => {
    const updatedFoodItems = foodItems.map((food) => {
      if (food._id === foodId) {
        return { ...food, quantity: 0 }; // Reset quantity to 0
      }
      return food;
    });
    setFoodItems(updatedFoodItems);
  };


  // handle form submit for new Stock
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      category: selectedCategoryId,
      foodItems: foodItems.map((food) => ({
        foodId: food._id,
        quantity: food.quantity,
      })),
    };

    // console.log(formData);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5005/api/v1/stock_limit",
        {
          ...formData,
          restaurantId: restaurantId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // If the request is successful, fetch stocks again to update the UI
      fetchStocks();

      // Reset form fields
      setSelectedCategoryId("");
      setFoodItems([]);

      // Close the modal
      closeModal();

      // Optionally, you can display a success message or perform other actions
      console.log("Form submitted successfully", response.data);
    } catch (error) {
      // If there's an error, handle it appropriately
      console.error("Error submitting form:", error.message);
    } finally {
      setLoading(false); // Set loading state to false after form submission is complete
    }
  };


  const showLowQuantityWarning = () => {
    if (!stocks || stocks?.length === 0) return;

    const lowQuantityItems = stocks?.reduce((acc, stock) => {
      stock?.foodItems?.forEach((foodItem) => {
        if (foodItem?.quantity <= 3 && foodItem?.food && stock?.category) {  // Add foodItem?.food check
          acc.push({
            category: stock?.category.name,
            foodName: foodItem?.food?.name,  // Ensure foodItem.food exists
            quantity: foodItem?.quantity,
          });
        }
      });
      return acc;
    }, []);

    if (lowQuantityItems?.length > 0) {
      const message = (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-full sm:max-w-lg ">
          <p className="font-bold mb-2">Low quantity items:</p>
          <div className="overflow-auto max-h-64">
            <table className="w-full mx-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Food Item</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {lowQuantityItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-200 px-4 py-2 bg-blue-50">
                      {item.foodName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 bg-blue-50">
                      {item.category}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center bg-blue-50">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mt-4 px-4 py-2 w-full sm:w-auto bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      );

      toast.custom(message, {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    showLowQuantityWarning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks]);




  // handle form submit for Edit Stock
  const handleEdit = async (data) => {
    // console.log(data);

    const updatedStockData = {
      ...data,
      left_over: data.limit,
    };

    try {
      const response = await axios.patch(
        `http://localhost:5005/api/v1/stock_limit/${singleStock._id}`,
        updatedStockData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("success", response.data);
      fetchStocks();

      closeEditModal();
    } catch (error) {
      console.log(error.message);
    }
  };

  // for new stock modal
  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // for edit stock modal
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // handle delete stock
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5005/api/v1/stock_limit/${id}`,
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
      <Header headerTitle="Today's Stock" isShowFilter={false} />
      <div className="flex flex-col lg:flex-row items-center lg:justify-between justify-center mt-8 px-8 mr-8">
        <div className="mt-8 ml-6 flex flex-col lg:flex-row gap-3 mr-5">

          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>

        <button
          type="button"
          className="w-full lg:w-[180px] bg-[#FFA901] text-white px-5 py-2 rounded-lg mt-5 lg:mt-0 lg:mr-7 hover:bg-yellow-400"
          onClick={openModal}
        >
          Add New Stock
        </button>
      </div>

      {/* stock details table*/}
      <div className="lg:ml-6 mt-7 mr-7 rounded-lg overflow-x-auto text-xs lg:text-base">
        <div className="lg:w-[95%] w-[700px] bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#FBA919] text-white">
              <tr>
                <th className="px-4 py-2">Category Name</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Left Over</th>
                <th className="px-4 py-2">Action</th>
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
                        className="text-sm cursor-pointer h-[80px] hover:bg-blue-100 bg-blue-50 odd:bg-white"
                        onClick={() => handleCategoryChangeACC(stock._id)}
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-end">
                            <span>{stock?.category?.name}</span>
                            <PiArrowElbowRightDownFill size={"10px"} />
                          </div>
                        </td>
                        <td className="px-4 py-2">{stock?.foodItems?.length}</td>
                        <td className="px-4 py-2">
                          {stock.foodItems.reduce(
                            (total, foodItem) => total + foodItem.quantity,
                            0
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex">
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
                              <table className="w-[75%] mx-auto">
                                <thead className="bg-gray-200">
                                  <tr>
                                    <th className="px-4 py-2">Food Item</th>
                                    <th className="px-4 py-2 text-center">Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stock.foodItems.map((foodItem) => (
                                    <tr key={foodItem._id}>
                                      <td className="border border-gray-200 px-4 py-2 bg-blue-50">
                                        {foodItem?.food?.name}
                                      </td>
                                      <td className="border border-gray-200 px-4 py-2 text-center bg-blue-50">
                                        {foodItem?.quantity}
                                      </td>
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

      {/* Modal for new stock */}
      {isModalOpen && (
        <DynamicModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          customStyle={modalCustomStyles}
          content={
            <div className="text-sm lg:text-base">
              <div className="bg-[#ffa901] rounded-t-lg">
                <h2 className="text-center text-white text-lg lg:text-2xl py-2 lg:py-4 font-bold mb-4">
                  New Stock
                </h2>
              </div>
              <div className=" rounded-b-lg ">
                {/* Form for creating new stock */}
                <form onSubmit={handleSubmit}>
                  {/* Select category */}
                  <div className="mb-4">
                    <label className="block font-bold mb-2">
                      Category<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={handleCategoryChange}
                      className="border p-2 w-full rounded-lg bg-gray-100"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Display food items based on selected category */}
                  {foodItems.length > 0 && (
                    <div className="mt-4">
                      {foodItems.map((food) => (
                        <div key={food._id} className="flex items-center mb-3">
                          <span className="mr-2 w-52">{food.name}</span>
                          <input
                            type="number"
                            placeholder="Quantity"
                            className="border p-2 w-24 rounded-lg bg-gray-100"
                            value={food.quantity}
                            onChange={(e) => handleAddFoodItem(food._id, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFoodItem(food._id)}
                            className="ml-2 text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white rounded-md px-4 py-2 mt-4 hover:bg-yellow-600 mx-auto"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
        />
      )}


      {/* Modal for edit stock */}
      <Toaster />
    </div>
  );
}
