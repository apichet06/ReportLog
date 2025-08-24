import axiosInstance from "@/shared/utils/axiosInstance";
import type { UsersPermission } from "../types/UsersPermission";

const getUsersPermission = async (): Promise<UsersPermission[]> => {
  const res = await axiosInstance.get("/UserPermission/users");
  return res.data.result;
};

const createUsersPermission = async (data: UsersPermission) => {
  return await axiosInstance.post("/UserPermission", data);
};

const updateUsersPermission = async (id: number, data: UsersPermission) => {
  return await axiosInstance.put(`${"/UserPermission"}/${id}`, data);
};

const deleteUsersPermission = async (id: number) => {
  return await axiosInstance.delete(`${"/UserPermission"}/${id}`);
};

const getAppname = async () => {
  const res = await axiosInstance.get("/UserPermission/appName");
  return res.data.result;
};

const getbuPlant = async () => {
  const res = await axiosInstance.get("/UserPermission/buPlant");
  return res.data.result;
};

const userService = {
  getUsersPermission,
  createUsersPermission,
  updateUsersPermission,
  deleteUsersPermission,
  getAppname,
  getbuPlant,
};

export default userService;
