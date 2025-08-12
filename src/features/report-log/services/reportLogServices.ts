import axiosInstance from "@/shared/utils/axiosInstance";
import type { ReportLog, SearchData, TabDataState } from "../types/reportlog";
import type { AxiosResponse } from "axios";
// import type { ReportLog, SearchData } from "../types/reportlog";

interface ApiListResponse {
  result: ReportLog[];
}

const GetReportLogService = (data: TabDataState) =>
  axiosInstance.get("/DUC_DCC/ReportLog", {
    params: {
      endDate: data.endDate,
      startDate: data.startDate,
      tapData: data.tapData,
      dayHisDate: data.dayHisDate,
    },
  });

const buildSearchParams = (searchData: SearchData) => ({
  Search: searchData.Search,
  startDate: searchData.startDate,
  endDate: searchData.endDate,
  tapData: searchData.tapData,
  dayHisDate: searchData.dayHisDate,
});

const SearchReportLogService = (
  searchData: SearchData
): Promise<AxiosResponse<ApiListResponse>> => {
  const params = buildSearchParams(searchData);
  return axiosInstance.get("/DUC_DCC/ReportLog", { params });
};

const exportExcel = (searchData: SearchData): Promise<AxiosResponse<Blob>> => {
  const params = buildSearchParams(searchData);
  return axiosInstance.get("/DUC_DCC/ExportExcelLog", {
    params,
    responseType: "blob",
  });
};

const ApprovedReportLogService = (
  Id: number[],
  Admin_confirm: string,
  valueRedio: string,
  commont: string
) =>
  axiosInstance.put("/DUC_DCC", {
    Id,
    Admin_confirm: Admin_confirm,
    Admin_confirm_event: valueRedio,
    Admin_confirm_comment: commont,
  });

const reportLogService = {
  GetReportLogService,
  ApprovedReportLogService,
  SearchReportLogService,
  exportExcel,
};
export default reportLogService;
