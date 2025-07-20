import type { SearchData } from "@/features/reportLog/types/reportlog";
import axiosInstance from "@/shared/utils/axiosInstance";
import type { AxiosResponse } from "axios";
import type { ReportSaveLog } from "../types/reportsavelog";

interface ApiListResponse {
  result: ReportSaveLog[];
}

const GetSaveReportLogService = () =>
  axiosInstance.get("/DUC_DCC/SaveReportLog");

const SearchSaveReportLogService = (
  searchData: SearchData
): Promise<AxiosResponse<ApiListResponse>> => {
  const params = {
    Search: searchData.Search,
    startDate: searchData.startDate
      ? searchData.startDate.format("YYYY-MM-DD")
      : undefined,
    endDate: searchData.endDate
      ? searchData.endDate.format("YYYY-MM-DD")
      : undefined,
  };
  return axiosInstance.get("/DUC_DCC/SaveReportLog", { params });
};

const reportSaveLog = {
  GetSaveReportLogService,
  SearchSaveReportLogService,
};

export default reportSaveLog;
