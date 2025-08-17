import axios from "@/shared/utils/axiosInstance";
import type { LoginRequest, LoginResponse } from "../types/auth";
import Cookies from "js-cookie";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("/Authen", data);
  return response.data;
};

// CookieToke

export const authenCookie = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", data.user_name); // ชื่อต้องตรงกับชื่อ field ใน `AuthenDto`

  const response = await axios.post<LoginResponse>("/Authen/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: true, // สำคัญมากถ้าอยากให้ cookie ถูกเก็บฝั่ง client
  });

  return response.data;
};

export const authService = {
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("authToken");
    // หรือถ้าใช้ sessionStorage: sessionStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
