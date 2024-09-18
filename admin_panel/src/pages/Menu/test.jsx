/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../../components/Header";
import DashboardCard from "../../components/cards/DashboardCard";
import totalItemsImg from "../../assets/cardImage/total-items.png";
import popularItemsImg from "../../assets/cardImage/popular-items.png";
import InputField from "../../components/Form/InputField";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import DynamicModal from "../../components/Modal";
import { useEffect, useState } from "react";
import ImageUploadField from "../../components/Form/imageUploadField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { HiOutlineDotsVertical } from "react-icons/hi";
// import menu1 from "../../assets/menu/menu1.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";

export default function Menu() {
  const [totalItems, setTotalItems] = useState(0);
  const [popularItems, setPopularItems] = useState(0);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalIsOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(null);
  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/category?restaurantId=${restaurantId}`
      );
      const response2 = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/food?restaurantId=${restaurantId}`
      );
      setMenus(response.data);
      setTotalItems(response2.data.filter((x) => x.categoryId !== null).length);
      setPopularItems(
        response2.data.filter((d) => d.isPopular === true).length
      );
      setLoading(false);
      // console.log(popularItems)
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // yup schema for validate new menu form
  const formInputSchema = yup.object().shape({
    name: yup.string().required("Menu Name is required"),
    image: yup
      .mixed()
      .test("imageRequired", "Menu image is required", (value) => {
        return value && value.length > 0;
      }),
  });

  const cardInfo = [
    {
      name: "Total Items",
      amount: totalItems,
      icon: totalItemsImg,
    },
    {
      name: "Popular Items",
      amount: popularItems,
      icon: popularItemsImg,
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
            : "450px",
      height: "340px",
      margin: "auto",
      border: "none",
      borderRadius: "4px",
      padding: "0px",
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(formInputSchema) });

  // handle form submit for new menu
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category_image", data.image[0]);
      formData.append("restaurantId", restaurantId);
      // console.log(formData);

      // Send POST request to create a new category
      await axios.post(
        "https://digitalmenu-ax0i.onrender.com/api/v1/category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );

      fetchData();
      reset();
      closeModal();
    } catch (error) {
      console.error("Error creating Menu:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  const handleDropdownToggle = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

  const handleDelete = async (data) => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if (!confirmation) {
      return;
    }
    try {
      const menuId = data._id;
      await axios.delete(
        `https://digitalmenu-ax0i.onrender.com/api/v1/category/${menuId}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      setActiveDropdownIndex(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting Menu:", error);
    }
  };

  const [updatedMenu, setupdatedMenu] = useState(null);

  const openEditModal = (menu) => {
    setupdatedMenu(menu);
    setActiveDropdownIndex(null);
    setUpdateModalIsOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateModalIsOpen(false);
  };

  const onUpdateSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category_image", data.image[0]);
      // formData.append("restaurantId", restaurantId);
      // console.log(formData);

      await axios.patch(
        `https://digitalmenu-ax0i.onrender.com/api/v1/category/${updatedMenu._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      fetchData();
      closeUpdateModal();
    } catch (error) {
      console.error("Error updating Menu:", error);
    }
  };

  return (
    <div>
      <Header headerTitle="Hello, DeshIt-BD" secondaryTitle={false} />
      <div className="flex flex-col lg:flex-row items-center justify-between mx-6 lg:mx-0">
        <div className=" w-[90%] mt-8 ml-6 flex lg:flex-row  gap-3 mr-5">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>
        <button
          type="button"
          className="w-full lg:w-[180px] bg-[#FFA901] text-white px-5 py-2 rounded-lg mt-5 lg:mr-7 hover:bg-yellow-400"
          onClick={openModal}
        >
          Add Menu
        </button>
      </div>

      {/* show menus */}
      <div className="mx-6 lg:mx-0 mb-5">
        <div className="mt-6 lg:ml-6 grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap gap-5 h-full">
          {loading ? (
            <Loader />
          ) : (
            menus
              ?.slice()
              .reverse()
              .map((menu, index) => (
                <div
                  key={index}
                  className="w-full lg:w-[220px] bg-white shadow-lg rounded-lg cursor-pointer relative"
                >
                  <div
                    className="absolute top-0 right-0 m-2 cursor-pointer"
                    onClick={() => handleDropdownToggle(index)}
                  >
                    <HiOutlineDotsVertical />
                  </div>
                  {activeDropdownIndex === index && (
                    <div className="absolute top-2 right-0 z-10 bg-white shadow-lg rounded-lg">
                      <ul>
                        <li
                          onClick={() => openEditModal(menu)}
                          className="p-2 border-b-2 cursor-pointer hover:bg-gray-100 hover:rounded-lg"
                        >
                          Update
                        </li>
                        <li
                          onClick={() => handleDelete(menu)}
                          className="p-2 cursor-pointer hover:bg-gray-100 hover:rounded-lg"
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}

                  <img
                    src={`https://digitalmenu-ax0i.onrender.com/api/v1/${menu.category_image}`}
                    className="w-full h-[75%] object-cover rounded-t-lg"
                    onClick={() => navigate(`/menu-details/${menu._id}`)}
                  />
                  <h2 className="text-center font-bold text-md lg:text-2xl mt-3">
                    {menu.name}
                  </h2>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modal for new menu */}
      {isModalOpen && (
        <DynamicModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          customStyle={modalCustomStyles}
          content={
            <div>
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-2xl py-2 lg:py-4 font-bold">
                  New Menu
                </h2>
              </div>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Name"
                      name="name"
                      register={register}
                      error={errors.name}
                    />
                  </div>
                  <div className="mt-2 flex justify-center w-3/4 mx-auto">
                    <ImageUploadField
                      label="Image"
                      name="image"
                      register={register}
                      error={errors.image}
                    />
                  </div>
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
                      <FontAwesomeIcon icon={faXmark} className="mr-2" />
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
        />
      )}
      {/* Modal for Update menu */}
      {isUpdateModalOpen && (
        <DynamicModal
          isOpen={isUpdateModalOpen}
          onRequestClose={closeUpdateModal}
          customStyle={modalCustomStyles}
          content={
            <div>
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-2xl py-2 lg:py-4 font-bold">
                  Update Menu
                </h2>
              </div>
              <div>
                <form onSubmit={handleSubmit(onUpdateSubmit)}>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Name"
                      name="name"
                      defaultValue={updatedMenu.name}
                      register={register}
                      error={errors.name}
                    />
                  </div>
                  <div className="mt-2 flex justify-center w-3/4 mx-auto">
                    <ImageUploadField
                      label="Image"
                      name="image"
                      register={register}
                      error={errors.image}
                    />
                  </div>
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
                      onClick={closeUpdateModal}
                    >
                      <FontAwesomeIcon icon={faXmark} className="mr-2" />
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}




