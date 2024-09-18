import successPhoto from "../../assets/success.png";
import Button from "../../ui/Buttons/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";

export default function PaymentSuccess() {
  const { restaurantId, tableNumber } = getCookie("resIdAndTableNo");

  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <section className="h-[75vh] flex flex-col justify-center items-center gap-2">
      <div>
        <h4 className="text-center font-bold text-2xl text-[#FFA901] mb-5 ">
          Congratulations!
        </h4>
        <p className="text-center font-bold text-sm">Your order is complete</p>
      </div>
      <div className="flex justify-center items-center">
        <img className="w-56" src={successPhoto} alt="success" />
      </div>
      <div>
        <h4 className="text-center font-bold text-4xl text-[#FFA901] mb-5 ">
          {/* {state?.newOrder?.averagePreparationTime + 10} mins */}
          {state?.newOrder?.averagePreparationTime} mins
          {/* added 10 mins extra with the average time of preperation */}
        </h4>
        <p className="text-center font-bold text-sm">Estimated Serving Time</p>
      </div>

      {/* Back to home button */}
      <Button
        variant="primary"
        size="lg"
        text="Back to home"
        onClick={() =>
          navigate(`/?restaurantid=${restaurantId}&table=${tableNumber}`)
        }
      />

      <footer className="fixed bottom-0 bg-primary w-[100vw] text-center text-xs text-white py-1 font-semibold">
        <span>
          Copyright © {new Date(Date.now()).getFullYear()}{" "}
          <a href="https://www.deshit-bd.com/" target="_blank">
            DeshIT-BD
          </a>
          . All rights reserved.
        </span>
        <br />
        Corporate cell no. - 01813320587
      </footer>
    </section>
  );
}
