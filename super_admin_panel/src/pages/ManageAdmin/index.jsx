import { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import Cookies from "universal-cookie";
import Button from "../../components/Button";
import DynamicModal from "../../components/DynamicModal";
import DynamicForm from "../../components/DynamicForm";
import RestaurantManageTable from "./RestaurantManageTable";
import { baseUrl } from "../../utils/BaseUrl";

const ManageAdmin = () => {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [restaurantData, setRestaurantData] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("adminToken");

  const fetchRestaurantData = async (retryCount = 0) => {
    try {
      if (!token && retryCount < 5) {
        setTimeout(() => fetchRestaurantData(retryCount + 1), 500);
        return;
      }
      const response = await axios.get(`${baseUrl}/restaurant-admin/all`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.status === "success") {
        setRestaurantData(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        enqueueSnackbar('Unauthorized access. Please log in again.', { variant: 'error' });
        console.log('Unauthorized access. Please log in again.');
      } else {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [token]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const modalCustomStyles = {
    content: {
      width: "50%",
      height: "89%",
      margin: "auto",
      border: "3px solid #ec4f22",
      borderRadius: "8px",
    },
  };

  const createRestaurantAdminBtn = {
    buttonText: "Create New",
    buttonStyle: "bg-[#ec4f22] text-white p-3 text-xl rounded-md hover:bg-orange-500",
  };

  const formFields = [
    { name: "restaurantName", label: "Restaurant Name" },
    { name: "adminName", label: "Admin Name" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "password", type: "password" },
    { name: "address", label: "Address" },
    { name: "mobileNumber", label: "Mobile Number" },
    { name: "latitude", label: "Latitude", type: "number" },
    { name: "longitude", label: "Longitude", type: "number" },
    { name: "restaurantRadius", label: "Radius", type: "number" },
    { name: "themeColor", label: "Theme Color", type: "text" },
    { name: "secondaryColor", label: "Accent Color", type: "text" },
    { name: "logo", label: "Logo", type: "file" },
  ];

  const handleFormSubmit = async (formData) => {
    const restaurantCoords = {
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };
    const {
      latitude,
      longitude,
      restaurantRadius,
      logo,
      secondaryColor,
      themeColor,
      ...otherFormInfo
    } = formData;

    const radiusInfo = {
      value: Number(restaurantRadius),
      unit: "meter",
    };
    
    const updatedFormInfo = {
      ...otherFormInfo,
      restaurantCoords,
      restaurantRadius: radiusInfo,
    };

    try {
      const token = cookies.get("adminToken");
      const response = await axios.post(
        `${baseUrl}/restaurant-admin/create`,
        updatedFormInfo,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === "success") {
        const { restaurantId } = response.data.data;
        const formData = new FormData();
        formData.append("themeColor", themeColor);
        formData.append("secondaryColor", secondaryColor);
        formData.append("logo", logo);

        const response2 = await axios.patch(
          `${baseUrl}/restaurant-admin/update/theme/${restaurantId}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response2.data.status === "success") {
          console.log("Theme updated successfully");
        } else {
          console.log("There is an error");
        }

        enqueueSnackbar("Successfully Created");
        fetchRestaurantData();
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mr-6 my-3">
        <div onClick={openModal}>
          <Button buttonInfo={createRestaurantAdminBtn} />
        </div>
      </div>
      <DynamicModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        customStyle={modalCustomStyles}
        content={
          <DynamicForm
            formFields={formFields}
            onSubmit={handleFormSubmit}
            onCancle={closeModal}
          />
        }
      />
      <div>
        <RestaurantManageTable
          fetchRestaurantData={fetchRestaurantData}
          restaurantData={restaurantData}
        />
      </div>
    </div>
  );
};

export default ManageAdmin;
