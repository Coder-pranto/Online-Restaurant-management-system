import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Loader() {
  return (
   <div>
     <FontAwesomeIcon
      icon={faCircleNotch}
      spin
      className="fixed top-[60%] left-[60%] text-5xl text-[#FFA901]"
    />
   </div>
  );
}
