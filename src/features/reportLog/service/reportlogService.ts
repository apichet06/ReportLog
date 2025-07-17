import axiosInstance from "@/shared/utils/axiosInstance";
import type { SearchData } from "../types/reportlog";
// import type { ReportLog, SearchData } from "../types/reportlog";

const GetReportLogService = () => axiosInstance.get("/DUC_DCC/ReportLog");
const SearchReportLogService = (Search: SearchData) =>
  axiosInstance.get("/DUC_DCC/ReportLog", { params: Search });

const ApprovedReportLogService = (Id: number[]) =>
  axiosInstance.put("/DUC_DCC", { Id });
const reportLogService = {
  GetReportLogService,
  ApprovedReportLogService,
  SearchReportLogService,
};
export default reportLogService;
