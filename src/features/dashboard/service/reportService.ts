import axiosInstance from "@/shared/utils/axiosInstance";

import type { CartBarData, ChartData } from "../Types/ChartType";

export interface ApiResponse<T> {
  result: T;
  isSuccess: boolean;
  message: string;
}

const ChartService = (Year: string) =>
  axiosInstance.get<ApiResponse<ChartData[]>>("/Chart/" + Year);

const ChartBarService = (Year: string) =>
  axiosInstance.get<ApiResponse<CartBarData[]>>("/Chart/BarChart/" + Year);

const _Chart = {
  ChartService,
  ChartBarService,
};
export default _Chart;
