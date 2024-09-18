import { useParams } from "react-router-dom";
import Header from "../../components/Header";
// import menu1 from "../../assets/menu/menu1.png";
import editIcon from "../../assets/menu/menu-details/edit.png";
import deleteIcon from "../../assets/menu/menu-details/delete.png";
import totalItemsImg from "../../assets/cardImage/total-items.png";
import popularItemsImg from "../../assets/cardImage/popular-items.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageUploadField from "../../components/Form/imageUploadField";
import InputField from "../../components/Form/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import DynamicModal from "../../components/Modal";
import Cookies from "js-cookie";
import axios from "axios";
import AddExtra from "./AddExtra";
import DashboardCard from "../../components/cards/DashboardCard";
import AddVariation from "./AddVariation";

import { useLocation } from 'react-router-dom';

export default function MenuDetails() {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [addExtraModalIsOpen, setAddExtraModalIsOpen] = useState(false);
  const [specificEditModal, setSpecificEditModal] = useState(null);
  const [singleMenuDetails, setSingleMenuDetails] = useState({});
  const [isShowModalForAddItem, setIsShowModalForAddItem] = useState(false);
  const [isMenuEditOpen, setIsMenuEditOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [popularItems, setPopularItems] = useState(0);
  const [count, setCount] = useState(0);

  const { id } = useParams();
  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");

  const [addSize, setAddSize] = useState(false);
  const [addPiece, setAddPiece] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const categoryImage = location.state ? location.state.categoryImage : null;

  // yup schema for validate new menu form
  const formInputSchema = yup.object().shape({
    name: yup.string().required("Menu Name is required"),
    price: yup.string().required("Price is required"),
    preparationTime: yup.string().required("Preparation Time is required"),
    description: yup.string().required("Description is required"),
    image: yup
      .mixed()
    // .test("imageRequired", "Menu image is required", (value) => {
    //   return value && value.length > 0;
    // }),

  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/food/category/${id}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      // console.log(response.data);
      setCategory(response.data[0].categoryId.name);
      setCount(response.data.length);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  const fetchRestaurentData = async () => {
    try {
      const response2 = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/food?restaurantId=${restaurantId}`
      );
      setTotalItems(response2.data.filter((x) => x.categoryId !== null).length);
      setPopularItems(
        response2.data.filter((d) => d.isPopular === true).length
      );
      // console.log(popularItems)
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRestaurentData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formInputSchema),
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
          ? "300px"
          : windowWidth >= 400 && windowWidth < 700
            ? "350px"
            : singleMenuDetails.id
              ? "800px"
              : "800px",
      height: singleMenuDetails.id ? "600px" : "470px",
      margin: "auto",
      // border: "1px solid #ec4f22",
      border: "none",
      borderRadius: "4px",
      padding: "0px",
    },
  };

  // handle form submit for new food
  const onAddItemSubmit = async (data) => {
    try {
      // console.log(data);
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("food_image", data.image[0]);
      formData.append("description", data.description);
      formData.append("preparationTime", data.preparationTime);
      formData.append(
        "ingredients",
        JSON.stringify(data.ingredients.split(","))
      );
      formData.append(
        "spicyLevels",
        JSON.stringify(data.spicyLevels.split(","))
      );
      formData.append("restaurantId", restaurantId);
      formData.append("categoryId", id);
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("pieces", JSON.stringify(data.pieces));

      console.log("Request data:", formData);

      const response = await axios.post(
        "https://digitalmenu-ax0i.onrender.com/api/v1/food",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );

      console.log("Food created:", response.data);
      response.status === "200" && setLoading(false);
      fetchData();
      closeModal();
      reset();
    } catch (error) {
      console.error("Error creating Food:", error.message);
      alert("Error creating Food");
      closeModal();
    }
  };
  //*

  const openModal = () => {
    setModalIsOpen(true);
  };

  const openEditModal = (id) => {
    // console.log('185' ,id)
    setEditModalIsOpen(true);
    setSpecificEditModal((prevState) => (prevState === id ? null : id));
  };

  const openAddExtraModal = () => setAddExtraModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeEditModal = () => {
    reset();
    setEditModalIsOpen(false);
  };

  const closeAddExtraModal = () => {
    setAddExtraModalIsOpen(false);
    // reset();
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `https://digitalmenu-ax0i.onrender.com/api/v1/food/${foodId}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        alert("Deleted successfully:");
        console.log(response.data);
        fetchData();
      } catch (error) {
        console.error("Error deleting food item:", error);
      }
    }
  };

  const handleComplete = () => {
    setSingleMenuDetails({});
    setModalIsOpen(false);
    closeEditModal();
  };

  const onEditItemSubmit = async (data) => {
    try {
      const formData = new FormData();
      const itemId = data.id;
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("food_image", data.image[0]);
      formData.append("description", data.description);
      formData.append("preparationTime", data.preparationTime);
      formData.append(
        "ingredients",
        JSON.stringify(data.ingredients.split(","))
      );
      formData.append(
        "spicyLevels",
        JSON.stringify(data.spicyLevels.split(","))
      );
      formData.append("categoryId", id);

      // Add item ID to the form data
      formData.append("itemId", singleMenuDetails._id);

      if (data.size && data.s_price) {
        formData.append(
          "sizes",
          JSON.stringify([{ size: data.size, price: data.s_price }])
        );
      }
      if (data.size && data.p_price) {
        formData.append(
          "pieces",
          JSON.stringify([{ pieces: data.pieces, price: data.p_price }])
        );
      }

      console.log(formData, itemId);

      const response = await axios.patch(
        `https://digitalmenu-ax0i.onrender.com/api/v1/food/${itemId}`, // Endpoint for updating item
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );

      console.log("Food updated:", response.data);
      fetchData(); // Fetch updated data
      closeEditModal(); // Close the edit modal
      reset(); // Reset the form
    } catch (error) {
      console.error("Error updating Food:", error.message);
      alert("Error updating Food");
    }
  };

  const handleClick = async (Id, checker) => {
    try {
      console.log(checker);
      const test = !checker;
      const response = await axios.patch(
        `https://digitalmenu-ax0i.onrender.com/api/v1/food/${Id}`,
        { isPopular: test },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      fetchData();
      fetchRestaurentData();
      console.log(response.data);
    } catch (error) {
      console.error("Error updating Offer:", error.message);
      alert("Error updating Offer");
    }
  };


  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div>
      <Header headerTitle="Hello, DeshIt-BD" isShowFilter={false} />

      <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
        <div className="mt-8 ml-6 flex flex-row gap-3 mr-5">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>
        <div className="flex justify-end mt-6 lg:mt-0 gap-x-2">
          <button
            type="button"
            className="bg-[#ffa901] py-[10px] px-3 text-white rounded-lg shadow-md"
            onClick={() => {
              setSingleMenuDetails({});
              openModal();
              setIsShowModalForAddItem(true);
            }}
          >
            Add New Food
          </button>
          <button
            type="button"
            className="bg-[#ffa901] py-[10px] px-3 text-white rounded-lg shadow-md mr-4 ml-2"
            onClick={openAddExtraModal}
          >
            Add Extra
          </button>
        </div>
      </div>
      <div className="ml-6 flex lg:flex-row flex-col gap-2 mr-6 lg:mr-0 overflow-x-auto xs:overflow-hidden mb-6">
        <div className="w-full lg:w-[23%]">
          <div className="w-full lg:w-[190px] md:w-[150px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-center">
            <img
              src={`https://digitalmenu-ax0i.onrender.com/api/v1/${categoryImage}`}
              className="lg:p-4 lg:w-full"
            />
            <h2 className="text-center font-bold text-lg lg:text-2xl pb-4">
              {category}
            </h2>
          </div>
        </div>

        <div className="lg:w-[77%] w-full mr-6 flex flex-col gap-10 text-xs lg:text-base">
          {/* menu details table */}
          <div className="bg-white rounded-lg lg:p-4 p-2">
            <div className="py-5">
              <h2 className="text-xl font-bold">
                {`${category}`}{" "}
                <span className="text-[#ffa901]"> ({count})</span>
              </h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="w-1/4 lg:w-[15%]">Image</th>
                  <th className="w-1/4 lg:w-[40%]">Name</th>
                  <th className="w-[10%] lg:w-[15%]">Price</th>
                  <th className="w-[38%] lg:w-[30%] text-center lg:text-start">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-collapse border-l-0 border-r-0 border border-gray-300 h-[80px]"
                  >
                    <td className="w-1/4 lg:w-[15%]">
                      <div className="w-[80px] flex gap-x-2">
                        <button
                          className={`text-lg lg:text-2xl focus:outline-none ${item.isPopular ? "text-yellow-500" : ""
                            }`}
                          onClick={() => handleClick(item._id, item.isPopular)}
                        >
                          &#9733;
                        </button>
                        <img
                          src={`https://digitalmenu-ax0i.onrender.com/api/v1/${item.food_image}`}
                          alt=""
                          className="w-full rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="w-1/4 lg:w-[40%] text-wrap">{item.name}</td>
                    <td className="w-[10%] px-1 lg:px-0 lg:w-[15%]">
                      {item.price}
                    </td>
                    <td>
                      <div className="w-[20%] lg:w-[30%] flex gap-2 lg:gap-4 items-center">
                        <button
                          type="button"
                          className="bg-[#ff9a01] text-white px-2 lg:px-4 py-[3px] rounded-lg"
                          onClick={() => {
                            setIsMenuEditOpen(false);
                            setIsShowModalForAddItem(false);
                            setSingleMenuDetails(item);
                            openModal();
                          }}
                        >
                          Details
                        </button>
                        <img
                          src={editIcon}
                          className="cursor-pointer"
                          onClick={() => {
                            openEditModal(item._id);
                          }}
                        />
                        <img
                          src={deleteIcon}
                          className="cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    </td>

                    {/* Edit modal */}
                    {editModalIsOpen && specificEditModal === item._id && (
                      <DynamicModal
                        isOpen={editModalIsOpen}
                        onRequestClose={() => closeEditModal()}
                        customStyle={modalCustomStyles}
                        content={
                          <div className="text-xs lg:text-base border-1 border-red-400">
                            <div className="bg-[#ffa901]">
                              <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
                                Edit Item
                              </h2>
                            </div>
                            <div>
                              <form onSubmit={handleSubmit(onEditItemSubmit)}>
                                <div className="mt-4 justify-center hidden">
                                  <InputField
                                    label="Id"
                                    name="id"
                                    defaultValue={item?._id}
                                    register={register}
                                    error={errors.name}
                                  />
                                </div>
                                <div className="mt-4 flex justify-center w-3/4 mx-auto">
                                  <InputField
                                    label="Name"
                                    name="name"
                                    defaultValue={item?.name}
                                    register={register}
                                    error={errors.name}
                                  />
                                </div>
                                <div className="mt-4 flex justify-center w-3/4 mx-auto">
                                  <InputField
                                    label="Price"
                                    name="price"
                                    defaultValue={item?.price}
                                    register={register}
                                    error={errors.price}
                                  />
                                </div>
                                <div className="mt-2 flex flex-col justify-start items-start w-3/4 mx-auto">
                                  <ImageUploadField
                                    label="Image"
                                    name="image"
                                    register={register}
                                    error={errors.image}
                                    onChange={handleImageChange}
                                  />
                                  <div className="mt-2 flex justify-center">
                                    {selectedImage ? (
                                      <img
                                        // src={`https://digitalmenu-ax0i.onrender.com/api/v1/${selectedImage}`}
                                        src={selectedImage}
                                        alt="Selected_item"
                                        className="w-32 h-20 object-cover rounded-md"
                                      />
                                    ) : (
                                      item?.food_image && (
                                        <img
                                          src={`https://digitalmenu-ax0i.onrender.com/api/v1/${item?.food_image}`}
                                          alt="Food_image"
                                          className="w-32 h-20 object-cover rounded-md"
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-center w-3/4 mx-auto">
                                  <InputField
                                    label="Description"
                                    name="description"
                                    defaultValue={item?.description}
                                    register={register}
                                    error={errors.description}
                                  />
                                </div>
                                <div className="mt-4 flex justify-center w-3/4 mx-auto">
                                  <InputField
                                    label="Ingredients"
                                    defaultValue={item?.ingredients}
                                    name="ingredients"
                                    register={register}
                                  />
                                </div>
                                <div className="mt-4 flex justify-center w-3/4 mx-auto">
                                  <InputField
                                    label="Spicy Levels"
                                    name="spicyLevels"
                                    defaultValue={item?.spicyLevels}
                                    register={register}
                                  />
                                </div>
                                <div className="mt-4 flex justify-center w-3/4 mx-auto">
                                  <InputField
                                    label="Preparation Time"
                                    name="preparationTime"
                                    defaultValue={item?.preparationTime}
                                    register={register}
                                    error={errors.preparationTime}
                                  />
                                </div>

                                <AddVariation
                                  register={register}
                                  control={control}
                                  name="sizes"
                                  label={["Size", "Price"]}
                                  items={{ size: "", price: "" }}
                                />

                                <AddVariation
                                  register={register}
                                  control={control}
                                  name="pieces"
                                  label={["Piece", "Price"]}
                                  items={{ pieces: "", price: "" }}
                                />

                                <div className="lg:w-[87%] mx-auto mt-5 mb-3 flex lg:justify-between justify-center gap-x-10">
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
                                    onClick={handleComplete}
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
                          </div>
                        }
                      />
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add extra details table */}
          <div className="bg-white rounded-lg p-4">
            <AddExtra
              isOpen={addExtraModalIsOpen}
              closeModal={closeAddExtraModal}
              category={{ categoryId: id, categoryName: category }}
              restaurantId={restaurantId}
              authToken={authToken}
            />
          </div>
        </div>
      </div>

      {/* Modal for adding new menu item} */}
      <DynamicModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        customStyle={modalCustomStyles}
        content={
          isShowModalForAddItem ? (
            <div className="text-xs lg:text-base">
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
                  New Item
                </h2>
              </div>
              <div>
                <form onSubmit={handleSubmit(onAddItemSubmit)}>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Name"
                      name="name"
                      register={register}
                      error={errors.name}
                    />
                  </div>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Price"
                      name="price"
                      register={register}
                      error={errors.price}
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
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Description"
                      name="description"
                      register={register}
                      error={errors.description}
                    />
                  </div>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Ingedients"
                      name="ingredients"
                      register={register}
                    />
                  </div>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Spicy Levels"
                      name="spicyLevels"
                      register={register}
                    />
                  </div>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Preperation Time"
                      name="preparationTime"
                      register={register}
                      error={errors.preparationTime}
                    />
                  </div>

                  <AddVariation
                    register={register}
                    control={control}
                    name="sizes"
                    label={["Size", "Price"]}
                    items={{ size: "", price: "" }}
                  />

                  <AddVariation
                    register={register}
                    control={control}
                    name="pieces"
                    label={["Piece", "Price"]}
                    items={{ pieces: "", price: "" }}
                  />
                  <div className="lg:w-[87%]  mx-auto mt-5 mb-3 flex lg:justify-between justify-center gap-x-8">
                    <button
                      type="submit"
                      className="bg-[#ffa910] text-white py-[2px] px-5 font-semibold rounded-xl"
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      {loading ? "Saving..." : "Save"}
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
          ) : isMenuEditOpen ? (
            <div className="text-xs lg:text-base">
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
                  Edit Item
                </h2>
              </div>
              <div>
                <form onSubmit={handleSubmit(onEditItemSubmit)}>
                  <div className="mt-4 flex justify-center">
                    <InputField
                      label="Name"
                      name="name"
                      defaultValue={singleMenuDetails?.name}
                      register={register}
                      error={errors.name}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <InputField
                      label="Price"
                      name="price"
                      defaultValue={singleMenuDetails?.price}
                      register={register}
                      error={errors.price}
                    />
                  </div>
                  <div className="mt-2 flex justify-center">
                    <ImageUploadField
                      label="Image"
                      name="image"
                      register={register}
                      error={errors.image}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <InputField
                      label="Description"
                      name="description"
                      defaultValue={singleMenuDetails?.description}
                      register={register}
                      error={errors.description}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <InputField
                      label="Ingedients"
                      defaultValue={singleMenuDetails?.ingredients}
                      name="ingredients"
                      register={register}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <InputField
                      label="Spicy Levels"
                      name="spicyLevels"
                      defaultValue={singleMenuDetails?.spicyLevels}
                      register={register}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    <InputField
                      label="Preperation Time"
                      name="preparationTime"
                      defaultValue={singleMenuDetails?.preparationTime}
                      register={register}
                      error={errors.preparationTime}
                    />
                  </div>

                  {addSize ? (
                    <div className="mt-2 flex-col justify-center border-2 border-gray-400 rounded-md mx-4 p-2">
                      <div className="mt-2 flex justify-center">
                        <InputField
                          label="Size"
                          name="size"
                          register={register}
                          placeholder="Enter size"
                        />
                      </div>
                      <div className="mt-2 flex justify-center">
                        <InputField
                          label="Size Price"
                          name="s_price"
                          register={register}
                          placeholder="Enter size price"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => setAddSize(!addSize)}
                        className="border-2 bg-orange-400 p-1.5 w-30 mt-4 text-white rounded-lg "
                      >
                        Add food size
                      </button>
                    </div>
                  )}

                  {addPiece ? (
                    <div className="mt-2 flex-col justify-center border-2 border-gray-400 rounded-md mx-4 p-2">
                      <div className="mt-2 flex justify-center">
                        <InputField
                          label="Pieces"
                          name="pieces"
                          register={register}
                          placeholder="Enter piece"
                        />
                      </div>
                      <div className="mt-2 flex justify-center">
                        <InputField
                          label="Price"
                          name="p_price"
                          register={register}
                          placeholder="Enter piece price"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => setAddPiece(!addPiece)}
                        className="border-2 bg-orange-400 p-1.5 w-30 mt-4 text-white rounded-lg "
                      >
                        Add pieces
                      </button>
                    </div>
                  )}

                  <div className="lg:w-[87%] md:w-[78%] sm:w-[74%] mx-auto mt-5 mb-3 flex justify-between">
                    <button
                      type="submit"
                      className="bg-[#ffa910] text-white py-[2px] px-5 font-semibold rounded-xl"
                      onClick={handleComplete}
                    >
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Save
                    </button>
                    <button
                      type="button"
                      className="bg-[#EE1212] text-white py-[2px] px-5 font-semibold rounded-xl"
                      onClick={handleComplete}
                    >
                      <FontAwesomeIcon icon={faXmark} className="mr-2" />
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="border-2 border-gray-300 text-xs lg:text-base">
              <div className="bg-[#ffa901] flex items-center justify-between px-5 py-4">
                <h2 className="lg:ml-[45%] text-white text-lg lg:text-2xl font-bold">
                  Item Details
                </h2>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="cursor-pointer text-xl text-white"
                  onClick={closeModal}
                />
              </div>
              <div className="p-2 lg:p-3 flex flex-col lg:flex-row gap-4 mt-5 lg:ml-5 xs:ml-0">
                <div className="w-full lg:w-[15%] flex justify-center lg:block">
                  <img
                    src={`https://digitalmenu-ax0i.onrender.com/api/v1/${singleMenuDetails?.food_image}`}
                    className="rounded-xl"
                  />
                </div>
                <div className="w-full lg:w-[85%]">
                  <table className="text-left w-full">
                    <tbody>
                      <tr>
                        <th className="w-[20%]">Name:</th>
                        <td>{singleMenuDetails?.name}</td>
                      </tr>
                      <tr>
                        <th>Price:</th>
                        <td>{singleMenuDetails?.price}</td>
                      </tr>
                      <tr>
                        <th>Description:</th>
                        <td className="text-justify">{singleMenuDetails?.description}</td>
                      </tr>
                      <tr>
                        <th>Ingredients:</th>
                        <td>{singleMenuDetails?.ingredients?.join(", ")}</td>
                      </tr>
                      <tr>
                        <th>Spicy Level:</th>
                        <td>{singleMenuDetails?.spicyLevels?.join(", ")}</td>
                      </tr>
                      <tr>
                        <th>Sizes:</th>
                        <td>
                          <ul className="list-disc pl-4">
                            {singleMenuDetails?.sizes?.map((size) => (
                              <li key={size._id}>
                                {size.size}
                                <span className="font-bold"> {size.price}TK</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <th>Pieces:</th>
                        <td>
                          <ul className="list-disc pl-4">
                            {singleMenuDetails?.pieces?.map((p) => (
                              <li key={p._id}>
                                {p.pieces}-pieces
                                <span className="font-bold"> {p.price}TK</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <th>Preparation time:</th>
                        <td>{singleMenuDetails?.preparationTime} mins</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          )
        }
      />
    </div>
  );
}
