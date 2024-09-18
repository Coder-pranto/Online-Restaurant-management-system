import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";

const Sidebar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const menuItems = [
        {
            icon: "fluent-mdl2:b-i-dashboard",
            name: 'Home',
            path: '/home',
        },
        {
            icon: "fluent-mdl2:account-management",
            name: 'Manage Admin ',
            path: '/manage-admin',
        }
    ];

    return (
        <div className={` h-[100vh] bg-orange-200 text-blue-900 ${isMenuOpen ? 'w-[20%] overflow-hidden' : 'w-[50px]'}`}>
            <div className='flex items-center justify-between text-2xl font-bold mb-5 border-b-[1px] border-orange-500 p-3'>
                <h2 className={`cursor-pointer ${isMenuOpen ? 'block' : 'hidden'}`}>E-food</h2>
                <Icon
                    icon={
                        `${isMenuOpen
                            ? 'tabler:layout-sidebar-right-expand-filled'
                            : 'tabler:layout-sidebar-left-expand-filled'}`
                    }
                    className='cursor-pointer'
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
            </div>
            <div className=''>
                {
                    menuItems.map((menuItem, index) => (
                        <NavLink
                            to={menuItem.path}
                            key={index}
                            className={({ isActive }) => `flex gap-4 items-center text-xl p-3 font-semibold  hover:bg-orange-300 ${isActive ? 'bg-orange-300' : ''}`}
                        >
                            <Icon icon={menuItem.icon} />
                            <span className={`${isMenuOpen ? 'block' : 'hidden'}`}>{menuItem.name}</span>
                        </NavLink>
                    ))
                }
            </div>
        </div>
    );
};

export default Sidebar;
