import { useEffect } from 'react';

const PaymentDetails = ({ totalCost, finalTotal, handlePrint, orderNumber, onComplete }) => {
  useEffect(() => {
    onComplete(); // Mark payment as complete when this component is loaded
  }, [onComplete]);

  return (
    <div className="flex-1 p-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Order No: {orderNumber}</p>
        <p className="text-gray-600 mb-2">Subtotal: ৳{totalCost.toFixed(2)}</p>
        <p className="text-gray-700 text-xl font-semibold mb-2">Total: ৳{finalTotal.toFixed(2)}</p>
      </div>
      <div>
        <button
          onClick={handlePrint}
          className="w-full px-4 py-2 bg-[#8bb5be] text-slate-700 rounded-md tracking-widest transition-all duration-300 ease-in-out hover:bg-[#72a0ab] hover:text-white shadow-md hover:shadow-lg"
        >
          PRINT NOW
        </button>

      </div>
    </div>
  );
};

export default PaymentDetails;



