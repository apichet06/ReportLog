import axios from "axios";
import { sendPost } from "./logout";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7073/api",
  // baseURL: "https://fits/CRUDLogs/dccduc_Api_new/api",
  timeout: 5000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem("token");
      // window.location.href = `${import.meta.env.BASE_URL}login`; // redirect ไปหน้า login
      sendPost();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
