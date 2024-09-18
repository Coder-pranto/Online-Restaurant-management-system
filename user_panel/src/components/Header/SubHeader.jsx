import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faGrip, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ViewContext } from "../../context/view";

export default function SubHeader({ text, deleteBtn, onClick }) {
  const { setView } = useContext(ViewContext);
  return (
    <section className="flex items-center justify-between mb-10">
      <h1 className="text-2xl font-bold">{text}</h1>
      <div className="flex border-2">
        <FontAwesomeIcon
          icon={faGripVertical}
          className="py-1 px-2 hover:bg-primary transition-colors duration-500"
          onClick={() => setView("list")}
        />
        <div className="w-[1px] h-6 bg-gray-300" />
        <FontAwesomeIcon
          icon={faGrip}
          className="py-1 px-2 hover:bg-primary transition-colors duration-500"
          onClick={() => setView("grid")}
        />
      </div>
      {deleteBtn && (
        <button type="button" onClick={onClick}>
          <FontAwesomeIcon
            icon={faTrashCan}
            className="text-[#FFA901] text-xl"
          />
        </button>
      )}
    </section>
  );
}
