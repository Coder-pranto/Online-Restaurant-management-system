import { useRef, useState } from 'react';
import Invoice from './Invoice';
import PaymentDetails from './PaymentDetails';
import { useReactToPrint } from 'react-to-print';

const Payment = ({ order, totalCost, serviceCharge, finalTotal, selectedTable, orderNumber }) => {
  const invoiceRef = useRef();
  const [cashProvided, setCashProvided] = useState('');
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Table_${selectedTable}_Invoice`, // Set a fixed file name for the PDF
  });


  const handleCashInputChange = (value) => {
    setCashProvided(value);
    setIsPaymentComplete(false); // Ensure the payment isn't marked as complete until confirmed
  };

  const handlePaymentCompletion = () => {
    setIsPaymentComplete(true);
    console.log(order);

    const storedTablesData = localStorage.getItem('tablesData');
    
    if (storedTablesData) {

      const { tables, createdAt } = JSON.parse(storedTablesData);
  
      const updatedTables = tables.map((table) =>
        table.id === selectedTable ? { ...table, hasFoodAllocated: true } : table
      );
  
      localStorage.setItem(
        'tablesData',
        JSON.stringify({ tables: updatedTables, createdAt })
      );
    } else {
      console.error('No tables data found in localStorage.');
    }
  };
  

  return (
    <div className="flex flex-col gap-y-2">
      {/* Payment Details */}
      <PaymentDetails
        totalCost={totalCost}
        finalTotal={finalTotal}
        orderNumber={orderNumber}
        cashProvided={cashProvided}
        onCashInputChange={handleCashInputChange}
        onComplete={handlePaymentCompletion}
        handlePrint={handlePrint}
      />

      {/* Invoice */}
      <div className="mb-6">
        <Invoice
          ref={invoiceRef}
          order={order}
          totalCost={totalCost}
          serviceCharge={serviceCharge}
          finalTotal={finalTotal}
          selectedTable={selectedTable}
          orderNumber={orderNumber}
          cashProvided={cashProvided} // Pass cash provided to Invoice
        />
      </div>
    </div>
  );
};

export default Payment;
