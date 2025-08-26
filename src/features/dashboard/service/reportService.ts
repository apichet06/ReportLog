import axiosInstance from "@/shared/utils/axiosInstance";

import type { CartBarData, ChartData } from "../Types/ChartType";

export interface ApiResponse<T> {
  result: T;
  isSuccess: boolean;
  message: string;
}

const ChartService = (Year: string, plant: string) =>
  axiosInstance.get<ApiResponse<ChartData[]>>("/Chart/" + Year + "/" + plant);

const ChartBarService = (Year: string, plant: string) =>
  axiosInstance.get<ApiResponse<CartBarData[]>>(
    "/Chart/BarChart/" + Year + "/" + plant
  );

const _Chart = {
  ChartService,
  ChartBarService,
};
export default _Chart;
