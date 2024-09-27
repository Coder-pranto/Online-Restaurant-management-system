import React from 'react';
import { format } from 'date-fns';

const Invoice = React.forwardRef(
  ({ order, totalCost, serviceCharge, finalTotal, selectedTable, orderNumber }, ref) => {
    const discount = (totalCost + serviceCharge) * 0.0; // 0% discount
    const totalPayment = finalTotal - discount;
    const totalQuantity = order?.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity

    return (
      <div ref={ref} className="p-2 bg-white shadow-md rounded-lg border border-gray-200 max-w-md mx-auto">
        {/* Company Header */}
        <div className="text-center mb-2">
          <img src="/ccc_logo.png" alt="Company Logo" className="w-18 h-14 mx-auto mb-1" />
          <h1 className="text-md font-semibold text-black mb-1">Chixxer</h1>
          <p className="font-semibold text-black text-xs">+880-195-353-2794 | www.chixxer.com</p>
          <p className="font-semibold text-black text-[10px]">House-6, Haji Dil Mohammad Avenue Dhaka Uddyan,</p>
        <p className="font-semibold text-black text-[10px]">Mohammadpur, Dhaka-1207</p>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between items-center mb-2 border-b pb-1">
          <div>
            <h2 className="text-sm font-semibold text-black">Invoice</h2>
            <p className="font-semibold text-black text-xs">Order #: {orderNumber}</p>
            <p className="font-semibold text-black text-xs">Table: {selectedTable}</p>
          </div>
          <div>
            <p className="font-semibold text-black text-xs">Date: {format(new Date(), 'MMMM do yyyy')}</p>
            <p className="font-semibold text-black text-xs">Time: {format(new Date(), 'HH:mm')}</p>
          </div>
        </div>

        {/* Order Table */}
        <table className="w-full text-left border-collapse mb-2 text-xs">
          <thead>
            <tr className="bg-gray-100 text-black">
              <th className="py-1 px-1 font-semibold text-left">Item</th>
              <th className="py-1 px-1 font-semibold text-center">Qty</th>
              <th className="py-1 px-1 font-semibold text-right">Price</th>
              <th className="py-1 px-1 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.map((item, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="py-1 px-1 font-semibold text-black">{item.name}</td>
                <td className="py-1 px-1 text-center font-semibold text-black">{item.quantity}</td>
                <td className="py-1 px-1 text-right font-semibold text-black">৳{item.price}</td>
                <td className="py-1 px-1 text-right font-semibold text-black">৳{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="border-t pt-1 mt-1 text-black">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-black text-xs">Subtotal:</p>
            <p className="font-semibold text-black text-xs">৳{totalCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-black text-xs">Service Charge:</p>
            <p className="font-semibold text-black text-xs">৳{serviceCharge.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-black text-xs">Discount (0%):</p>
            <p className="font-semibold text-black text-xs">৳{0}</p>
          </div>
          <div className="flex justify-between items-center mb-1 border-t pt-1">
            <p className="font-semibold text-black text-xs">Total Payment:</p>
            <p className="font-semibold text-black text-xs">৳{totalPayment.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-1 border-t pt-1">
            <p className="font-semibold text-black text-xs">Total Quantity:</p>
            <p className="font-semibold text-black text-xs">{totalQuantity}</p>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mt-2">
          <h3 className="text-xs font-semibold text-black uppercase">Payment Terms:</h3>
          <p className="text-xs font-semibold text-black mt-1">Payment must be made immediately. Thank you!</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-2 border-t border-gray-200 pt-1">
          <p className="font-semibold text-black text-xs">Thank you for your patronage!</p>
          <p className="font-semibold text-black text-xs">We hope to see you again soon.</p>
          <p className="font-semibold text-black text-xs mt-1">Software Solution by Tecklyne</p>
          <p className="font-semibold text-black text-xs mt-1">01813320587</p>
        </div>
      </div>
    );
  }
);

Invoice.displayName = 'Invoice';

export default Invoice;






