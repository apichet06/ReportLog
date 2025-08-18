import type { SearchData } from "@/features/reportLog/types/reportlog";
import axiosInstance from "@/shared/utils/axiosInstance";
import type { AxiosResponse } from "axios";
import type {
  EditAccept,
  ReportSaveLog,
  TabDataState,
} from "../types/reportsavelog";

interface ApiListResponse {
  result: ReportSaveLog[];
}

const GetSaveReportLogService = (data: TabDataState) =>
  axiosInstance.get("/DUC_DCC/SaveReportLog", {
    params: {
      endDate: data.endDate,
      startDate: data.startDate,
      tapData: data.tapData,
      dayHisDate: data.dayHisDate,
      checkBoxkUsual: data.checkBoxkUsual,
      checkBoxkUnusual: data.checkBoxkUnusual,
    },
  });

const buildSearchParams = (searchData: SearchData) => ({
  Search: searchData.Search,
  startDate: searchData.startDate,
  endDate: searchData.endDate,
  tapData: searchData.tapData,
  dayHisDate: searchData.dayHisDate,
  checkBoxkUsual: searchData.checkBoxkUsual,
  checkBoxkUnusual: searchData.checkBoxkUnusual,
});

const ApprovedReportLogEditService = (editingId: number, data: EditAccept) =>
  axiosInstance.put(`/DUC_DCC/EditAccept/${editingId}`, {
    Admin_confirm_edit: data.Admin_confirm_edit,
    Admin_confirm_comment: data.Admin_confirm_comment,
    Admin_confirm_event: data.Admin_confirm_event,
  });

const SearchSaveReportLogService = (
  searchData: SearchData
): Promise<AxiosResponse<ApiListResponse>> => {
  const params = buildSearchParams(searchData);
  return axiosInstance.get("/DUC_DCC/SaveReportLog", { params });
};

const exportExcel = (searchData: SearchData): Promise<AxiosResponse<Blob>> => {
  const params = buildSearchParams(searchData);
  return axiosInstance.get("/DUC_DCC/ExportExcelLogAccept", {
    params,
    responseType: "blob",
  });
};

const GetCoutAuditlog = () => axiosInstance.get("/DUC_DCC/CountAuditLog");

const reportSaveLog = {
  GetSaveReportLogService,
  SearchSaveReportLogService,
  exportExcel,
  ApprovedReportLogEditService,
  GetCoutAuditlog,
};

export default reportSaveLog;
