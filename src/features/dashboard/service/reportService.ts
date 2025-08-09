import axiosInstance from "@/shared/utils/axiosInstance";

import type { CartBarData, ChartData } from "../Types/ChartType";

export interface ApiResponse<T> {
  result: T;
  isSuccess: boolean;
  message: string;
}

const ChartService = () =>
  axiosInstance.get<ApiResponse<ChartData[]>>("/Chart");

const ChartBarService = () =>
  axiosInstance.get<ApiResponse<CartBarData[]>>("/Chart/BarChart");

const _Chart = {
  ChartService,
  ChartBarService,
};
export default _Chart;
