export default function OrderSummaryDetails({ title, price, className }) {
  return (
    <div className="flex flex-col gap-2.5 my-2">
      <div className="flex justify-between text-xs">
        <span className={className}>{title}</span>
        <span className={className}>{price} TK</span>
      </div>
    </div>
  );
}
