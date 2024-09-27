import Loading from "../../ui/Loading/Loading";
import AllMenu from "../../assets/all_menu.png";


export default function Menu({ data, loading, baseURL, setSelectedMenu }) {


  return (
    <section className="flex items-center gap-5 overflow-x-auto pb-2 h-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div
            className="w-[100px] h-[150px] flex-shrink-0 flex flex-col items-center justify-center gap-2 bg-white shadow-md rounded-md p-2"
            onClick={() => setSelectedMenu("All")}
          >
            <img
              src={AllMenu}
              alt="item"
              className="w-full h-20 rounded-md object-cover"
            />
            <span className="text-sm font-semibold text-center">
            All Menu
            </span>
          </div>
          {data.map((menu) => (
            <div
              key={menu._id}
              className="w-[100px] h-[150px] flex-shrink-0 flex flex-col items-center justify-center gap-2 bg-white shadow-md rounded-md p-2"
              onClick={() => setSelectedMenu(menu)}
            >
              <img
                src={baseURL + menu.category_image}
                alt={menu.name}
                className="w-full h-20 rounded-md object-cover"
              />
              <span className="text-sm font-semibold text-center">
                {menu.name}
              </span>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
