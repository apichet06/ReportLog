import axiosInstance from "@/shared/utils/axiosInstance";
import type { ReportLog, SearchData, TabDataState } from "../types/reportlog";
import type { AxiosResponse } from "axios";
// import type { ReportLog, SearchData } from "../types/reportlog";

interface ApiListResponse {
  result: ReportLog[];
}

const GetReportLogService = (data: TabDataState) =>
  axiosInstance.get("/DUC_DCC/ReportLog", {
    params: { tapData: data.tapData },
  });

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
    tapData: searchData.tapData, // Include tapData in the request parameters
  };
  return axiosInstance.get("/DUC_DCC/ReportLog", { params });
};

const exportExcel = (searchData: SearchData): Promise<AxiosResponse<Blob>> => {
  const params = {
    Search: searchData.Search,
    startDate: searchData.startDate
      ? searchData.startDate.format("YYYY-MM-DD")
      : undefined,
    endDate: searchData.endDate
      ? searchData.endDate.format("YYYY-MM-DD")
      : undefined,
  };
  return axiosInstance.get("/DUC_DCC/ExportExcelLog", {
    params,
    responseType: "blob",
  });
};

const ApprovedReportLogService = (Id: number[]) =>
  axiosInstance.put("/DUC_DCC", { Id });

const reportLogService = {
  GetReportLogService,
  ApprovedReportLogService,
  SearchReportLogService,
  exportExcel,
};
export default reportLogService;
