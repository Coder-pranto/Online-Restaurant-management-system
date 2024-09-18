import { RouterProvider } from "react-router-dom";
import routers from "./router/router";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <div>
      <RouterProvider router={routers} />
      <Toaster />
    </div>
  );
}

export default App;
