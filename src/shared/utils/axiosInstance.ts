import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://localhost:7073/api",
  baseURL: "https://fits/CRUDLogs/dccduc_Api_new/api",
  timeout: 5000,
});

export default axiosInstance;
