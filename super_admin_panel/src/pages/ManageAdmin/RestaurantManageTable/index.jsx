import { useEffect, useState } from 'react';
import DynamicTable from '../../../components/DyamicTable';
import axios from 'axios';
import { baseUrl } from '../../../utils/BaseUrl';
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';
import DynamicModal from '../../../components/DynamicModal';
import DynamicForm from '../../../components/DynamicForm';

const RestaurantManageTable = ({ fetchRestaurantData, restaurantData }) => {
    const [isModalOpen, setModalIsOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); 
    const cookies = new Cookies();
    const token = cookies.get('adminToken');

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    const columns = [
        { key: 'restaurantName', label: 'Restaurant' },
        { key: 'adminName', label: 'Admin' },
        { key: 'restaurantId', label: 'Restaurant ID' },
        { key: 'mobileNumber', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
    ];

    const modalCustomStyles = {
        content: {
            width: '50%',
            height: '80%',
            margin: 'auto',
            border: '3px solid #ec4f22',
            borderRadius: '8px',
        },
    };


    const handleEdit = (id) => {
        const restaurant = restaurantData.find(item => item.restaurantId === id);
        setSelectedRestaurant(restaurant);
        setModalIsOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure, You want to delete the admin?")) {
            axios.delete(`${baseUrl}/restaurant-admin/delete/${id}`, {
                headers: {
                    Authorization: token
                }
            })
            .then(data => {
                if (data.data.data.deletedCount) {
                    fetchRestaurantData();
                    enqueueSnackbar('Deleted successfully');
                } else {
                    enqueueSnackbar('Delete failed');
                }
            });
        } else {
            enqueueSnackbar('You didn\'t delete the admin.');
        }
    };

    const handleFormSubmit = async (formData) => {
        const restaurantCoords = {
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
        };
        console.log(formData)
        const {
            // eslint-disable-next-line no-unused-vars
            latitude,
            // eslint-disable-next-line no-unused-vars
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
            const response = await axios.patch(
                `${baseUrl}/restaurant-admin/update/${selectedRestaurant.restaurantId}`,
                //  `http://localhost:5005/api/v1/restaurant-admin/update/${selectedRestaurant.restaurantId}`,
                updatedFormInfo,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.data.status === "success") {
                const { restaurantId } = response.data.data;
                if (logo) {
                    const formData = new FormData();
                    formData.append("themeColor", themeColor);
                    formData.append("secondaryColor", secondaryColor);
                    formData.append("logo", logo);

                    await axios.patch(
                        `${baseUrl}/restaurant-admin/update/theme/${restaurantId}`,
                        formData,
                        {
                            headers: {
                                Authorization: token,
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                }

                enqueueSnackbar("Successfully updated");
                fetchRestaurantData();
                setModalIsOpen(false);
                window.location.reload(true);
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    

    return (
        <div>
            <DynamicTable columns={columns} data={restaurantData} onDelete={handleDelete}  onEdit={handleEdit} />
            
            <DynamicModal
                isOpen={isModalOpen}
                onRequestClose={() => setModalIsOpen(false)}
                customStyle={modalCustomStyles}
                content={
                    selectedRestaurant && (
                        <DynamicForm
                            formFields={[
                                { name: "restaurantName", label: "Restaurant Name", type: "text", value: selectedRestaurant.restaurantName },
                                { name: "adminName", label: "Admin Name", type: "text", value: selectedRestaurant.adminName },
                                { name: "email", label: "Email", type: "email", value: selectedRestaurant.email },
                                { name: "password", label: "Password", type: "text",value:selectedRestaurant.password },
                                { name: "address", label: "Address", type: "text", value: selectedRestaurant.address },
                                { name: "mobileNumber", label: "Mobile Number", type: "text", value: selectedRestaurant.mobileNumber },
                                { name: "latitude", label: "Latitude", type: "number", value: selectedRestaurant.restaurantCoords.latitude },
                                { name: "longitude", label: "Longitude", type: "number", value: selectedRestaurant.restaurantCoords.longitude },
                                { name: "restaurantRadius", label: "Radius", type: "number", value: selectedRestaurant.restaurantRadius.value },
                                { name: "themeColor", label: "Theme Color", type: "text", value: selectedRestaurant.themeColor },
                                { name: "secondaryColor", label: "Accent Color", type: "text", value: selectedRestaurant.secondaryColor },
                                { name: "logo", label: "Logo", type: "file" },
                                { name: "status", label: "Status", type: "select", value: selectedRestaurant.status, options: [{ value: 'active', label: 'Active' }, { value: 'disable', label: 'Inactive' }] },
                            ]}
                            onSubmit={handleFormSubmit}
                            onCancle={() => setModalIsOpen(false)}
                        />
                    )
                }
            />
        </div>
    );
};

export default RestaurantManageTable;
