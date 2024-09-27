import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Cookies from "universal-cookie";
import { RiLogoutCircleLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const cookies = new Cookies();

  const handleLogout = () => {
    cookies.remove('email', { path: '/' });
    cookies.remove('adminToken');
    navigate('/login');
    enqueueSnackbar('Logout Successful', { variant: 'success' });
  };

  return (
    <div className="sm:hidden lg:flex justify-between px-4 bg-orange-200 text-2xl p-4 text-blue-900 font-semibold border-b-4 border-orange-400 sticky top-0">
      <div>
        <h2 className="font-bold cursor-pointer">DigitalMenu Super Admin</h2>
      </div>
      <div className="w-[10%] flex items-center justify-end gap-4 pr-3 text-3xl">
        <FaUserCircle title="Admin" className="cursor-pointer" />
        <RiLogoutCircleLine title="Logout" className="cursor-pointer" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Header;
