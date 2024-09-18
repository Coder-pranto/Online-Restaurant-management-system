
import { Icon } from "@iconify/react/dist/iconify.js";

const Header = () => {
  return (
    <div className="sm:hidden lg:flex justify-between px-4 bg-orange-200 text-2xl p-4 text-blue-900 font-semibold border-b-4 border-orange-400 sticky top-0">
        <div>
            <h2 className="font-bold cursor-pointer">E-food Super Admin</h2>
        </div>
        <div className="w-[10%] flex items-center justify-end gap-4 pr-3 text-3xl">
            <Icon className="cursor-pointer" icon="healthicons:ui-user-profile" />
            <Icon icon="icon-park-twotone:help" className="cursor-pointer" />
        </div>
    </div>
  );
}

export default Header;
