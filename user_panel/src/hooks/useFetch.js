import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetch(url) {
  // console.log({url})
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const baseURL = "https://api.efood.tailormaster.xyz/api/v1/";
  // const baseURL = 'http://localhost:5005/api/v1/';
  // console.log(baseURL + url);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(baseURL + url);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, fetchData, baseURL };
}
