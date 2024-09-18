/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import DashboardCard from "../../components/cards/DashboardCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import ImageUploadField from "../../components/Form/imageUploadField";
import InputField from "../../components/Form/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import DynamicModal from "../../components/Modal";
import * as yup from "yup";
import totalEmployees from "../../assets/cardImage/visitors.png";
import editImg from "../../assets/action-button/edit.png";
import deleteImg from "../../assets/action-button/delete.png";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "../../components/Loader";
import { FaCheck, FaTimes } from 'react-icons/fa';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [specificOpenEditModal, setSpecificOpenEditModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const restaurantId = Cookies.get('restaurantId');
  const authToken = Cookies.get('token');

  const formInputSchema = yup.object().shape({
    name: yup.string().required('Employee Name is required'),
    address: yup.string().required('Employee address is required'),
    jobTitle: yup.string().required('Job title is required'),
    workHour: yup.string().required('Work hour is required'),
    image: yup
      .mixed()
      .test('imageRequired', 'Employee image is required', (value) => {
        return value && value.length > 0;
      }),
  });

  const cardInfo = [
    {
      name: 'Total Employees',
      amount: employees?.length,
      icon: totalEmployees,
    },
  ];

  const windowWidth = window.innerWidth;

  const modalCustomStyles = {
    content: {
      width:
        windowWidth < 400
          ? '80%'
          : windowWidth >= 400 && windowWidth < 700
            ? '350px'
            : '450px',
      height: '600px',
      margin: 'auto',
      border: 'none',
      borderRadius: '4px',
      padding: '0px',
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formInputSchema),
  });

  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/employee?restaurantId=${restaurantId}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('mobile', data.mobile);
      formData.append('jobTitle', data.jobTitle);
      formData.append('workHour', data.workHour);
      formData.append('employeeImage', data.image[0]);
      formData.append('restaurantId', restaurantId);

      await axios.post(
        'https://digitalmenu-ax0i.onrender.com/api/v1/employee',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${authToken}`,
          },
        }
      );
      fetchEmployeesData();
      reset();
      closeModal();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEdit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('mobile', data.mobile);
      formData.append('jobTitle', data.jobTitle);
      formData.append('workHour', data.workHour);
      formData.append('employeeImage', data.image[0]);
      formData.append('restaurantId', restaurantId);

      await axios.patch(
        `https://digitalmenu-ax0i.onrender.com/api/v1/employee/${data.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${authToken}`,
          },
        }
      );
      fetchEmployeesData();
      reset();
      closeEditModal();
    } catch (error) {
      console.error('Error editing employee:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(
          `https://digitalmenu-ax0i.onrender.com/api/v1/employee/${id}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        fetchEmployeesData();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    reset();
  };

  const openEditModal = (id) => {
    setIsEditModalOpen(true);
    setSpecificOpenEditModal((prev) => (prev === id ? null : id));
  };

  const closeEditModal = () => {
    reset();
    setIsEditModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.mobile.includes(searchQuery) ||
    employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div >
      <Header
        headerTitle="Employee Information"
        isSearch={true}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="mt-8 ml-6 flex flex-col lg:flex-row gap-3 mr-5">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>
        <button
          type="button"
          className="w-[150px] lg:w-[180px] bg-[#FFA901] text-white px-5 py-2 rounded-lg mt-5 lg:mt-8 lg:mr-7 hover:bg-yellow-400 mx-auto"
          onClick={openModal}
        >
          Add Employee
        </button>
        {isModalOpen && (
          <DynamicModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            customStyle={modalCustomStyles}
            content={
              <div className="text-xs lg:text-base">
                <div className="bg-[#ffa901]">
                  <h2 className="text-center text-white text-lg lg:text-2xl py-2 lg:py-4 font-bold">
                    New Employee
                  </h2>
                </div>
                <div className="p-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Name" name="name" register={register} error={errors.name} />
                      <InputField label="Address" name="address" register={register} error={errors.address} />
                      <InputField label="Mobile" name="mobile" register={register} error={errors.mobile} />
                      <InputField label="Job Title" name="jobTitle" register={register} error={errors.jobTitle} />
                      <InputField label="Work Hours" name="workHour" register={register} error={errors.workHour} />
                      <ImageUploadField label="Image" name="image" register={register} error={errors.image} />
                    </div>
                    <div className="flex justify-between space-x-4">
                      <button
                        type="submit"
                        className="bg-[#ffa910] text-white py-2 px-4 md:px-8 font-semibold rounded-lg flex items-center"
                      >
                        <FaCheck className="mr-2" />
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-[#EE1212] text-white py-2 px-4 md:px-8 font-semibold rounded-lg flex items-center"
                        onClick={closeModal}
                      >
                        <FaTimes className="mr-2" />
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

      <div className="w-full overflow-x-auto bg-white rounded-lg shadow-lg mt-10 ">
        <table className="min-w-full text-left">
          <thead className="bg-[#FFA901] text-black">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-8">Address</th>
              <th className="py-2 px-4">Mobile</th>
              <th className="py-2 px-4">Job Title</th>
              <th className="py-2 px-4 text-center">Work Hours</th>
              <th className="py-2 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  <Loader />
                </td>
              </tr>
            ) : (
              filteredData
                .slice()
                .reverse()
                .map((employee, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 cursor-pointer hover:bg-blue-100 bg-blue-50 odd:bg-white"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://digitalmenu-ax0i.onrender.com/api/v1/${employee?.employeeImage}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{employee.address}</td>
                    <td className="py-3 px-4">{employee.mobile}</td>
                    <td className="py-3 px-4">{employee.jobTitle}</td>
                    <td className="py-3 px-4 text-center">{employee.workHour}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                        <img
                          src={editImg}
                          alt="Edit"
                          className="cursor-pointer"
                          onClick={() => openEditModal(employee._id)}
                        />
                        <img
                          src={deleteImg}
                          alt="Delete"
                          className="cursor-pointer"
                          onClick={() => handleDelete(employee?._id)}
                        />
                        {isEditModalOpen && specificOpenEditModal === employee._id && (
                          <div className="fixed bg-gray-900 bg-opacity-50 flex items-center justify-center inset-0">
                            <div className="p-6 rounded-md bg-white w-96">
                              <div className="space-y-3 bg-white flex justify-between items-center w-full">
                                <DynamicModal
                                  isOpen={isEditModalOpen}
                                  onRequestClose={closeEditModal}
                                  customStyle={modalCustomStyles}
                                  content={
                                    <div className="text-xs lg:text-base">
                                      <div className="bg-[#ffa901]">
                                        <h2 className="text-center text-white text-lg lg:text-2xl py-2 lg:py-4 font-bold">
                                          Edit Employee Info
                                        </h2>
                                      </div>
                                      <div className="p-4">
                                        <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
                                          <div className="hidden">
                                            <InputField label="Id" name="id" defaultValue={employee._id} register={register} error={errors.id} />
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField label="Name" name="name" defaultValue={employee?.name} register={register} error={errors.name} />
                                            <InputField label="Address" name="address" defaultValue={employee?.address} register={register} error={errors.address} />
                                            <InputField label="Mobile" name="mobile" defaultValue={employee?.mobile} register={register} error={errors.mobile} />
                                            <InputField label="Job Title" name="jobTitle" defaultValue={employee?.jobTitle} register={register} error={errors.jobTitle} />
                                            <InputField label="Work Hours" name="workHour" defaultValue={employee.workHour} register={register} error={errors.workHour} />
                                            <ImageUploadField label="Image" name="image" register={register} error={errors.image} />
                                          </div>
                                          <div className="flex justify-between space-x-4">
                                            <button
                                              type="submit"
                                              className="bg-[#ffa910] text-white py-2 px-4 md:px-8 font-semibold rounded-lg flex items-center"
                                            >
                                              <FaCheck className="mr-2" />
                                              Save
                                            </button>
                                            <button
                                              type="button"
                                              className="bg-[#EE1212] text-white py-2 px-4 md:px-8 font-semibold rounded-lg flex items-center"
                                              onClick={closeEditModal}
                                            >
                                              <FaTimes className="mr-2" />
                                              Close
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                  }
                                />
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
  );
}

export default Employee;


