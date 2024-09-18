import Header from "../../components/Header";
import totalItemsImg from "../../assets/cardImage/total-items.png";
import popularItemsImg from "../../assets/cardImage/popular-items.png";
import incomeItemsImg from "../../assets/cardImage/income.png";
import DashboardCard from "../../components/cards/DashboardCard";
import { useNavigate, useParams } from "react-router-dom";
import DateField from "../../components/Form/DateField";
import InputField from "../../components/Form/InputField";
import RadioField from "../../components/Form/RadioField";
import ImageUploadField from "../../components/Form/imageUploadField";
import DynamicModal from "../../components/Modal";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import Cookies from "js-cookie";

export default function OfferDetails() {
  const [offer, setOffer] = useState([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [todaysOffers, setTodaysOffers] = useState(0);
  const [popularOffers, setPopularOffers] = useState(0);
  const [isModalOpen, setModalIsOpen] = useState(false);

  const restaurantId = Cookies.get("restaurantId");
  const authToken = Cookies.get("token");
  const { id } = useParams();
  const navigate = useNavigate();
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://digitalmenu-ax0i.onrender.com/api/v1/offer?restaurantId=${restaurantId}`
      );
      const arr = response.data.filter((d) => d._id === id);
      setOffer(arr[0]);
      console.log(offer);

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
  }, []);

  // modal style
  const modalCustomStyles = {
    content: {
      width: "850px",
      height: "630px",
      margin: "auto",
      border: "1px solid #ff9a01",
      borderRadius: "4px",
      padding: "0px",
    },
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formInputSchema),
  });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="overflow-x-auto mx-6">
      <Header headerTitle="Hello, DeshIt-BD" />
      <div className="flex lg:flex-row items-center justify-between">
        <div className="lg:w-[70%] xs:w-[95%] mt-8 lg:ml-6 flex flex-col lg:flex-row gap-3 mr-5">
          {cardInfo.map((item) => (
            <DashboardCard key={item.name} cardInfo={item} />
          ))}
        </div>
      </div>

      <div className="lg:ml-6 flex lg:flex-row xs:flex-col gap-2 mt-7">
        <div className="w-[23%]">
          <div className="lg:w-[190px] w-[120px] bg-white shadow-lg rounded-lg">
            <img
              src={`https://digitalmenu-ax0i.onrender.com/api/v1/${offer?.offer_image}`}
              alt=""
              className="p-4 rounded-lg"
            />
            <div className="flex justify-evenly">
              <h2 className=" font-bold lg:text-xl pb-4">
                {offer?.offer_name}
              </h2>
              <h3 className=" font-semibold lg:text-lg pb-4">{offer?.discount_value}%</h3>
            </div>
          </div>
        </div>

        {/* offer details table */}
        <div className="lg:w-[77%] w-full mr-6 bg-white rounded-lg  text-xs lg:text-base">
          <div className="py-5 ml-2">
            <h2 className="text-xl font-semibold">Offer Details</h2>
          </div>
          <table className="w-full text-left bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-[#FBA919] text-white">
              <tr>
                <th className="py-3 px-4">Offer Name</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Item</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100">
                <td className="py-3 px-4">{offer?.offer_name}</td>
                <td className="py-3 px-4">{offer?.start_date?.toLocaleString().slice(0, 10)}</td>
                <td className="py-3 px-4">{offer?.end_date?.toLocaleString().slice(0, 10)}</td>
                <td className="py-3 px-4">
                  {/* <ul className="list-disc list-inside"> */}
                  <ul className="list-disc">
                    {offer?.food_ids?.map((item) => (
                      <li key={item._id} className="w-44 py-1">{item.name}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>


      </div>

      {/* Modal for edit offer */}
      <DynamicModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        customStyle={modalCustomStyles}
        content={
          <div>
            <div className="bg-[#ffa901]">
              <h2 className="text-center text-white text-2xl py-4 font-bold">
                New Offer
              </h2>
            </div>
            <div>
              <form onSubmit={handleSubmit()}>
                <div className="flex">
                  <div className="w-[50%] ml-4">
                    <div className="mt-4">
                      <InputField
                        label="Offer Name"
                        name="name"
                        register={register}
                        error={errors.name}
                      />
                    </div>

                    <ImageUploadField
                      label="Offer Image"
                      name="image"
                      register={register}
                      error={errors.image}
                    />

                    <RadioField
                      label="Offer Type"
                      name="type"
                      options={["Percentage", "Amount"]}
                      register={register}
                      error={errors.type}
                    />

                    <InputField
                      label="Discount Amount"
                      name="amount"
                      register={register}
                      error={errors.amount}
                    />

                    <DateField
                      label="Offer Start"
                      name="startDate"
                      register={register}
                      error={errors.startDate}
                    />

                    <DateField
                      label="Offer End"
                      name="endDate"
                      register={register}
                      error={errors.endDate}
                    />

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
                  </div>
                  <div className="w-[50%]">
                    <h2 className="mt-5 font-bold text-lg">
                      Select Foods for Offer
                    </h2>
                    <div>{/* latter */}</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        }
      />
    </div>
  );
}
