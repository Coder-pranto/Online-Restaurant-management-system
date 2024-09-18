import { useEffect, useState } from "react";
import OrderSummaryDetails from "./OrderSummaryDetails";

export default function OrderSummary({
  subTotal,
  VAT,
  serviceCharge,
  discount,
}) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    /**** <- This is for future use when Vat, serviceCharge and discout will be added -> ****/

    // const totalBill = subTotal + VAT + serviceCharge;
    // const withOutDis = totalBill - discount;
    // setTotal(withOutDis.toFixed(2));
    setTotal(subTotal);
  }, []);

  return (
    <div>
      <OrderSummaryDetails title={"Subtotal"} price={subTotal} />

      {/* <OrderSummaryDetails title={'VAT/TAX'} price={VAT} />
      <OrderSummaryDetails title={'Service Charge'} price={serviceCharge} />
      <OrderSummaryDetails title={'Discount 10%'} price={discount} /> */}

      <div className="border border-white dark:border-gray-400 my-3" />

      <OrderSummaryDetails
        title={"Total"}
        price={total}
        className={"font-bold"}
      />
    </div>
  );
}
