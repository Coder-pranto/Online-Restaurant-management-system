import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

export default function Root() {
  return (
    <div className="relative mx-auto max-w-[600px] font-inter overflow-x-hidden">
      <div>
        <Header />
      </div>
      <div className="p-5">
        <Outlet />
      </div>
    </div>
  );
}
