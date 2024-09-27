/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import totalItemsImg from "../../assets/cardImage/total-items.png";
import popularItemsImg from "../../assets/cardImage/popular-items.png";
import incomeItemsImg from "../../assets/cardImage/income.png";
import deleteIcon from "../../assets/menu/menu-details/delete.png";
import DashboardCard from "../../components/cards/DashboardCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import ImageUploadField from "../../components/Form/imageUploadField";
import InputField from "../../components/Form/InputField";
import DynamicModal from "../../components/Modal";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RadioField from "../../components/Form/RadioField";
import DateField from "../../components/Form/DateField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import editImg from "../../assets/action-button/edit.png";
import detailImg from "../../assets/action-button/details.png";

import { MultiSelect } from "primereact/multiselect";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import EditOffer from "./EditOffer";
import Loader from "../../components/Loader";

export default function Offer() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [todaysOffers, setTodaysOffers] = useState(0);
  const [popularOffers, setPopularOffers] = useState(0);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isEditModalOpen, setEditModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const [categories, setCategories] = useState([]);

  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");
  const foodGroup = categories;

  const [selectedFoods, setSelectedFoods] = useState(
    new Array(foodGroup.length).fill([])
  );

  const [singleOffer, setSingleOffer] = useState({});

  // yup schema for validate new offer form
  const formInputSchema = yup.object().shape({
    name: yup.string().required("Menu Name is required"),
    image: yup
      .mixed()
      .test("imageRequired", "Menu image is required", (value) => {
        return value && value.length > 0;
      }),
    amount: yup.number().required("Discount amount is required"),
    type: yup.string().required("Offer Type is required"),
    startDate: yup.date().required("Start Date is required"),
    endDate: yup.date().required("End Date is required"),
  });

  const cardInfo = [
    {
      name: "Total Offers",
      amount: totalOffers,
      icon: totalItemsImg,
    },
    {
      name: "Today’s Offers",
      amount: todaysOffers,
      icon: popularItemsImg,
    },
    {
      name: "Popular Offers",
      amount: popularOffers,
      icon: incomeItemsImg,
    },
  ];

  const windowWidth = window.innerWidth;

  // modal style
  const modalCustomStyles = {
    content: {
      width:
        windowWidth < 400
          ? "80%"
          : windowWidth >= 400 && windowWidth < 700
            ? "350px"
            : "800px",
      height: window.innerHeight < 700 ? "450px" : "630px",
      margin: "auto",
      border: "1px solid #ff9a01",
      borderRadius: "4px",
      padding: "0px",
    },
  };


  // fetching foods
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5005/api/v1/food?restaurantId=${restaurantId}`
      );

      const allFood = response.data.filter((item) => item.categoryId !== null);
      // console.log(allFood);

      const uniqueCategories = allFood.reduce((unique, item) => {
        const existingIndex = unique.findIndex(
          (c) => c._id === item.categoryId._id
        );
        if (existingIndex === -1) {
          unique.push(item.categoryId);
        }
        return unique;
      }, []);

      // console.log(uniqueCategories)

      const foodGroups = uniqueCategories.map((uniqueCategory) => {
        const foodsInCategory = allFood
          .filter((food) => food?.categoryId._id === uniqueCategory._id)
          .map((food) => ({ _id: food._id, name: food.name }));

        return {
          [uniqueCategory.name]: foodsInCategory,
        };
      });

      setCategories(foodGroups);
      setLoading(false);
      // console.log("Grouped data", foodGroups);
    } catch (error) {
      console.error("Error fetching foods data:", error);
    }
  };

  // fetching offers
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5005/api/v1/offer?restaurantId=${restaurantId}`
      );
      setOffers(response.data);
      setTotalOffers(response.data.length);
      setPopularOffers(response.data.filter((offer) => offer.isPopular).length);
      const today = new Date().toISOString().slice(0, 10);
      response.data.filter((offer) => offer.createdAt.slice(0, 10) === today)
        .length;
      setTodaysOffers(
        response.data.filter((offer) => offer.createdAt.slice(0, 10) === today)
          .length
      );
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFoods();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formInputSchema) });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("offer_name", data.name);
      formData.append("type", data.type);
      formData.append("value", parseInt(data.amount));
      formData.append("start_date", new Date(data.startDate).toISOString());
      formData.append("end_date", new Date(data.endDate).toISOString());
      formData.append("offer_image", data.image[0]);
      formData.append("restaurantId", restaurantId);

      const foodIds = selectedFoods.flatMap((group) =>
        group?.map((food) => food._id)
      );
      formData.set("food_ids", JSON.stringify(foodIds));
      console.log("foodIds", foodIds);
      console.log(formData);

      const response = await axios.post(
        "http://localhost:5005/api/v1/offer",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      console.log("Offer created:", response.data);
      fetchData();
      reset();
      setSelectedFoods(new Array(foodGroup.length).fill([]));
      closeModal();
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  // Add offer modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    reset();
  };

  // Edit offer modal
  const openEditModal = (offer) => {
    setSingleOffer(offer);
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => {
    reset();
    setEditModalIsOpen(false);
  };

  const handleSelectedFoodsChange = (index, value) => {
    const newSelectedFoods = [...selectedFoods];
    newSelectedFoods[index] = value;
    setSelectedFoods(newSelectedFoods);
    // console.log(selectedFoods);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5005/api/v1/offer/${id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${authToken}`,
            },
          }
        );
        console.log("Offer is Deleted!", response.data);
        fetchData();
      } catch (error) {
        console.error("Error deleting offer:", error);
      }
    }
  };

  const handleClick = async (Id, checker) => {
    try {
      console.log(checker);
      const test = !checker;
      const response = await axios.patch(
        `http://localhost:5005/api/v1/offer/${Id}`,
        { isPopular: test },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      fetchData();
      fetchFoods();
      console.log(response.data);
    } catch (error) {
      console.error("Error updating Offer:", error.message);
      alert("Error updating Offer");
    }
  };

  return (
    <div className="overflow-x-auto mr-6 lg:mr-0">
      <Header headerTitle="Today's Offers" />
      <div className="flex lg:flex-row flex-col items-center">
        {/* <div className=" mt-8 ml-6 flex lg:flex-row gap-3 lg:mr-5"> */}
        <div className="w-[90%] mt-8 ml-6 grid grid-cols-2 lg:grid-cols-5 gap-3 lg:mr-5">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>
        <div>
          <button
            type="button"
            className="xs:w-[180px] bg-[#FFA901] text-black px-5 py-2 rounded-lg mt-5 lg:mr-7 hover:bg-yellow-400"
            onClick={openModal}
          >
            Add Offer
          </button>
        </div>
      </div>
      <a></a>
      <div className="overflow-x-auto ml-6 my-8">
        <div className="lg:w-[95%] w-full bg-white text-xs lg:text-base rounded-lg shadow-lg">
          <table className="min-w-full text-left">
            <thead className="bg-[#FBA919] text-black">
              <tr className="h-12">
                <th className="px-4 py-2">Offer</th>
                <th className="px-4 py-2">Offer Name</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <Loader />
              ) : (
                offers
                  .slice()
                  .reverse()
                  .map((offer, index) => (
                    <tr
                      key={offer._id}
                      className={`h-[40px] ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition-colors duration-200`}
                    >
                      <td className="w-[1%] lg:w-auto px-4 py-2">
                        <div className="flex items-center gap-x-3">
                          <button
                            className={`text-lg lg:text-2xl focus:outline-none ${offer.isPopular ? "text-yellow-500" : "text-gray-400"} hover:text-yellow-500 transition-colors duration-200`}
                            onClick={() => handleClick(offer._id, offer.isPopular)}
                          >
                            &#9733;
                          </button>
                          <img
                            src={`http://localhost:5005/api/v1/${offer?.offer_image}`}
                            alt="offer"
                            className="w-10 h-10 lg:w-16 lg:h-16 object-cover rounded-full"
                          />
                        </div>
                      </td>
                      <td className="w-[10%] lg:w-auto px-4 py-2">{offer?.offer_name}</td>
                      <td className="w-[10%] lg:w-auto px-4 py-2">
                        {offer?.start_date.toLocaleString("en-US").slice(0, 10)}
                      </td>
                      <td className="w-[10%] lg:w-auto px-4 py-2">
                        {offer?.end_date.toLocaleString("en-US").slice(0, 10)}
                      </td>
                      <td className="w-[15%] lg:w-auto px-4 py-2">
                        <div className="flex justify-center items-center gap-3">
                          <img
                            src={detailImg}
                            alt="detail"
                            className="cursor-pointer w-4 lg:w-6 hover:scale-110 transition-transform duration-200"
                            onClick={() => navigate(`/offer-details/${offer._id}`)}
                          />
                          <img
                            src={editImg}
                            alt="edit"
                            className="cursor-pointer w-4 lg:w-6 hover:scale-110 transition-transform duration-200"
                            onClick={() => openEditModal(offer)}
                          />
                          <img
                            src={deleteIcon}
                            alt="delete"
                            className="cursor-pointer w-4 lg:w-6 hover:scale-110 transition-transform duration-200"
                            onClick={() => handleDelete(offer._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for new offer */}
      {isModalOpen && (
        <DynamicModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          customStyle={modalCustomStyles}
          content={
            <div className="text-xs lg:text-base">
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
                  New Offer
                </h2>
              </div>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="lg:w-[50%] ml-4">
                      <div className="mt-4 w-4/5 mx-auto lg:w-full">
                        <InputField
                          label="Offer Name"
                          name="name"
                          register={register}
                          error={errors.name}
                        />
                      </div>
                      <div className="mt-4 w-4/5 mx-auto lg:w-full">
                        <ImageUploadField
                          label="Offer Image"
                          name="image"
                          register={register}
                          error={errors.image}
                        />
                      </div>
                      <div className="mt-4 w-4/5 mx-auto lg:w-full">
                        <RadioField
                          label="Offer Type"
                          name="type"
                          options={["percentage", "amount"]}
                          register={register}
                          error={errors.type}
                        />
                      </div>
                      <div className="mt-4 w-4/5 mx-auto lg:w-full">
                        <InputField
                          label="Discount Amount"
                          name="amount"
                          register={register}
                          error={errors.amount}
                        />
                      </div>

                      <div className="mt-4 w-4/5 mx-auto lg:w-full">
                        <DateField
                          label="Offer Start"
                          name="startDate"
                          register={register}
                          error={errors.startDate}
                        />
                      </div>
                      <div className="mt-4 w-4/5 mx-auto lg:w-full">
                        <DateField
                          label="Offer End"
                          name="endDate"
                          register={register}
                          error={errors.endDate}
                        />
                      </div>

                      {windowWidth > 700 && (
                        <div className="lg:w-[87%] md:w-[78%] sm:w-[74%] mx-auto mt-5 mb-3 flex justify-between">
                          <button
                            type="submit"
                            className="bg-[#ffa910] text-white py-[2px] px-5 font-semibold rounded-xl"
                          >
                            <FontAwesomeIcon icon={faCheck} className="mr-2" />
                            Save
                          </button>
                          <button
                            type="button"
                            className="bg-[#EE1212] text-white py-[2px] px-5 font-semibold rounded-xl"
                            onClick={closeModal}
                          >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="lg:w-[45%]">
                      <h2 className="mt-5 font-bold text-sm lg:text-lg text-center lg:text-start mb-4 lg:mb-0">
                        Select Foods for Offer
                      </h2>
                      <div>
                        {foodGroup.map((categoryGroup, index) => {
                          const categoryName = Object.keys(categoryGroup)[0];
                          const foods = categoryGroup[categoryName];

                          return (
                            <div
                              key={index}
                              className="w-3/4 mx-auto lg:w-full"
                            >
                              <MultiSelect
                                value={selectedFoods[index]}
                                onChange={(e) =>
                                  handleSelectedFoodsChange(index, e.value)
                                }
                                options={foods}
                                optionLabel="name"
                                placeholder={categoryName}
                                maxSelectedLabels={3}
                                className="w-full md:w-20rem mb-4"
                              />
                            </div>
                          );
                        })}
                        {windowWidth <= 700 && (
                          <div className="lg:w-[87%] md:w-[78%] w-[74%] mx-auto mt-5 mb-3 flex justify-between">
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
                                icon={faTimes}
                                className="mr-2"
                              />
                              Close
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          }
        />
      )}

      {/* Modal for edit offer */}
      {isEditModalOpen && (
        <EditOffer
          isModalOpen={isEditModalOpen}
          closeModal={closeEditModal}
          modalCustomStyles={modalCustomStyles}
          register={register}
          handleSubmit={handleSubmit}
          reset={reset}
          errors={{ errors }}
          foodGroup={foodGroup}
          offer={singleOffer}
          authToken={authToken}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}
