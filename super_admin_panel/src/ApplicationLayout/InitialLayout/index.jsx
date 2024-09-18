import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

const InitialLayout = () => {
    return (
        <div>
            <Header />
            <div className='w-full flex'>
                <Sidebar />
                <Outlet />
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default InitialLayout;
