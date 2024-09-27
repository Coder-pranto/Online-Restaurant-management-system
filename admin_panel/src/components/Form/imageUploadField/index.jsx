
//old one
// export default function ImageUploadField({ label, name, register, error }) {
//   return (
//     <div className="w-full mb-3">
//       <label className="block font-bold my-2">
//         {label} <span className="text-red-500">*</span>
//       </label>
//       <input
//         {...register(name)}
//         type="file"
//         className="w-full border-[1px] border-[#aaa] p-2 rounded-lg bg-[#FFF7E9]"
//       />
//       <p className="text-red-500 text-sm">{error?.message?.split(",")[0]}</p>
//     </div>
//   );
// }

export default function ImageUploadField({ label, name, register, error, onChange }) {
  return (
    <div className="w-full mb-3">
      <label className="block font-bold my-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        {...register(name)}
        type="file"
        className="w-full border-[1px] border-[#aaa] p-2 rounded-lg bg-[#FFF7E9]"
        onChange={onChange} 
      />
      <p className="text-red-500 text-sm">{error?.message?.split(",")[0]}</p>
    </div>
  );
}

