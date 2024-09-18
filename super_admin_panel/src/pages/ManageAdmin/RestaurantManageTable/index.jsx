/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from 'react';
import DynamicTable from '../../../components/DyamicTable';
import axios from 'axios';
import { baseUrl } from '../../../utils/BaseUrl';
import Cookies from 'universal-cookie';
import { enqueueSnackbar } from 'notistack';
import DynamicModal from '../../../components/DynamicModal';
import { Icon } from '@iconify/react/dist/iconify.js';


const RestaurantManageTable = ({ fetchRestaurantData, restaurantData }) => {
    const [isModalOpen, setModalIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(''); 
    const cookies = new Cookies();
    const token = cookies.get('adminToken');

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    const colomns = [
        { key: 'restaurantName', label: 'Restaurant' },
        { key: 'adminName', label: 'Admin' },
        { key: 'restaurantId', label: 'Restaurant ID' },
        { key: 'mobileNumber', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
    ];

    const modalCustomStyles = {
        content: {
            width: '30%',
            height: '30%',
            margin: 'auto',
            border: '1px solid #ec4f22',
            borderRadius: '8px',
        },
    };

    const showDetails = (id) => {
        console.log('show more for', id);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleChangeStatus = (id) => {
        setSelectedRestaurantId(id);
        openModal();
    };

    const handleStatusFinalChange = () => {
        const updatedStatus = selectedStatus;

        axios.patch(`${baseUrl}/restaurant-admin/update/${selectedRestaurantId}`, { status: updatedStatus }, {
            headers: {
                Authorization: token
            }
        })
        .then(() => {
            fetchRestaurantData();
            enqueueSnackbar('Status updated successfull');
            closeModal();
        })
        .catch((error) => {
            console.log(error);
            enqueueSnackbar('Failed to update status');
        });
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
                        enqueueSnackbar('Deleted successfull');
                    } else {
                        enqueueSnackbar('Deleted failed');
                    }
                });
        } else {
            enqueueSnackbar('You didn\'t delete the admin.');
        }
    };

    return (
        <div>
            <DynamicTable columns={colomns} data={restaurantData} onDelete={handleDelete} onChangeStatus={handleChangeStatus} onShowDetails={showDetails}/>
            <DynamicModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                customStyle={modalCustomStyles}
                content={
                    <div>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-black font-bold text-2xl'>Change Status</h2>
                            <div onClick={closeModal} className='hover:bg-orange-500 p-2 text-black text-lg cursor-pointer'>
                                <Icon icon="mdi:cancel-bold" />
                            </div>
                        </div>
                        <div>
                            <select onChange={(e) => setSelectedStatus(e.target.value)} className='w-full border-2 border-blue-200 p-2 mt-5 text-lg'>
                                <option value='' hidden>Select a option</option>
                                <option value='active'>Active</option>
                                <option value='disable'>Disable</option>
                            </select>
                        </div>
                        <div className=' flex justify-end mt-4'>
                            <button
                                type="button"
                                onClick={handleStatusFinalChange}
                                className='bg-orange-600 px-2 py-[2px] rounded-md text-white hover:bg-orange-500'
                            >
                                Done
                            </button>
                        </div>
                    </div>
                }
            />
        </div>
    );
};

export default RestaurantManageTable;
