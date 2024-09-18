export default function Div({ title, children, className }) {
  return (
    <div className={className}>
      <h2 className="text-sm dark:text-white font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}