import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

export default function Modal({ children, title, isOpen, onClose }) {
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (!modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClickOutside}
      className="fixed w-full h-full z-10 inset-0 bg-secondary bg-gray-600 bg-opacity-50 p-4 md:p-8 flex justify-center items-center"
    >
      <div
        ref={modalRef}
        className="relative h-5/6 overflow-y-auto bg-secondary rounded-lg shadow dark:bg-gray-800 bg-white mx-auto w-full md:w-1/3 p-4"
      >
        <div className="flex justify-between">
          <h5 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h5>
          <FontAwesomeIcon
            icon={faXmark}
            size="sm"
            onClick={onClose}
            className=" text-gray-400 hover:text-gray-500 cursor-pointer transition-colors"
          />
        </div>
        <hr />

        <div className="dark:text-white mt-4">{children}</div>
      </div>
    </div>
  );
}
