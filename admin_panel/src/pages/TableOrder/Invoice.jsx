import React from 'react';
import { format } from 'date-fns';

const Invoice = React.forwardRef(
  ({ order, totalCost, serviceCharge, finalTotal, selectedTable, orderNumber, cashProvided }, ref) => {
    const discount = (totalCost + serviceCharge) * 0.0; // 0% discount
    const totalPayment = finalTotal - discount;
    const change = cashProvided ? cashProvided - totalPayment : 0; // Calculate change
    const totalQuantity = order?.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity

    return (
      <div ref={ref} className="p-4 bg-white shadow-md rounded-lg border border-gray-200 max-w-md mx-auto">
        {/* Company Header */}
        <div className="text-center mb-4">
          <img src="/c_logo.jpg" alt="Company Logo" className="w-16 h-16 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-gray-800">DESI CUISINE</h1>
          <p className="text-gray-500 text-sm">+123-456-7890 | info@desicuisine.com</p>
          <p className="text-gray-400 text-xs">123 Food Street, City, Country</p>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Invoice</h2>
            <p className="text-gray-600 text-sm">Order #: {orderNumber}</p>
            <p className="text-gray-600 text-sm">Table: {selectedTable}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Date: {format(new Date(), 'MMMM do yyyy')}</p>
            <p className="text-gray-600 text-xs">Time: {format(new Date(), 'HH:mm')}</p>
          </div>
        </div>

        {/* Order Table */}
        <table className="w-full text-left border-collapse mb-4 text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="py-2 px-2 font-semibold text-left">Item</th>
              <th className="py-2 px-2 font-semibold text-center">Qty</th>
              <th className="py-2 px-2 font-semibold text-right">Price</th>
              <th className="py-2 px-2 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.map((item) => (
              <tr key={item.orderId} className="border-b last:border-b-0">
                <td className="py-2 px-2">{item.name}</td>
                <td className="py-2 px-2 text-center">{item.quantity}</td>
                <td className="py-2 px-2 text-right">৳{item.price}</td>
                <td className="py-2 px-2 text-right">৳{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="border-t pt-2 mt-2 text-gray-700">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 text-sm">Subtotal:</p>
            <p className="font-semibold text-sm">৳{totalCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 text-sm">Service Charge:</p>
            <p className="font-semibold text-sm">৳{serviceCharge.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 text-sm">Discount (0%):</p>
            <p className="font-semibold text-sm">৳{discount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2 border-t pt-2">
            <p className="font-bold text-gray-800 text-sm">Total Payment:</p>
            <p className="font-bold text-gray-800 text-sm">৳{totalPayment.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mb-2 border-t pt-2">
            <p className="text-gray-600 text-sm">Total Quantity:</p>
            <p className="font-semibold text-sm">{totalQuantity}</p>
          </div>
          <div className="flex justify-between items-center mb-2 border-t pt-2">
            <p className="text-gray-600 text-sm">Cash Provided:</p>
            <p className="font-semibold text-sm">৳{cashProvided}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 text-sm">Change:</p>
            <p className="font-semibold text-sm">৳{change.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mt-4">
          <h3 className="text-xs font-bold text-gray-600 uppercase">Payment Terms:</h3>
          <p className="text-xs text-gray-500 mt-1">
            Payment must be made immediately. Thank you!
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 border-t border-gray-200 pt-2">
          <p className="font-semibold text-gray-800 text-sm">Thank you for your patronage!</p>
          <p className="text-gray-500 text-xs">We hope to see you again soon.</p>
          <p className="text-gray-400 text-xs mt-1">Software Solution by DESHIT-BD</p>
        </div>
      </div>
    );
  }
);

Invoice.displayName = 'Invoice';

export default Invoice;
