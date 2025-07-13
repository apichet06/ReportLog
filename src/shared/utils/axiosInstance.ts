import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7243/api",
  timeout: 5000,
});

export default axiosInstance;
