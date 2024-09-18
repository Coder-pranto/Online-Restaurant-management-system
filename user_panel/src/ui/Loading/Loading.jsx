import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loading() {
  return (
    <div className="h-[calc(100vh-200px)] flex items-center justify-center">
      <FontAwesomeIcon icon={faCircleNotch} spin className="text-5xl" />
    </div>
  );
}
