import axiosInstance from "@/shared/utils/axiosInstance";
import type { ReportLog, SearchData } from "../types/reportlog";
import type { AxiosResponse } from "axios";
// import type { ReportLog, SearchData } from "../types/reportlog";

interface ApiListResponse {
  result: ReportLog[];
}

const GetReportLogService = () => axiosInstance.get("/DUC_DCC/ReportLog");

const SearchReportLogService = (
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
  return axiosInstance.get("/DUC_DCC/ReportLog", { params });
};

const ApprovedReportLogService = (Id: number[]) =>
  axiosInstance.put("/DUC_DCC", { Id });
const reportLogService = {
  GetReportLogService,
  ApprovedReportLogService,
  SearchReportLogService,
};
export default reportLogService;
