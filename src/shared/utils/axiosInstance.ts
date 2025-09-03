import axios from "axios";
import { sendPost } from "./logout";

const axiosInstance = axios.create({
  // baseURL: "https://localhost:7073/api",
  baseURL: "https://fits/CRUDLogs/dccduc_Api_new/api",
  timeout: 5000,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (!originalRequest._retry && error.response?.status === 401) {
      originalRequest._retry = true;
      localStorage.removeItem("token");
      sendPost();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
