/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import { useReactToPrint } from 'react-to-print';
import OrderDetails from './OrderDetailsInvoice';
import { useEffect, useRef, useState } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import deleteIcon from "../../assets/menu/menu-details/delete.png";
import { FcViewDetails } from "react-icons/fc";
import image from "./filter1.png";
import Cookies from "js-cookie";
import axios from "axios";
import DynamicModal from "../Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Table({ fetchData, orderHistories }) {
  const authToken = Cookies.get("token");
  const toast = useRef(null);

  const [singleOrderDetails, setSingleOrderDetails] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatus = (id) => {
    const statusChange = async (newStatus) => {
      try {
        const response = await axios.patch(
          `http://localhost:5005/api/v1/order/${id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        fetchData();
        handleStockData(id, newStatus);
        console.log("Status changed", response.data);
      } catch (error) {
        console.error("Error in changing status:", error);
      }
    };

    const handleStockData = async (orderId, status) => {
      if (status === "approved") {
        try {
          const response = await axios.patch(
            `http://localhost:5005/api/v1/order/stock/${orderId}`,
            {
              headers: {
                Authorization: `${authToken}`,
              },
            }
          );
          console.log("Stock data updated successfully!", response.data);
        } catch (error) {
          console.error("Error updating stock data:", error.message);
        }
      }
    };

    // Display a confirmation dialog
    confirmDialog({
      message: "Are you sure you want to change the status?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        statusChange("approved");

        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "You have approved the order",
          life: 3000,
        });
      },
      reject: () => {
        statusChange("rejected");
        toast.current.show({
          severity: "warn",
          summary: "Rejected",
          detail: "You have rejected the order",
          life: 3000,
        });
      },
    });
  };

  const handleOrderDelete = async (id) => {
    const deleteOrder = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:5005/api/v1/order/${id}`,
          {
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );
        console.log("Delete order successfully!", response.data);
        fetchData();
      } catch (error) {
        console.error("Error deleting Order:", error.message);
      }
    };
    confirmDialog({
      message: "Are you sure you want to delete the order?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        deleteOrder();
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "Order has been deleted",
          life: 3000,
        });
      },
      reject: () => {
        console.log("Deletion canceled by user.");
      },
    });
  };

  const handleSingleOrderdetails = (id) => {
    const data = orderHistories.find((order) => order._id === id);
    setSingleOrderDetails(data);
    console.log("single order details:", data);
  };

  const [isModalOpen, setModalIsOpen] = useState(false);

  const windowWidth = window.innerWidth;

  const modalCustomStyles = {
    content: {
      width:
        windowWidth < 400
          ? "300px"
          : windowWidth >= 400 && windowWidth < 700
            ? "400px"
            : singleOrderDetails.id
              ? "800px"
              : "450px",
      height: singleOrderDetails.id ? "600px" : "470px",
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

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filterItems = [
    "All orders",
    "Completed orders",
    "Canceled orders",
    "Pending orders",
  ];
  const mapSelectedStatusToFilterItem = (selectedStatus) => {
    switch (selectedStatus) {
      case "All orders":
        return "all";
      case "Completed orders":
        return "approved";
      case "Pending orders":
        return "pending";
      case "Canceled orders":
        return "rejected";
      default:
        return "all";
    }
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orderHistories
      : orderHistories.filter((order) => order.status === selectedStatus);


  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });


  return (
    <div className="overflow-x-auto w-full bg-white shadow-lg ">
      <div className="w-full">
        <Toast ref={toast} />
      </div>

      <div>
        {/* Section with Filter Order text and dropdown menu */}
        <div className=" flex justify-between items-center">
          <div>
            <h1 className="font-bold text-md lg:text-lg ml-8 mt-4 ">
              Order Management
            </h1>
          </div>
          <div className="relative">
            <div
              className="flex gap-6 mr-[56px] border-rounded shadow-lg filter mt-6 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div>
                <h1 className="font-bold hidden lg:block">Filter Order</h1>
              </div>
              <div>
                <img className="mt-1.5 w-4" src={image} alt="vector image" />
              </div>
            </div>
            {/* Dropdown menu */}

            <div className="relative">
              {showDropdown && (
                <div className="absolute bg-white right-16 top-1 z-10 shadow-xl border-2 rounded-lg">
                  <ul className="w-[150px] p-2 text-xs lg:text-sm font bold text-center font-bold">
                    {filterItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setSelectedStatus(
                            mapSelectedStatusToFilterItem(item)
                          );
                          setShowDropdown(!showDropdown);
                        }}
                        className={`py-2 hover:text-[#FFA901] cursor-pointer ${index !== filterItems.length - 1
                          ? "border-b-[1px] border-[#aaa]"
                          : ""
                          } capitalize`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Overlay for close filter card */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => setShowDropdown(false)}
              ></div>
            )}
          </div>
        </div>

        <table className="w-full text-center mt-8 text-xs lg:text-base">
          <thead className="bg-[#FBA919] text-black">
            <tr>
              <th className="py-3 w-1/7 p-2 lg:p-4">#</th>
              <th className="py-3 w-1/7 p-2 lg:p-4">Order No</th>
              <th className="py-3 w-1/7 p-2 lg:p-4">Table No</th>
              <th className="py-3 w-3/7 p-2 lg:p-4">Food Item</th>
              <th className="py-3 w-1/7 p-2 lg:p-4">Status</th>
              <th className="py-3 w-1/7 p-2 lg:p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .slice()
              .reverse()
              .map((row, index) => (
                <tr
                  className="border border-gray-300 h-[60px] md:h-[80px] hover:bg-blue-100 bg-blue-50 odd:bg-white"
                  key={row._id}
                >
                  <td className="py-2 lg:py-3">{index + 1}</td>
                  <td className="py-2 lg:py-3">{row?.orderNumber || index}</td>
                  <td className="py-2 lg:py-3">{row?.tableNumber}</td>
                  <td className="py-2 lg:py-3">
                    <ul className="list-inside list-disc">
                      {row.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-left md:text-center">
                          {item.foodId?.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 lg:py-3">
                    <button
                      className={`btn px-2 lg:px-4 ${row.status === "pending"
                        ? "btn1"
                        : row.status === "approved"
                          ? "btn3"
                          : "btn2"
                        } hover:bg-gray-400`}
                      onClick={() => handleStatus(row._id)}
                    >
                      {row.status}
                    </button>
                  </td>
                  <td className="py-2 lg:py-3">
                    <div className="flex justify-center gap-2">
                      <FcViewDetails
                        size={"20px"}
                        className="cursor-pointer"
                        onClick={() => {
                          handleSingleOrderdetails(row._id);
                          openModal();
                        }}
                      />
                      <img
                        src={deleteIcon}
                        className="w-4 lg:w-6 cursor-pointer"
                        onClick={() => handleOrderDelete(row._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>


      </div>
      <DynamicModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        customStyle={modalCustomStyles}
        content={
          <div className="border border-gray-300">
            <div className="bg-yellow-400 flex items-center justify-between px-5">
              <h2 className="mx-auto text-white text-2xl py-4 font-bold">Order Details</h2>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-xl text-white"
                onClick={closeModal}
              />
            </div>
            <div className="">
              <div className="p-2">
                <div>
                  <OrderDetails ref={printRef} orderDetails={singleOrderDetails} />
                </div>
                <div className="text-center">
                  <button onClick={handlePrint} className="w-24 p-2 m-2 bg-green-500 rounded-lg text-white hover:bg-green-400">
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Table;











