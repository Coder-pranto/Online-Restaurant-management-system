import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SideModal({
  children,
  title,
  isOpen,
  onClose,
  onDelete,
}) {
  return (
    <div
      className={`fixed top-0 w-5/6 h-full overflow-y-auto bg-secondary rounded-lg shadow dark:bg-gray-800 bg-white md:w-1/3 p-4 z-50 transform transition-all duration-500 ${
        isOpen ? "right-0" : "-right-[100%]"
      }`}
    >
      <div className="flex justify-between">
        <h5 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h5>
        <div className="flex items-center gap-4">
          <FontAwesomeIcon
            icon={faTrashCan}
            size="sm"
            className="text-red-400"
            onClick={onDelete}
          />
          <FontAwesomeIcon
            icon={faXmark}
            size="sm"
            onClick={onClose}
            className=" text-gray-400 hover:text-gray-500 cursor-pointer transition-colors"
          />
        </div>
      </div>
      <hr />

      <div className="dark:text-white mt-4">{children}</div>
    </div>
  );
}
