/* eslint-disable react/prop-types */
// import { useState } from "react";
// import filterImg1 from "../../../src/assets/filtericon/filter1.png";
// import placeholderLogo from "../../../src/assets/logo/placeholderLogo.jpg";
// // import placeholderLogo from "../../../src/assets/logo/placeholderLogo1.png";
// import "./index.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import { IoSearchOutline } from "react-icons/io5";
// import Cookies from 'js-cookie';

// export default function Header({
//   headerTitle,
//   secondaryTitle,
//   isSearch,
//   isShowFilter,
//   setFilteredOrders,
//   handleSearchChange,
//   searchQuery,
//   data,
// }) {
//   const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false);
//   const RestaurantName =  Cookies.get("restaurantName")

//   const filterItems = [
//     "Today",
//     "Yesterday",
//     "This week",
//     "This month",
//     "This year",
//   ];

//   const handleDateFilter = (item) => {
//     const toDaysDate = new Date();
//     setIsFilterOptionOpen(false);
//     let filteredData = [...data];
//     // console.log("All data : ", filteredData)

//     if (item === "Today") {
//       filteredData = data.filter((data) => {
//         const boughtDate = new Date(data.createdAt.split("T")[0]);
//         return boughtDate.toDateString() === toDaysDate.toDateString();
//       });
//     } else if (item === "Yesterday") {
//       toDaysDate.setDate(toDaysDate.getDate() - 1);
//       filteredData = data.filter((data) => {
//         const boughtDate = new Date(data.createdAt.split("T")[0]);
//         return boughtDate.toDateString() === toDaysDate.toDateString();
//       });
//     } else if (item === "This week") {
//       const startOfWeek = new Date();
//       startOfWeek.setDate(toDaysDate.getDate() - toDaysDate.getDay()); // Move to first day of the week
//       const endOfWeek = new Date();
//       endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to last day of the week
//       filteredData = data.filter((data) => {
//         const boughtDate = new Date(data.createdAt.split("T")[0]);
//         return boughtDate >= startOfWeek && boughtDate <= endOfWeek;
//       });
//     } else if (item === "This month") {
//       const startOfMonth = new Date(
//         toDaysDate.getFullYear(),
//         toDaysDate.getMonth(),
//         1
//       );
//       const endOfMonth = new Date(
//         toDaysDate.getFullYear(),
//         toDaysDate.getMonth() + 1,
//         0
//       );
//       filteredData = data.filter((data) => {
//         const boughtDate = new Date(data.createdAt.split("T")[0]);
//         return boughtDate >= startOfMonth && boughtDate <= endOfMonth;
//       });
//     } else if (item === "This year") {
//       const startOfYear = new Date(toDaysDate.getFullYear(), 0, 1);
//       const endOfYear = new Date(toDaysDate.getFullYear(), 11, 31);
//       filteredData = data.filter((data) => {
//         const boughtDate = new Date(data.createdAt.split("T")[0]);
//         return boughtDate >= startOfYear && boughtDate <= endOfYear;
//       });
//     }

//     // console.log("after filtering : ",filteredData)
//     setFilteredOrders(filteredData);
//   };

//   return (
//     <div className="flex items-center justify-around lg:justify-between">

//       <div className="flex flex-col gap-y-1 ml-3">
//         <h2 className="text-sm md:text-2xl lg:mt-8 mt-6 ml-8 lg:ml-6 font-bold">
//           {headerTitle}
//         </h2>
//         {secondaryTitle && <h4 className="text-gray-500 text-sm ml-8 lg:ml-6"> Sales Summary</h4>}
//       </div>


//       {isSearch && (
//         <div className="flex gap-5 mt-4 md:px-3 items-center relative">
//           <div className="bg-white p-2 rounded-2xl flex items-center">
//             <IoSearchOutline className="text-gray-500" />
//             <input
//               type="text"
//               className="text-gray-800 text-sm bg-transparent outline-none placeholder-gray-500 flex-grow ml-2"
//               placeholder="Tap here to search"
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             <button
//               className="text-blue-500 text-sm ml-2 focus:outline-none"
//               // onClick={handleSearch}
//             >
//               search
//             </button>
//           </div>
//         </div>
//       )}

//       <div>
//         <div className="flex gap-5 mt-4 md:px-3 text-xl items-center relative">

//           <div>
//             {isShowFilter === true && (
//               <img
//                 src={filterImg1}
//                 alt="filter"
//                 title="filter"
//                 className="w-4 md:w-5 lg:w-6 cursor-pointer lg:mr-3"
//                 onClick={() => setIsFilterOptionOpen(!isFilterOptionOpen)}
//               />
//             )}

//             {isFilterOptionOpen && (
//               <div className="bg-white absolute lg:right-56 mt-4 z-10 border-2 rounded-lg">
//                 <ul className="w-[150px] p-2 text-xs lg:text-sm font bold text-center font-bold">
//                   {filterItems.map((item, index) => (
//                     <li
//                       key={index}
//                       className={`py-2 hover:text-[#FFA901] cursor-pointer ${index !== filterItems.length - 1
//                           ? "border-b-[1px] border-[#aaa]"
//                           : ""
//                         }`}
//                       onClick={() => handleDateFilter(item)}
//                     >
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Overlay for close filter card */}
//             {isFilterOptionOpen && (
//               <div
//                 className="fixed inset-0 z-0"
//                 onClick={() => setIsFilterOptionOpen(false)}
//               ></div>
//             )}
//           </div>

//           <div className="">
//             <img
//               src={placeholderLogo}
//               alt="logo"
//               className="w-6 md:w-7 lg:w-8 object-cover rounded-full"
//             />
//           </div>

//           <div>
//             <h2 className="text-[#446FB6] lg:mr-4 text-sm lg:text-lg">Hello, <span>{RestaurantName}</span></h2>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }



/* eslint-disable react/prop-types */
import { useState } from "react";
import filterImg1 from "../../../src/assets/filtericon/filter1.png";
// import placeholderLogo from "../../../src/assets/logo/placeholderLogo1.png";
import "./index.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { IoSearchOutline } from "react-icons/io5";
import Cookies from 'js-cookie';
import { BASE_URL } from "../../services/BaseURL";

export default function Header({
  headerTitle,
  secondaryTitle,
  isSearch,
  isShowFilter,
  setFilteredOrders,
  handleSearchChange,
  searchQuery,
  data,
}) {
  const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false);
  const RestaurantName =  Cookies.get("restaurantName");
  const RestaurantLogo = Cookies.get("restaurantLogo");
  console.log(`${BASE_URL}/images${RestaurantLogo}`);

  

  const filterItems = [
    "Today",
    "Yesterday",
    "This week",
    "This month",
    "This year",
  ];

  const handleDateFilter = (item) => {
    const toDaysDate = new Date();
    setIsFilterOptionOpen(false);
    let filteredData = [...data];
    // console.log("All data : ", filteredData)

    if (item === "Today") {
      filteredData = data.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate.toDateString() === toDaysDate.toDateString();
      });
    } else if (item === "Yesterday") {
      toDaysDate.setDate(toDaysDate.getDate() - 1);
      filteredData = data.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate.toDateString() === toDaysDate.toDateString();
      });
    } else if (item === "This week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(toDaysDate.getDate() - toDaysDate.getDay()); // Move to first day of the week
      const endOfWeek = new Date();
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Move to last day of the week
      filteredData = data.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate >= startOfWeek && boughtDate <= endOfWeek;
      });
    } else if (item === "This month") {
      const startOfMonth = new Date(
        toDaysDate.getFullYear(),
        toDaysDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        toDaysDate.getFullYear(),
        toDaysDate.getMonth() + 1,
        0
      );
      filteredData = data.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate >= startOfMonth && boughtDate <= endOfMonth;
      });
    } else if (item === "This year") {
      const startOfYear = new Date(toDaysDate.getFullYear(), 0, 1);
      const endOfYear = new Date(toDaysDate.getFullYear(), 11, 31);
      filteredData = data.filter((data) => {
        const boughtDate = new Date(data.createdAt.split("T")[0]);
        return boughtDate >= startOfYear && boughtDate <= endOfYear;
      });
    }

    // console.log("after filtering : ",filteredData)
    setFilteredOrders(filteredData);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-around lg:justify-between px-4 py-4 lg:py-0 mt-8">
      <div className="flex flex-col gap-y-1 ml-3">
        <h2 className="text-base md:text-2xl font-bold">
          {headerTitle}
        </h2>
        {secondaryTitle && <h4 className="text-gray-500 text-sm"> Sales Summary</h4>}
      </div>

      {isSearch && (
        <div className="flex gap-2 lg:gap-5 mt-4 lg:mt-0 items-center w-full lg:w-auto">
          <div className="bg-white p-2 rounded-2xl flex items-center w-[90%] lg:w-auto mx-auto">
            <IoSearchOutline className="text-gray-500" />
            <input
              type="text"
              className="text-gray-800 text-sm bg-transparent outline-none placeholder-gray-500 flex-grow ml-2"
              placeholder="Tap here to search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="text-blue-500 text-sm ml-2 focus:outline-none"
              // onClick={handleSearch}
            >
              search
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 lg:gap-5 mt-4 lg:mt-0 items-center relative">
        <div>
          {isShowFilter && (
            <img
              src={filterImg1}
              alt="filter"
              title="filter"
              className="w-4 md:w-5 lg:w-6 cursor-pointer lg:mr-3"
              onClick={() => setIsFilterOptionOpen(!isFilterOptionOpen)}
            />
          )}
          {isFilterOptionOpen && (
            <div className="bg-white absolute lg:right-0 mt-4 z-10 border-2 rounded-lg">
              <ul className="w-[150px] p-2 text-xs lg:text-sm font bold text-center font-bold">
                {filterItems.map((item, index) => (
                  <li
                    key={index}
                    className={`py-2 hover:text-[#FFA901] cursor-pointer ${index !== filterItems.length - 1 ? "border-b-[1px] border-[#aaa]" : ""
                      }`}
                    onClick={() => handleDateFilter(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Overlay for close filter card */}
          {isFilterOptionOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsFilterOptionOpen(false)}
            ></div>
          )}
        </div>

        <div>
          <img
            src={`${BASE_URL}/images${RestaurantLogo}`}
            alt="logo"
            className="w-6 md:w-7 lg:w-14 object-cover rounded-full border-2 border-orange-500"
          />
        </div>

        <div>
          <h2 className="text-[#446FB6] lg:mr-4 text-sm lg:text-lg">
            Hello, <span>{RestaurantName}</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
