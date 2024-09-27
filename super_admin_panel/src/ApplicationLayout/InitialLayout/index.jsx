import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import IdleTimer from "../../components/IdleTimer/IdleTimer";

const InitialLayout = () => {
    return (
        <div>
            <Header />
            <div className='w-full flex'>
                <Sidebar />
                <IdleTimer/>
                <Outlet />
            </div>
        </div>
    );
}

export default InitialLayout;
