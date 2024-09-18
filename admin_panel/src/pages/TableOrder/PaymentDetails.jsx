import { useEffect } from 'react';

const PaymentDetails = ({ totalCost, finalTotal, handlePrint, orderNumber, cashProvided, onCashInputChange, onComplete }) => {
  const handleCashInputChange = (event) => {
    onCashInputChange(event.target.value);
  };

  useEffect(() => {
    if (cashProvided) {
      onComplete(); // Mark payment as complete if cash is provided
    }
  }, [cashProvided, onComplete]);

  return (
    <div className="flex-1 p-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Order No: {orderNumber}</p>
        <p className="text-gray-600 mb-2">Subtotal: ৳{totalCost.toFixed(2)}</p>
        <p className="text-gray-700 text-xl font-semibold mb-2">Total: ৳{finalTotal.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Enter Cash Amount</h3>
        <input
          type="number"
          value={cashProvided}
          onChange={handleCashInputChange}
          className="w-full p-2 border rounded-md"
          placeholder="Enter cash amount"
        />
      </div>
      <div>
        <button onClick={handlePrint} disabled={!cashProvided} className="w-full px-4 py-2 bg-[#8bb5be] text-slate-700 rounded-md tracking-widest">PRINT NOW</button>
      </div>
    </div>
  );
};

export default PaymentDetails;
