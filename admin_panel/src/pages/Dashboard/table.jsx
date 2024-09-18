/* eslint-disable react/jsx-no-undef */

<>
<div className="w-full lg:w-[96%] bg-white rounded-lg shadow-lg mx-auto lg:mx-6 mt-4 mb-4 text-xs lg:text-base">
    {/* Section with Filter Order text and dropdown menu */}
    <div className=" flex justify-between items-center">
      <div>
        <h1 className="font-bold text-sm lg:text-xl ml-8 mt-4 ">
          Food Order
        </h1>
      </div>
    </div>

    <table className="w-full text-center mt-8 ">
      <thead>
        <tr>
          <th>Order No</th>
          <th>Table No</th>
          <th>Food Item</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody className="">
        {loading ? (
          <tr>
            <td colSpan="4">
              <Loader /> {/* Render the Loader component here */}
            </td>
          </tr>
        ) : (
          filteredOrders
            .slice()
            .reverse()
            .map((row, index) => (
              <tr
                className="border-collapse border-l-0 border-r-0 border border-gray-300 h-[80px]"
                key={row._id}
              >
                <td>{row?.orderNumber || index}</td>
                <td>{row?.tableNumber}</td>
                <td className="mt-1">
                  {row.items?.map((item) => item.foodId?.name)}
                </td>
                <td className="btn px-2 lg:px-0">
                  <button
                    className={`${row.status === "pending"
                        ? "btn1"
                        : row.status === "approved"
                          ? "btn3"
                          : "btn2"} hover:bg-gray-400`}
                  >
                    {row.status}
                  </button>
                </td>
              </tr>
            ))
        )}
      </tbody>
    </table>
  </div>
  
  
  
  </>