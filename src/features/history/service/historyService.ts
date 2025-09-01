import axiosInstance from "@/shared/utils/axiosInstance";
import type { Histotys } from "../types/historyType";

const GetSaveHistoryService = async (): Promise<Histotys[]> => {
  const res = await axiosInstance.get("/History");
  return res.data.result;
};

const history = {
  GetSaveHistoryService,
};

export default history;
