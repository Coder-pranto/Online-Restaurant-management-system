import { Link, useRouteError } from "react-router-dom";
import Button from "../../ui/Buttons/Button";
import { getCookie } from "../../utils/cookie";

export default function ErrorPage() {
  const error = useRouteError();
    const { restaurantId, tableNumber } = getCookie('resIdAndTableNo');

  return (
    <section
      id="error-page"
      className="h-screen flex flex-col items-center justify-center gap-4"
    >
      <h1 className="text-3xl font-semibold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-red-600">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={`/?restaurantid=${restaurantId}&table=${tableNumber}`}>
        <Button text="Back To Home" variant="primary" size="xl" />
      </Link>
    </section>
  );
}
