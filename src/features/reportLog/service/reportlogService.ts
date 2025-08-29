import axiosInstance from "@/shared/utils/axiosInstance";
import type {
  AcceptById,
  ReportLog,
  SearchData,
  TabDataState,
} from "../types/reportlog";
import type { AxiosResponse } from "axios";
import type { GridRowId } from "@mui/x-data-grid";
// import type { ReportLog, SearchData } from "../types/reportlog";

interface ApiListResponse {
  result: ReportLog[];
}

const GetReportLogById = (id: number) =>
  axiosInstance.get(`/DUC_DCC/ReportLog/${id}`);

const GetReportLogService = (data: TabDataState) =>
  axiosInstance.get("/DUC_DCC/ReportLog", {
    params: {
      endDate: data.endDate,
      startDate: data.startDate,
      tapData: data.tapData,
      dayHisDate: data.dayHisDate,
      checkBoxUsual: data.checkBoxUsual,
      checkBoxUnusual: data.checkBoxUnusual,
      plant: data.plant,
      Search: data.Search,
    },
  });

const buildSearchParams = (searchData: SearchData) => ({
  Search: searchData.Search,
  startDate: searchData.startDate,
  endDate: searchData.endDate,
  tapData: searchData.tapData,
  dayHisDate: searchData.dayHisDate,
  checkBoxUsual: searchData.checkBoxUsual,
  checkBoxUnusual: searchData.checkBoxUnusual,
  plant: searchData.plant,
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
  Id: GridRowId[],
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

const ApprovedReportLogByIDService = (editingId: number, data: AcceptById) =>
  axiosInstance.put(`/DUC_DCC/AcceptById/${editingId}`, {
    Admin_confirm: data.Admin_confirm,
    Admin_confirm_comment: data.Admin_confirm_comment,
    Admin_confirm_event: data.Admin_confirm_event,
  });

const reportLogService = {
  GetReportLogService,
  ApprovedReportLogService,
  SearchReportLogService,
  exportExcel,
  GetReportLogById,
  ApprovedReportLogByIDService,
};
export default reportLogService;
