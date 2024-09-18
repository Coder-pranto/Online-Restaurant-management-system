import axios from "axios";
import { baseUrl } from "./BaseUrl";
import Cookies from "universal-cookie";

const fetchRestaurantData = async (page, pageSize, retryCount = 0) => {
  const cookies = new Cookies();
  const token = cookies.get("adminToken");

  if (!token && retryCount < 5) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await fetchRestaurantData(page, pageSize, retryCount + 1));
      }, 500);
    });
  }

  try {
    const response = await axios.get(`${baseUrl}/restaurant-admin/all?pageNumber=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: token,
      },
    });
    console.log("All data:", response.data.data)
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error("Expected data to be an array:", response.data.data);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch restaurant data:", error.message);
    return [];
  }
};

export default fetchRestaurantData;

