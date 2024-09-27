import { useRef, useState } from 'react';
import Invoice from './Invoice';
import PaymentDetails from './PaymentDetails';
import { useReactToPrint } from 'react-to-print';

const Payment = ({ order, totalCost, serviceCharge, finalTotal, selectedTable, orderNumber }) => {
  const invoiceRef = useRef();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Table_${selectedTable}_Invoice`,
  });

  const handlePaymentCompletion = () => {
    setIsPaymentComplete(true);

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
        />
      </div>
    </div>
  );
};

export default Payment;


