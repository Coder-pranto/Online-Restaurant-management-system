/* eslint-disable react/prop-types */

// export default function DashboardCard({ cardInfo, percentage }) {
//   return (
//     <div className="bg-[#ECECEC] rounded-lg">
//       <div className="flex flex-col w-full rounded-lg">
//         <div className={`flex justify-between bg-[#231F20] ${percentage ? "rounded-t-lg" : "rounded-lg"} p-4`}>
//           {/* First portion of the card */}
//           <div className="w-[70%]">
//             <h1 className="text-3xl text-white font-bold">
//               {cardInfo.amount}
//             </h1>
//             <h2 className="text-gray-400 text-lg">
//               {cardInfo.name}
//             </h2>
//           </div>
//           {/* Second portion of the card */}
//           <div className="w-[25%] flex justify-end items-center ">
//             <img src={cardInfo.icon} alt="" className="" />
//           </div>
//         </div>
//         {/* Percentage from last month */}
//         {percentage && (
//           <div className="w-full">
//             <p className="bg-[#FBA919] text-[#231F20] text-sm p-2 rounded-b-lg">
//               {percentage}% from last month
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



export default function DashboardCard({ cardInfo, percentage }) {
  return (
    <div className="bg-[#ECECEC] rounded-lg w-full lg:w-auto mb-4 lg:mb-0">
      <div className="flex flex-col w-full rounded-lg">
        <div className={`flex justify-between bg-[#231F20] ${percentage ? "rounded-t-lg" : "rounded-lg"} p-4 lg:p-5`}>
          {/* First portion of the card */}
          <div className="lg:w-[70%] w-[60%]">
            <h1 className="text-lg lg:text-3xl text-white font-bold">
              {cardInfo.amount}
            </h1>
            <h2 className="text-sm lg:text-lg text-gray-400">
              {cardInfo.name}
            </h2>
          </div>
          {/* Second portion of the card */}
          <div className="w-[25%] flex justify-end items-center">
            <img src={cardInfo.icon} alt="" className="w-5 h-5 lg:w-auto lg:h-auto" />
          </div>
        </div>
        {/* Percentage from last month */}
        {percentage && (
          <div className="w-full">
            <p className="bg-[#FBA919] text-[#231F20] text-xs lg:text-sm p-2 rounded-b-lg">
              {percentage}% from last month
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


