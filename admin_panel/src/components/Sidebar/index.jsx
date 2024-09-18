import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import menuItems from "../../../public/sideMenu";
import Logo from "/logo.png"; 
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTransitionClass(isSidebarOpen ? "translate-x-0" : "-translate-x-full");
  }, [isSidebarOpen]);

  const openSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    confirmDialog({
      message: "Are you sure you want to log out?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        Cookies.remove("token", { sameSite: 'None', secure: true });
        Cookies.remove("restaurantName", { sameSite: 'None', secure: true });
        Cookies.remove("restaurantId", { sameSite: 'None', secure: true });
        navigate("/login", { replace: true });
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: "You have been logged out.",
          life: 3000,
        });
      },
      reject: () => {
        console.log("Logout canceled");
      },
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Hamburger icon for xs screens */}
      <div
        className="lg:hidden text-xl p-3 cursor-pointer absolute z-20 mt-3 ml-[1%]"
        onClick={openSidebar}
      >
        {!isSidebarOpen ? (
          <FontAwesomeIcon icon={faBars} />
        ) : (
          <FontAwesomeIcon icon={faTimes} />
        )}
      </div>

      {/* Sidebar for lg screens */}
      <div className={`w-[22%] lg:block hidden overflow-y-auto fixed bg-white text-black h-full mb-12`}>
        <div className="h-[100vh]">
          <div className="flex items-center justify-center mt-5 mb-11">
            <img src={Logo} alt="Digital Menu" className="w-20 h-20 mr-2" />
          </div>
          <div>
            {menuItems.map((menuItem, index) => (
              <div key={index}>
                <NavLink
                  to={menuItem.path || "#"}
                  className={({ isActive }) =>
                    `w-[72%] mx-auto rounded-2xl flex gap-4 mt-2 items-center p-3 text-md font-medium ${isActive ? (menuItem.subMenu ? "text-black" : "bg-[#ffa901] text-black") : "text-gray-800"
                    } ${menuItem.subMenu ? "" : "p-2 text-lg font-semibold"}`
                  }
                >
                  {menuItem?.icon && <img src={menuItem?.icon} alt="menu_icon" className='w-[20%]' />}
                  <span className={menuItem.subMenu ? "tracking-widest" : ""}>{menuItem.name}</span>
                </NavLink>

                {menuItem.subMenu && (
                  <div className="pl-10">
                    {menuItem.subMenu.map((subMenuItem, subIndex) => (
                      <NavLink
                        to={subMenuItem.path}
                        key={subIndex}
                        className={({ isActive }) =>
                          `w-[72%] mx-auto rounded-xl flex gap-4 mt-2 items-center p-2 text-lg font-semibold ${isActive && subMenuItem.name !== "Logout" ? "bg-[#ffa901] text-black" : "text-gray-800"
                          }`
                        }
                        onClick={subMenuItem.name === "Logout" ? handleLogout : closeSidebar}
                      >
                        {subMenuItem?.icon && <img src={subMenuItem?.icon} alt="menu_icon" className='w-[20%]' />}
                        <span>{subMenuItem.name}</span>
                      </NavLink>
                    ))}
                    {/* Add a gap after the last submenu item */}
                    <div className="h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for xs screens */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 cursor-pointer z-10"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar content for xs screens */}
      {isSidebarOpen && (
        <div
          className={`lg:hidden overflow-y-auto fixed inset-y-0 left-0 w-[60%] md:w-[40%] bg-white text-black z-10 transition-transform duration-500 ease-in-out ${transitionClass}`}
        >
          <div className="h-[100vh]">
            <div className="flex items-center justify-center mt-3 mb-11 p-3">
              <img src={Logo} alt="Digital Menu" className="w-16 h-16 mr-2" />
            </div>
            <div>
              {menuItems.map((menuItem, index) => (
                <div key={index}>
                  <NavLink
                    to={menuItem.path || "#"}
                    className={({ isActive }) =>
                      `w-[72%] mx-auto rounded-2xl flex gap-4 mt-2 items-center p-2 text-xs font-semibold ${isActive ? (menuItem.subMenu ? "text-black" : "bg-[#ffa901] text-black") : "text-gray-800"
                      } ${menuItem.subMenu ? "" : "text-lg p-2 font-semibold"}`
                    }
                  >
                    {menuItem?.icon && <img src={menuItem?.icon} alt="menu_icon" className='w-[20%]' />}
                    <span className={menuItem.subMenu ? "tracking-widest" : ""}>{menuItem.name}</span>
                  </NavLink>
                  {menuItem.subMenu && (
                    <div className="pl-6">
                      {menuItem.subMenu.map((subMenuItem, subIndex) => (
                        <NavLink
                          to={subMenuItem.path}
                          key={subIndex}
                          className={({ isActive }) =>
                            `w-[72%] mx-auto rounded-2xl flex gap-4 mt-2 items-center p-2 text-xs font-semibold ${isActive && subMenuItem.name !== "Logout" ? "bg-[#ffa901] text-black" : "text-gray-800"
                            }`
                          }
                          onClick={subMenuItem.name === "Logout" ? handleLogout : closeSidebar}
                        >
                          {subMenuItem?.icon && <img src={subMenuItem?.icon} alt="menu_icon" className='w-[20%]' />}
                          <span>{subMenuItem.name}</span>
                        </NavLink>
                      ))}
                      {/* Add a gap after the last submenu item */}
                      <div className="h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


