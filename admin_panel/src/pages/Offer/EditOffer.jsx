/* eslint-disable react/prop-types */
import { useState } from "react";
import DynamicModal from "../../components/Modal";
import ImageUploadField from "../../components/Form/imageUploadField";
import RadioField from "../../components/Form/RadioField";
import InputField from "../../components/Form/InputField";
import DateField from "../../components/Form/DateField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";

export default function EditOffer({
  isModalOpen,
  closeModal,
  modalCustomStyles,
  foodGroup,
  register,
  handleSubmit,
  reset,
  errors,
  offer,
  authToken,
  fetchData,
}) {


  const [selectedFoods, setSelectedFoods] = useState(
    new Array(foodGroup.length).fill([])
  );
  const [loading, setLoading] = useState(false);

  console.log(selectedFoods[0]);

  const handleSelectedFoodsChange = (index, value) => {
    const newSelectedFoods = [...selectedFoods];
    newSelectedFoods[index] = value;
    setSelectedFoods(newSelectedFoods);
  };

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("offer_name", data.name);
      formData.append("type", data.type);
      formData.append("value", parseInt(data.amount));
      formData.append("start_date", new Date(data.startDate).toISOString());
      formData.append("end_date", new Date(data.endDate).toISOString());
      formData.append("offer_image", data.image[0]);

      const foodIds = selectedFoods.flatMap((group) =>
        group?.map((food) => food._id)
      );
      formData.set("food_ids", JSON.stringify(foodIds));

      const response = await axios.patch(
        `https://digitalmenu-ax0i.onrender.com/api/v1/offer/${offer?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${authToken}`,
          },
        }
      );
      //   console.log("Offer created:", response.data);
      fetchData();
      reset();
      setSelectedFoods(new Array(foodGroup.length).fill([]));
      response.status === 200 && setLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  return (
    <DynamicModal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      customStyle={modalCustomStyles}
      content={
        <div className="text-xs lg:text-base">
          <div className="bg-[#ffa901]">
            <h2 className="text-center text-white text-lg lg:text-2xl py-4 font-bold">
              Edit Offer
            </h2>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="w-full lg:w-[50%] ml-4">
                  <div className="mt-4 w-4/5 mx-auto lg:w-full">
                    <InputField
                      label="Offer Name"
                      name="name"
                      defaultValue={offer.offer_name}
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
                      defaultChecked={offer.discount_type}
                      options={["percentage", "amount"]}
                      register={register}
                      error={errors.type}
                    />
                  </div>
                  <div className="mt-4 w-4/5 mx-auto lg:w-full">
                    <InputField
                      label="Discount Amount"
                      name="amount"
                      defaultValue={offer.discount_value}
                      register={register}
                      error={errors.amount}
                    />
                  </div>
                  <div className="mt-4 w-4/5 mx-auto lg:w-full">
                    <DateField
                      label="Offer Start"
                      name="startDate"
                      defaultValue={new Date(offer.start_date)
                        .toISOString()
                        .substring(0, 10)}
                      register={register}
                      error={errors.startDate}
                    />
                  </div>
                  <div className="mt-4 w-4/5 mx-auto lg:w-full">
                    <DateField
                      label="Offer End"
                      name="endDate"
                      defaultValue={new Date(offer.end_date)
                        .toISOString()
                        .substring(0, 10)}
                      register={register}
                      error={errors.endDate}
                    />
                  </div>

                  {window.innerWidth > 700 && (
                    <div className="lg:w-[87%] md:w-[78%] w-[74%] mx-auto mt-5 mb-3 flex justify-between">
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
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Close
                      </button>
                    </div>
                  )}
                </div>
                <div className="w-full lg:w-[45%]">
                  <h2 className="mt-5 font-bold text-sm lg:text-lg text-center lg:text-start mb-4 lg:mb-0">
                    Select Foods for Offer
                  </h2>
                  <div>
                    {foodGroup.map((categoryGroup, index) => {
                      const categoryName = Object.keys(categoryGroup)[0];
                      const foods = categoryGroup[categoryName];
                      return (
                        <div key={index} className="w-3/4 mx-auto lg:w-full">
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
                  </div>
                </div>
                {window.innerWidth <= 700 && (
                  <div className="lg:w-[87%] md:w-[78%] w-[74%] mx-auto mt-5 mb-3 flex justify-between">
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
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                      Close
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      }
    />
  );
}
