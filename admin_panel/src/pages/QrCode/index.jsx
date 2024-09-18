import { useEffect, useState } from "react";
import Header from "../../components/Header";
import DynamicModal from "../../components/Modal";
import InputField from "../../components/Form/InputField";
import { useForm } from "react-hook-form";
import check from "../../assets/expenses/sav.png";
import close from "../../assets/expenses/cls.png";
import Cookies from "js-cookie";
import axios from "axios";

const authToken = Cookies.get("token");

const GenerateQRCodePage = () => {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [qrCodes, setQrCodes] = useState([]);
  const [tableNumbers, setTableNumbers] = useState([]);
  const [selectedQRCodes, setSelectedQRCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const modalCustomStyles = {
    content: {
      width: window.innerWidth < 700 ? "835px" : "550px", // Increased width
      height: "550px", // Increased height
      margin: "auto",
      border: "none",
      borderRadius: "4px",
      padding: "0px",
    },
  };


  const onSubmit = async (data) => {
    try {
      setIsLoading(true); // Show loading image

      const { NoOfTable, restaurantMenu, restaurantId } = data;
      const qrCodesData = [];
      const tableNumbersData = [];

      for (let i = 1; i <= NoOfTable; i++) {
        const QRData = {
          url: restaurantMenu,
          restaurantId,
        };

        const response = await axios.post(
          `https://digitalmenu-ax0i.onrender.com/api/v1/generateQrCode/${i}`,
          QRData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${authToken}`,
            },
          }
        );

        qrCodesData.push(response.data?.data?.qrCodeDataUrl);
        tableNumbersData.push(i);


      }

      // Save data to localStorage
      localStorage.setItem("qrCodes", JSON.stringify(qrCodesData));
      localStorage.setItem("tableNumbers", JSON.stringify(tableNumbersData));

      setQrCodes(qrCodesData);
      setTableNumbers(tableNumbersData);

      reset();
      closeModal();
      setIsLoading(false);
    } catch (error) {
      console.error("Error QR:", error);
    }
  };

  const downloadImage = (index) => {
    const link = document.createElement("a");
    link.href = qrCodes[index];
    link.download = `qr_code_table_no:${tableNumbers[index]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelectedImages = () => {
    selectedQRCodes.forEach((index) => {
      downloadImage(index);
    });
  };

  const downloadAllImages = () => {
    qrCodes.forEach((_, index) => {
      downloadImage(index);
    });
  };

  const handleCheckboxChange = (index) => {
    const selectedIndex = selectedQRCodes.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedQRCodes([...selectedQRCodes, index]);
    } else {
      const updatedSelectedQRCodes = [...selectedQRCodes];
      updatedSelectedQRCodes.splice(selectedIndex, 1);
      setSelectedQRCodes(updatedSelectedQRCodes);
    }
  };


  useEffect(() => {
    // // Retrieve data from localStorage
    // const storedQrCodes = localStorage.getItem("qrCodes");
    // const storedTableNumbers = localStorage.getItem("tableNumbers");

    // if (storedQrCodes && storedTableNumbers) {
    //   setQrCodes(JSON.parse(storedQrCodes));
    //   setTableNumbers(JSON.parse(storedTableNumbers));
    // }

    //........when u don't want to display the previous qrCode data.............
    localStorage.removeItem("qrCodes");
    localStorage.removeItem("tableNumbers");
    setQrCodes([]);
    setTableNumbers([]);
    //.......................
  }, []);

  return (
    <div>
      <Header headerTitle="Today's QR Code" />

      <div className="w-full flex flex-col lg:flex-row lg:gap-x-20 justify-center items-center mt-12 px-2">
        <button
          onClick={downloadAllImages}
          className="w-full sm:w-[220px] bg-gray-200 border-2 border-[#FFA901] p-2 flex justify-center text-center rounded-lg text-[#FFA901] font-bold mb-4 sm:mb-0 hover:bg-[#FFA901] hover:text-black transition-colors duration-200"
        >
          Download All
        </button>
        <button
          onClick={openModal}
          className="w-full sm:w-[220px] bg-gray-200 border-2 border-[#FFA901] p-2 flex justify-center text-center rounded-lg text-[#FFA901] font-bold mb-4 sm:mb-0 hover:bg-[#FFA901] hover:text-black transition-colors duration-200"
        >
          Generate New Qr code
        </button>
        <button
          onClick={downloadSelectedImages}
          className="w-full sm:w-[220px] bg-gray-200 border-2 border-[#FFA901] p-2 flex justify-center text-center rounded-lg text-[#FFA901] font-bold hover:bg-[#FFA901] hover:text-black transition-colors duration-200"
        >
          Download Selected
        </button>
      </div>

      <div>
        <div>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="relative bg-white rounded-lg overflow-hidden max-w-xl w-full">
                <div className="flex justify-between items-center px-6 py-4 bg-yellow-500">
                  <h2 className="text-white text-lg font-bold">QR Code Generator</h2>
                  <button onClick={closeModal} className="text-white hover:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputField label="Restaurant Menu URL" name="restaurantMenu" register={register} error={errors} />
                    <InputField label="Restaurant ID" name="restaurantId" register={register} error={errors} />
                    <InputField label="Number of Tables" name="NoOfTable" type="number" register={register} error={errors} />
                    <div className="flex justify-between space-x-4">
                      <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-yellow-600">Generate</button>
                      <button type="button" onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600">Close</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto p-5 overflow-x-auto">
            {qrCodes.length > 0 && tableNumbers.length > 0 && (
              <table className="border-2 border-[#FFA901] bg-white rounded w-full min-w-[600px] sm:min-w-full">
                <thead>
                  <tr>
                    <th className="border-2 border-[#FFA901] p-2 text-center">
                      QrCode
                    </th>
                    <th className="border-2 border-[#FFA901] p-2 text-center">
                      Table No
                    </th>
                    <th className="border-2 border-[#FFA901] p-2 text-center">
                      Download
                    </th>
                    <th className="border-2 border-[#FFA901] p-2 text-center">
                      Select
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {qrCodes.map((qrCode, index) => (
                    <tr key={index} className="text-sm md:text-base">
                      <td className="border-2 border-[#FFA901] p-2 text-center">
                        <img
                          className="mx-auto w-16 lg:w-28"
                          src={qrCode}
                          alt={`qr-code-table-${tableNumbers[index]}`}
                        />
                      </td>
                      <td className="border-2 border-[#FFA901] p-2 text-center">
                        {tableNumbers[index]}
                      </td>
                      <td className="border-2 border-[#FFA901] p-2 text-center">
                        <button
                          className="bg-[#FFA901] p-2 w-[70%] rounded-md text-black font-bold hover:bg-yellow-400 transition-colors duration-200"
                          onClick={() => downloadImage(index)}
                        >
                          Download
                        </button>
                      </td>
                      <td className="border-2 border-[#FFA901] p-2 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-[#FFA901] rounded focus:ring-0"
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {isLoading && (
          <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-800 bg-opacity-70 z-10">
            <img
              src="/loading.gif"
              alt="Loading..."
              className="w-16 h-16 md:w-24 md:h-24"
            />
            <p className="p-5 text-lg md:text-xl text-white mt-2 text-center">
              Please wait for a while
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default GenerateQRCodePage;
