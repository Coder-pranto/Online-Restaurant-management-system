/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import DynamicModal from "../../components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../../components/Form/InputField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageUploadField from "../../components/Form/imageUploadField";
import axios from "axios";
import editIcon from "../../assets/menu/menu-details/edit.png";
import deleteIcon from "../../assets/menu/menu-details/delete.png";

// addExtraFrom Schema for validation
const addExtraFormSchema = yup.object().shape({
  name: yup.string().required("Menu Name is required"),
  price: yup.string().required("Price is required"),
  addonsImage: yup
    .mixed()
    .test("imageRequired", "Image is required", (value) => {
      return value && value.length > 0;
    }),
});

export default function AddExtra({
  isOpen,
  closeModal,
  category,
  restaurantId,
  authToken,
}) {
  const [addOns, setAddOns] = useState([]);
  const [singleAddOn, setSingleAddOn] = useState({});
  const [singleAddOnModalIsOpen, setSingleAddOnModalIsOpen] = useState(false);

  const { categoryId, categoryName } = category;

  // fetching add-ons data
  const fetchData = async () => {
    const response = await axios.get(
      `https://digitalmenu-ax0i.onrender.com/api/v1/addons/${categoryId}`
    );
    setAddOns(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addExtraFormSchema),
  });

  const windowWidth = window.innerWidth;

  // modal style
  const modalCustomStyles = {
    content: {
      width:
        windowWidth < 400
          ? "300px"
          : windowWidth >= 400 && windowWidth < 700
            ? "350px"
            : "450px",
      height: "470px",
      margin: "auto",
      border: "none",
      borderRadius: "4px",
      padding: "0px",
    },
  };

  // handling modal
  const openAddOnModal = () => setSingleAddOnModalIsOpen(true);
  const closeAddOnModal = () => {
    setSingleAddOnModalIsOpen(false);
    reset();
  };

  // creating add-ons
  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("addonsImage", data.addonsImage[0]);
      formData.append("restaurantId", restaurantId);
      formData.append("category", categoryId);

      await axios.post(
        "https://digitalmenu-ax0i.onrender.com/api/v1/addons",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      fetchData();
      closeModal();
      reset();
    } catch (error) {
      console.log(error.message);
    }
  };

  // handlind editing of single addon
  const handleEdit = async (data) => {
    // console.log(data);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("addonsImage", data.addonsImage[0]);
      formData.append("restaurantId", restaurantId);
      formData.append("category", categoryId);

      const response = await axios.patch(
        `https://digitalmenu-ax0i.onrender.com/api/v1/addons/${singleAddOn?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      //   console.log(response.data);
      alert(`${singleAddOn?.name} Updated Successfully`);
      fetchData();
      closeAddOnModal();
      reset();
    } catch (error) {
      console.log(error.message);
    }
  };

  // handling delete functionlity
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await axios.delete(
          `https://digitalmenu-ax0i.onrender.com/api/v1/addons/${id}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        // console.log(response);
        fetchData();
        alert(`${response.data.message}`);
      } catch (error) {
        console.error("Error deleting addons item:", error);
      }
    }
  };

  return (
    <>
      <div className="py-5">
        <h2 className="text-xl font-bold">
          {categoryName} Item Addons{" "}
          <span className="text-[#ffa901]">({addOns.length})</span>
        </h2>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="w-[15%]">Image</th>
            <th className="w-[40%]">Name</th>
            <th className="w-[15%]">Price</th>
            <th className="w-[30%]">Action</th>
          </tr>
        </thead>
        <tbody>
          {addOns?.map((item) => (
            <tr
              key={item?._id}
              className="border-collapse border-l-0 border-r-0 border border-gray-300 h-[80px]"
            >
              <td>
                <img
                  src={`https://digitalmenu-ax0i.onrender.com/api/v1/${item?.addonsImage}`}
                  alt={item?.name}
                  //   loading="lazy"
                  className="w-[40px] h-[40px] rounded-xl object-cover"
                />
              </td>
              <td>{item?.name}</td>
              <td>{item?.price}</td>
              <td>
                <div className="w-[20%] lg:w-[30%] flex gap-4 items-center">
                  <img
                    src={editIcon}
                    alt="edit"
                    className="cursor-pointer"
                    onClick={() => {
                      setSingleAddOn(item);
                      openAddOnModal();
                    }}
                  />
                  <img
                    src={deleteIcon}
                    alt="delete"
                    className="cursor-pointer"
                    onClick={() => handleDelete(item?._id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for adding add-on */}
      {isOpen && (
        <DynamicModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          customStyle={modalCustomStyles}
          content={
            <div className="text-xs lg:text-base">
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-lg lg:text-2xl py-2 lg:py-4 font-bold">
                  Add Food Extra's
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
                      name="addonsImage"
                      register={register}
                      error={errors.addonsImage}
                    />
                  </div>

                  <div className="lg:w-[87%]  mx-auto mt-5 mb-3 flex lg:justify-between justify-center gap-x-8">
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
                      onClick={() => {
                        closeModal();
                        reset();
                      }}
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

      {/* Edit add-on modal */}
      {singleAddOnModalIsOpen && (
        <DynamicModal
          isOpen={singleAddOnModalIsOpen}
          onRequestClose={closeAddOnModal}
          customStyle={modalCustomStyles}
          content={
            <div className="text-xs lg:text-base">
              <div className="bg-[#ffa901]">
                <h2 className="text-center text-white text-lg lg:text-2xl py-2 lg:py-4 font-bold">
                  Edit Food Extra's
                </h2>
              </div>
              <div>
                <form onSubmit={handleSubmit(handleEdit)}>
                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Name"
                      name="name"
                      defaultValue={singleAddOn.name}
                      register={register}
                      error={errors.name}
                    />
                  </div>

                  <div className="mt-4 flex justify-center w-3/4 mx-auto">
                    <InputField
                      label="Price"
                      name="price"
                      defaultValue={singleAddOn.price}
                      register={register}
                      error={errors.price}
                    />
                  </div>

                  <div className="mt-2 flex justify-center w-3/4 mx-auto">
                    <ImageUploadField
                      label="Image"
                      name="addonsImage"
                      register={register}
                      error={errors.addonsImage}
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
                      onClick={closeAddOnModal}
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
    </>
  );
}
