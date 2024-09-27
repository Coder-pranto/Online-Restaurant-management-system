import { useState } from "react";
import SubHeader from "../../components/Header/SubHeader";
import useFetch from "../../hooks/useFetch";
import { useLocation } from "react-router-dom";
import { setCookie } from "../../utils/cookie";
import Menu from "../../components/Home/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import MenuDetails from "../../components/Home/MenuDetails";
import Modal from "../../ui/Modals/Modal";
import Loading from "../../ui/Loading/Loading";
import FoodCard from "../../components/Home/FoodCard";


export default function Home() {

  const [searchValue, setSearchValue] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("All");
  const [selectedFood, setSelectedFood] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { search } = useLocation();


  /* <- Getting query params for show menu based on restaurantId -> */
  const queryParams = new URLSearchParams(search.toUpperCase());
  const restaurantId = queryParams.get("RESTAURANTID");
  const tableNumber = queryParams.get("TABLE");
  setCookie("resIdAndTableNo", { restaurantId, tableNumber });

  /* <- Fetch Menu Data -> */
  const {
    data: menus,
    loading,
    baseURL,
  } = useFetch(`category?restaurantId=${restaurantId}`);

  /* <- Fetch single food data -> */
  const { data: foodDetailsData, loading: foodLoading } = useFetch(
    `food/${selectedFood?._id}`
  );

  /* <- Handling Searching -> */
  const handleSearch = (e) => {
    e.preventDefault();
    queryParams.set("SEARCH", searchValue);
    const newURL = `?${queryParams.toString()}`;
    history.pushState({}, null, newURL);
  };

  return (
    <section className="flex flex-col gap-4">
      {/* <- Search Bar -> */}
      <form className="relative" onSubmit={handleSearch}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          color="gray"
          className="absolute top-1/2 left-3 transform -translate-y-1/2"
        />
        <input
          type="search"
          name="search"
          placeholder={'Search'}  // Add translation
          className="border-2 w-full text-sm pl-10 pr-2 py-2 rounded-md shadow-inner"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>

      {/* <- Menu -> */}
      <Menu
        data={menus}
        loading={loading}
        baseURL={baseURL}
        setSelectedMenu={setSelectedMenu}
      />

      {/* <- Menu Sub Header -> */}
      {selectedMenu === "All" ? (
        <SubHeader text={'All Menu'} />  
      ) : (
        <SubHeader text={selectedMenu?.name} />
      )}

      {/* <- Menu Details -> */}
      <MenuDetails
        menuId={selectedMenu?._id}
        restaurantId={restaurantId}
        search={searchValue}
        setOpenModal={() => setOpenModal(true)}
        setSelectedFood={setSelectedFood}
      />

      {/* <- Cart Modal -> */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={selectedFood?.name}
      >
        {selectedFood && (
          <>
            {foodLoading ? (
              <Loading />
            ) : (
              <FoodCard
                data={foodDetailsData[0]}
                baseURL={baseURL}
                onClose={() => setOpenModal(false)}
              />
            )}
          </>
        )}
      </Modal>
    </section>
  );
}
