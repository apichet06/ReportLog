import axiosInstance from "@/shared/utils/axiosInstance";
import type { Histotys, Search } from "../types/historyType";

const GetSaveHistoryService = async (params?: Search): Promise<Histotys[]> => {
  const res = await axiosInstance.get("/History", {
    params: {
      Search: params?.Search,
      startDate: params?.startDate,
      endDate: params?.endDate,
    },
  });
  return res.data.result;
};

const history = {
  GetSaveHistoryService,
};

export default history;
