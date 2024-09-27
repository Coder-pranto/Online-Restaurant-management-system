// import { forwardRef } from 'react';
// import { format } from 'date-fns';

// const OrderDetails = forwardRef(({ orderDetails }, ref) => {
//   const calculateNetTotal = (totalPrice) => {
//     const vat = totalPrice * 0.05;
//     const netTotal = totalPrice + vat;
//     return { vat, netTotal };
//   };

//   return (
//     <div ref={ref} style={{ width: '48mm', fontSize: '10px' }} className="p-2 bg-white border border-gray-200 mx-auto">
//       {/* Company Header */}
//       <div className="text-center mb-2">
//         <img src="/ccc_logo.png" alt="Company Logo" className="w-18 h-14 mx-auto mb-1" />
//         <h1 className="text-lg font-semibold text-black mb-1">Chixxer</h1>
//         <p className="font-semibold text-black text-xs">+880-195-353-2794</p>
//         <p className="font-semibold text-black text-xs">www.chixxer.com</p>
//         <p className="font-semibold text-black text-[10px]">House-6, Haji Dil Mohammad Avenue Dhaka Uddyan,</p>
//         <p className="font-semibold text-black text-[10px]">Mohammadpur, Dhaka-1207</p>
//       </div>

//       {/* Invoice Info */}
//       <div className="mb-2 border-b pb-1">
//         <div>
//           <h2 className="text-sm font-semibold text-black">Order Details</h2>
//           <p className="font-semibold text-black text-xs">Order: {orderDetails?.orderNumber}</p>
//           <p className="font-semibold text-black text-xs">Table: {orderDetails?.tableNumber}</p>
//         </div>
//         <div>
//           <p className="font-semibold text-black text-xs">
//             Date: {format(new Date(orderDetails?.createdAt), 'MMM dd, yyyy')}
//           </p>
//           <p className="font-semibold text-black text-xs">
//             Time: {format(new Date(orderDetails?.createdAt), 'HH:mm')}
//           </p>
//         </div>
//       </div>

//       {/* Order Summary */}
//       <table className="w-full text-left mb-2 text-xs">
//         <tbody>
//           <tr>
//             <th className="py-1 font-semibold text-black">Status:</th>
//             <td className="py-1 text-right font-semibold text-black">{orderDetails?.status}</td>
//           </tr>
//           <tr>
//             <th className="py-1 font-semibold text-black">Payment:</th>
//             <td className="py-1 text-right font-semibold text-black">{orderDetails?.paymentMethod}</td>
//           </tr>
//           <tr>
//             <th className="py-1 font-semibold text-black">Payment Status:</th>
//             <td className="py-1 text-right font-semibold text-black">{orderDetails?.paymentStatus}</td>
//           </tr>
//           <tr>
//             <th className="py-1 font-semibold text-black">Total Food:</th>
//             <td className="py-1 text-right font-semibold text-black">{orderDetails?.totalNumberOfFood}</td>
//           </tr>
//           <tr>
//             <th className="py-1 font-semibold text-black">Total:</th>
//             <td className="py-1 text-right font-semibold text-black">৳{orderDetails?.totalPrice.toFixed(2)}</td>
//           </tr>
//           <tr>
//             <th className="py-1 font-semibold text-black">VAT (5%):</th>
//             <td className="py-1 text-right font-semibold text-black">৳{calculateNetTotal(orderDetails.totalPrice).vat.toFixed(2)}</td>
//           </tr>
//           <tr className="border-t border-gray-300">
//             <th className="py-1 font-semibold text-black">Net Total:</th>
//             <td className="py-1 text-right font-semibold text-black">৳{calculateNetTotal(orderDetails.totalPrice).netTotal.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Footer */}
//       <div className="text-center mt-4 border-t border-gray-200 pt-1">
//         <p className="font-semibold text-black text-[10px]">Thank you for your patronage!</p>
//         <p className="font-semibold text-black text-[10px]">We hope to see you again soon.</p>
//         <p className="font-semibold text-black text-[10px] mt-1">Software Solution by Tecklyne</p>
//         <p className="font-semibold text-black text-[9px] mt-1">01813320587</p>
//       </div>
//     </div>
//   );
// });


// OrderDetails.displayName = 'OrderDetails';
// export default OrderDetails;



import { forwardRef } from 'react';
import { format } from 'date-fns';

const OrderDetails = forwardRef(({ orderDetails }, ref) => {
  return (
    <div ref={ref} style={{ width: '48mm', fontSize: '10px' }} className="p-2 bg-white border border-gray-200 mx-auto">
      {/* Company Header */}
      <div className="text-center mb-2">
        <img src="/ccc_logo.png" alt="Company Logo" className="w-18 h-14 mx-auto mb-1" />
        <h1 className="text-lg font-semibold text-black mb-1">Chixxer</h1>
        <p className="font-semibold text-black text-xs">+880-195-353-2794</p>
        <p className="font-semibold text-black text-xs">www.chixxer.com</p>
        <p className="font-semibold text-black text-[10px]">House-6, Haji Dil Mohammad Avenue Dhaka Uddyan,</p>
        <p className="font-semibold text-black text-[10px]">Mohammadpur, Dhaka-1207</p>
      </div>

      {/* Invoice Info */}
      <div className="mb-2 border-b pb-1">
        <div>
          <h2 className="text-sm font-semibold text-black">Order Details</h2>
          <p className="font-semibold text-black text-xs">Order: {orderDetails?.orderNumber}</p>
          <p className="font-semibold text-black text-xs">Table: {orderDetails?.tableNumber}</p>
        </div>
        <div>
          <p className="font-semibold text-black text-xs">
            Date: {format(new Date(orderDetails?.createdAt), 'MMM dd, yyyy')}
          </p>
          <p className="font-semibold text-black text-xs">
            Time: {format(new Date(orderDetails?.createdAt), 'HH:mm')}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <table className="w-full text-left mb-2 text-xs">
        <tbody>
          <tr>
            <th className="py-1 font-semibold text-black">Status:</th>
            <td className="py-1 text-right font-semibold text-black">{orderDetails?.status}</td>
          </tr>
          <tr>
            <th className="py-1 font-semibold text-black">Payment:</th>
            <td className="py-1 text-right font-semibold text-black">{orderDetails?.paymentMethod}</td>
          </tr>
          <tr>
            <th className="py-1 font-semibold text-black">Payment Status:</th>
            <td className="py-1 text-right font-semibold text-black">{orderDetails?.paymentStatus}</td>
          </tr>
          <tr>
            <th className="py-1 font-semibold text-black">Total Food:</th>
            <td className="py-1 text-right font-semibold text-black">{orderDetails?.totalNumberOfFood}</td>
          </tr>
          <tr>
            <th className="py-1 font-semibold text-black">Total:</th>
            <td className="py-1 text-right font-semibold text-black">৳{orderDetails?.totalPrice.toFixed(2)}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <th className="py-1 font-semibold text-black">Net Total:</th>
            <td className="py-1 text-right font-semibold text-black">৳{orderDetails?.totalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="text-center mt-4 border-t border-gray-200 pt-1">
         <p className="font-semibold text-black text-[10px]">Thank you for your patronage!</p>
        <p className="font-semibold text-black text-[10px]">We hope to see you again soon.</p>
        <p className="font-semibold text-black text-[10px] mt-1">Software Solution by Tecklyne</p>
        <p className="font-semibold text-black text-[9px] mt-1">01813320587</p>
       </div>
    </div>
  );
});

OrderDetails.displayName = 'OrderDetails';
export default OrderDetails;
