import MenuDetailsCard from "../../ui/Cards/MenuDetailsCard";
import useFetch from "../../hooks/useFetch";
import Loading from "../../ui/Loading/Loading";
import { useContext } from "react";
import { ViewContext } from "../../context/view";

export default function MenuDetails({
  menuId,
  restaurantId,
  search,
  setOpenModal,
  setSelectedFood,
}) {
  const { view } = useContext(ViewContext);

  /* <- Fetching specific foods based on category -> */
  const {
    data: selectedMenuData,
    loading: selectedMenuLoading,
    baseURL: selectedMenuURL,
  } = useFetch(`food/category/${menuId}`);

  const {
    data: allCate,
  } = useFetch(`category?restaurantId=${restaurantId}`);

  /* <- Fetching all foods based on restaurantId -> */
  const {
    data: allMenuDatax,
    loading: allMenuLoading,
    baseURL: allMenuURL,
  } = useFetch(`food?restaurantId=${restaurantId}`);

  const allMenuData = allMenuDatax.filter(item => {
    if (item.categoryId && item.categoryId._id) {
      return allCate.some(category => category._id === item.categoryId._id);
    }
    return false; // Exclude items with null categoryId
  });
  
  console.log(allMenuData)

  return (
    <section>
      {menuId ? (
        selectedMenuLoading ? (
          <Loading />
        ) : (
          <div
            className={`grid ${
              view === "list" ? "grid-cols-1" : "grid-cols-2"
            } items-center justify-center gap-5`}
          >
            {[...selectedMenuData]
              .reverse()
              ?.filter((menuItem) =>
                menuItem?.name.toLowerCase().includes(search.toLowerCase())
              ).length > 0 ? (
              [...selectedMenuData]
                .reverse()
                ?.filter((menuItem) =>
                  menuItem?.name.toLowerCase().includes(search.toLowerCase())
                ).sort((a, b) => (a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1))
                ?.map((menuItem) => (
                  <MenuDetailsCard
                    key={menuItem?._id}
                    menuName={menuItem?.name}
                    menuDetails={menuItem?.description}
                    menuPrice={menuItem.price}
                    menuImage={ allMenuURL + menuItem.food_image}
                    menuOfferAvailable={menuItem?.isOffer}
                    menuDiscountType={menuItem?.discount_type}
                    menuDiscountValue={menuItem?.discount_value}
                    menuIsPopular={menuItem?.isPopular}
                    setOpenModal={setOpenModal}
                    onClick={() => setSelectedFood(menuItem)}
                  />
                ))
            ) : (
              <div>No search results found.</div>
            )}
          </div>
        )
      ) : allMenuLoading ? (
        <Loading />
      ) : (
        <div
          className={`grid ${
            view === "list" ? "grid-cols-1" : "grid-cols-2"
          } items-center justify-center gap-5`}
        >
          {[...allMenuData]
            .reverse()
            ?.filter((menuItem) =>
              menuItem?.name.toLowerCase().includes(search.toLowerCase())
            )
            .length > 0 ? (
            [...allMenuData]
              .reverse()
              ?.filter((menuItem) =>
                menuItem?.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => (a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1))
              ?.map((menuItem) => (
                <MenuDetailsCard
                  key={menuItem?._id}
                  menuName={menuItem?.name}
                  menuDetails={menuItem?.description}
                  menuPrice={menuItem.price}
                  menuImage={ allMenuURL + menuItem.food_image}
                  menuOfferAvailable={menuItem?.isOffer}
                  menuDiscountType={menuItem?.discount_type}
                  menuDiscountValue={menuItem?.discount_value}
                  menuIsPopular={menuItem?.isPopular}
                  setOpenModal={setOpenModal}
                  onClick={() => setSelectedFood(menuItem)}
                />
              ))
          ) : (
            <div>No search results found.</div>
          )}
        </div>
      )}
    </section>
  );
}
