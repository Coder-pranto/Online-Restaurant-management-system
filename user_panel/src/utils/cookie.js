import Cookies from "js-cookie";

export const setCookie = (name, value) =>
  Cookies.set(name, JSON.stringify(value), { expires: 1 });
export const getCookie = (name) => JSON.parse(Cookies.get(name));


