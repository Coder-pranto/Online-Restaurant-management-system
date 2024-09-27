// Expenses.js
import edit from "../../assets/expenses/edit.png";
import delet from "../../assets/expenses/delete.png";
import filt from "../../assets/expenses/filter.png";
// import check from '../../assets/expenses/sav.png';
// import close from '../../assets/expenses/cls.png';

import { useEffect, useState } from "react";

import Header from "../../components/Header";
import DashboardCard from "../../components/cards/DashboardCard";
import expenseImg from "../../assets/expenses/money.png";
import InputField from "../../components/Form/InputField";
import { useForm } from "react-hook-form";
import DynamicModal from "../../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
// import ImageUploadField from "../../components/Form/imageUploadField";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false);
  const [specificOpenEditModal, setSpecificOpenEditModal] = useState(null);
  const [loading, setLoading] = useState(null);
  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");

  let totalExpenses = 0;

  const cardInfo = {
    name: "Total Expanses",
    amount: totalExpenses,
    icon: expenseImg,
  };

  for (const expense of expenses) {
    totalExpenses += parseFloat(expense?.price);
  }

  cardInfo["amount"] = totalExpenses;
  // console.log(totalExpenses, cardInfo['amount']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // console.log({ expenses });
  // get expenses data
  const fetchExpensesData = async () => {
    setLoading(true);
    const response = await axios.get(
      `http://localhost:5005/api/v1//expense?restaurantId=${restaurantId}`,
      {
        headers: {
          Authorization: `${authToken}`,
        },
      }
    );
    // console.log(response.data);
    setExpenses(response.data);
    setFilteredExpenses(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const expensesData = {
        item_name: data?.productName,
        quantity: data?.quantity,
        price: data?.PRICE,
        restaurantId: restaurantId,
      };
      console.log(expensesData);
      const response = await axios.post(
        "http://localhost:5005/api/v1/expense",
        expensesData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );
      console.log("Expenses added:", response.data);
      fetchExpensesData();
      reset();
      closeModal();
    } catch (error) {
      console.error("Error addeed expenses:", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      console.log(data);
      const updateExpensesData = {
        item_name: data?.productName,
        quantity: data?.quantity,
        price: data?.PRICE,
        restaurantId: restaurantId,
      };
      // console.log(updateExpensesData);
      const response = await axios.patch(
        `http://localhost:5005/api/v1/expense/${data.id}`,
        updateExpensesData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
        }
      );
      console.log("Expenses updated:", response.data);
      fetchExpensesData();
      reset();
      closeEditModal();
    } catch (error) {
      console.error("Error updated expenses:", error);
    }
  };

  // handle delete button
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expenses item?")) {
      // console.log('deleted success', id);
      // /employee/65a4365368955007495f0c40
      try {
        const response = await axios.delete(
          `http://localhost:5005/api/v1/expense/${id}`,

          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        console.log("Expenses info deleted:", response.data);
        fetchExpensesData();
      } catch (error) {
        console.error("Error Deleted expenses:", error);
      }
    }
  };

  const modalCustomStyles = {
    content: {
      width: window.innerWidth < 700 ? "300px" : "450px",
      height: "470px",
      margin: "auto",
      border: "none",
      borderRadius: "4px",
      padding: "0px",
    },
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openEditModal = (id) => {
    // console.log({ id,specificOpenEditModal });
    // setIsEditModalOpen(true);
    setIsEditModalOpen(true);
    setSpecificOpenEditModal((prev) => (prev === id ? null : id));
    // console.log({ id, specificOpenEditModal });
  };

  const closeEditModal = () => {
    reset();
    setIsEditModalOpen(false);
  };

  // console.log({ specificOpenEditModal });

  const filterItems = [
    "All Expenses",
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "This year",
  ];

  // Define a function to handle filtering based on dates
  const handleDateFilter = (item) => {
    // console.log("filter function called")
    const toDaysDate = new Date();
    setIsFilterOptionOpen(false);
    let filteredData = [...expenses];

    if (item === "Today") {
      filteredData = expenses.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate.toDateString() === toDaysDate.toDateString();
      });
    } else if (item === "Yesterday") {
      toDaysDate.setDate(toDaysDate.getDate() - 1);

      filteredData = expenses.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate.toDateString() === toDaysDate.toDateString();
      });
    } else if (item === "This week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(toDaysDate.getDate() - toDaysDate.getDay()); // Move to first day of the week
      const endOfWeek = new Date();
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to last day of the week

      filteredData = expenses.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate >= startOfWeek && boughtDate <= endOfWeek;
      });
    } else if (item === "This month") {
      const startOfMonth = new Date(
        toDaysDate.getFullYear(),
        toDaysDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        toDaysDate.getFullYear(),
        toDaysDate.getMonth() + 1,
        0
      );

      filteredData = expenses.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate >= startOfMonth && boughtDate <= endOfMonth;
      });
    } else if (item === "This year") {
      const startOfYear = new Date(toDaysDate.getFullYear(), 0, 1);
      const endOfYear = new Date(toDaysDate.getFullYear(), 11, 31);

      filteredData = expenses.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate >= startOfYear && boughtDate <= endOfYear;
      });
    }
    setFilteredExpenses(filteredData);
  };

  return (
    <div>
      <Header headerTitle="Expenses Information" isShowFilter={false} />
      {/* <div className="mt-6 ml-6 flex flex-wrap gap-3 pr-5">
        {<DashboardCard cardInfo={cardInfo} />}
      </div> */}

      <div className="mt-8 lg:ml-6 w-[50%] mx-auto flex flex-col lg:flex-row gap-3 lg:mr-5">
        <DashboardCard cardInfo={cardInfo} />
      </div>

      <div>
        <div className="mt-12 flex justify-between items-center gap-3">
          <div>
            <h1 className="font-bold text-lg lg:text-2xl ml-6 lg:mt-4 ">
              Expenses
            </h1>
          </div>

          <div className="flex gap-2 ">
            <div>
              <img
                onClick={() => setIsFilterOptionOpen(!isFilterOptionOpen)}
                className="w-4 lg:w-6 mt-2 mr-6"
                src={filt}
                alt="filter"
              />

              <div className="relative">
                {isFilterOptionOpen && (
                  <div className="bg-white absolute right-5  py-1 p-2 mt-2 w-36 text-center z-10 shadow-xl border-2 rounded-lg text-xs lg:text-base">
                    <ul>
                      {filterItems.map((item, index) => (
                        <li
                          key={index}
                          className={`  text-sm  p-2 hover:text-[#FFA901] cursor-pointer ${index !== filterItems.length - 1
                            ? "border-b-[1px] border-[#aaa]"
                            : ""
                            }`}
                          onClick={() => handleDateFilter(item)}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {isFilterOptionOpen && (
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsFilterOptionOpen(false)}
                  ></div>
                )}
              </div>
            </div>
            <div>
              <button
                onClick={openModal}
                className="px-3 lg:px-0 py-2 lg:py-0 text-xs lg:text-base lg:w-[180px] lg:h-[48px] bg-[#FFA901] mr-7 rounded-[16px] text-white font-bold"
              >
                Add Product
              </button>
              {/* add new expenses form */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center  ">
                  <div className="p-6 rounded-md bg-white w-96">
                    <div className="space-y-3 bg-white flex justify-between items-center pb-3 w-full ">
                      <div>
                        <DynamicModal
                          isOpen={isModalOpen}
                          onRequestClose={closeModal}
                          customStyle={modalCustomStyles}
                          content={
                            <div className="lg:ml-2 lg:mr-2 sm:ml-8 sm:mr-12 text-xs lg:text-base">
                              <div className="bg-[#ffa901] mt-8">
                                <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
                                  PRODUCT EXPENSES
                                </h2>
                              </div>
                              <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="lg:ml-6 w-3/4 mx-auto lg:w-full">
                                  <InputField
                                    label="PRODUCT NAME"
                                    name="productName"
                                    register={register}
                                    error={errors}
                                  />
                                </div>

                                <div className="lg:ml-6 w-3/4 mx-auto lg:w-full">
                                  <div className="">
                                    <InputField
                                      label="QUANTITY"
                                      name="quantity"
                                      register={register}
                                      error={errors.quality}
                                    />
                                  </div>
                                </div>

                                <div className="lg:ml-6 w-3/4 mx-auto lg:w-full">
                                  <InputField
                                    label="PRICE"
                                    name="PRICE"
                                    register={register}
                                    error={errors}
                                  />
                                </div>
                                <div className="lg:w-[87%] md:w-[78%] w-[74%] mx-auto mt-4 mb-3 flex justify-between">
                                  <button
                                    type="submit"
                                    className="bg-[#ffa910] text-white py-[2px] px-5 font-semibold rounded-xl"
                                  >
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className="mr-2"
                                    />
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    className="bg-[#EE1212] text-white py-[2px] px-5 font-semibold rounded-xl"
                                    onClick={closeModal}
                                  >
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="mr-2"
                                    />
                                    Close
                                  </button>
                                </div>
                              </form>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto text-xs lg:text-base">
          <div className="w-full lg:w-[95%] mt-8">
            <table className="w-full ml-6 mr-7 mt-8 bg-white rounded-lg lg:p-0">
              <thead>
                <tr>
                  <th className="py-2 px-2 lg:px-4">Serial NO</th>
                  <th className="py-2 px-2 lg:px-4">Product Name</th>
                  <th className="py-2 px-2 lg:px-4">Quantity</th>
                  <th className="py-2 px-2 lg:px-4">Price</th>
                  <th className="py-2 px-2 lg:px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <Loader />
                ) : (
                  filteredExpenses
                    ?.slice()
                    .reverse()
                    .map((expense, index) => (
                      <tr className="text-center odd:bg-blue-100 even:bg-white" key={index}>
                        <td className="py-2 px-2 lg:px-4">{index + 1}</td>
                        <td className="py-2 px-2 lg:px-4">{expense?.item_name}</td>
                        <td className="py-2 px-2 lg:px-4">{expense?.quantity}</td>
                        <td className="py-2 px-2 lg:px-4">৳{expense?.price}</td>
                        <td className="py-2 px-2 lg:px-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              className="py-2 rounded"
                              onClick={() => openEditModal(expense._id)}
                            >
                              <img src={edit} alt="edit" className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            <button
                              className="py-2 rounded"
                              onClick={() => handleDelete(expense._id)}
                            >
                              <img src={delet} alt="delete" className="w-4 h-4 lg:w-5 lg:h-5" />
                            </button>
                            {isEditModalOpen && specificOpenEditModal === expense._id && (
                              <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                                <div className="p-6 rounded-md bg-white w-96">
                                  <div className="space-y-3 bg-white flex justify-between items-center pb-3 w-full">
                                    <div>
                                      <DynamicModal
                                        isOpen={isEditModalOpen}
                                        onRequestClose={() => closeEditModal(expense._id)}
                                        customStyle={modalCustomStyles}
                                        content={
                                          <div className="lg:ml-2 lg:mr-2 sm:ml-8 sm:mr-12 text-xs lg:text-base">
                                            <div className="bg-[#ffa901] mt-8">
                                              <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
                                                EDIT PRODUCT EXPENSES
                                              </h2>
                                            </div>
                                            <form onSubmit={handleSubmit(handleEdit)}>
                                              <div className="ml-6 hidden">
                                                <InputField
                                                  label="id"
                                                  name="id"
                                                  register={register}
                                                  defaultValue={expense._id}
                                                  error={errors}
                                                />
                                              </div>
                                              <div className="lg:ml-6 w-3/4 mx-auto lg:w-full">
                                                <InputField
                                                  label="PRODUCT NAME"
                                                  name="productName"
                                                  register={register}
                                                  defaultValue={expense.item_name}
                                                  error={errors}
                                                />
                                              </div>
                                              <div className="lg:ml-6 w-3/4 mx-auto lg:w-full">
                                                <InputField
                                                  label="QUANTITY"
                                                  name="quantity"
                                                  defaultValue={expense?.quantity}
                                                  register={register}
                                                  error={errors.quantity}
                                                />
                                              </div>
                                              <div className="lg:ml-6 w-3/4 mx-auto lg:w-full">
                                                <InputField
                                                  label="PRICE"
                                                  name="PRICE"
                                                  defaultValue={expense.price}
                                                  register={register}
                                                  error={errors}
                                                />
                                              </div>
                                              <div className="lg:w-[87%] md:w-[78%] w-[74%] mx-auto mt-4 mb-3 flex justify-between">
                                                <button
                                                  type="submit"
                                                  className="bg-[#ffa910] text-white py-1 px-5 font-semibold rounded-xl"
                                                >
                                                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                  Save
                                                </button>
                                                <button
                                                  type="button"
                                                  className="bg-[#EE1212] text-white py-1 px-5 font-semibold rounded-xl"
                                                  onClick={closeEditModal}
                                                >
                                                  <FontAwesomeIcon icon={faXmark} className="mr-2" />
                                                  Close
                                                </button>
                                              </div>
                                            </form>
                                          </div>
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
