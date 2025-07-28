import type { SearchData } from "@/features/reportLog/types/reportlog";
import axiosInstance from "@/shared/utils/axiosInstance";
import type { AxiosResponse } from "axios";
import type { ReportSaveLog, TabDataState } from "../types/reportsavelog";

interface ApiListResponse {
  result: ReportSaveLog[];
}

const GetSaveReportLogService = (data: TabDataState) =>
  axiosInstance.get("/DUC_DCC/SaveReportLog", {
    params: { tapData: data.tapData },
  });

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
    tapData: searchData.tapData,
  };
  return axiosInstance.get("/DUC_DCC/SaveReportLog", { params });
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
    tapData: searchData.tapData,
  };
  return axiosInstance.get("/DUC_DCC/ExportExcelLogAccept", {
    params,
    responseType: "blob",
  });
};

const reportSaveLog = {
  GetSaveReportLogService,
  SearchSaveReportLogService,
  exportExcel,
};

export default reportSaveLog;
