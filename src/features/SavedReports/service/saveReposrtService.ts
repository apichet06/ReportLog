import type { SearchData } from "@/features/reportLog/types/reportlog";
import axiosInstance from "@/shared/utils/axiosInstance";

const GetSaveReportLogService = () =>
  axiosInstance.get("/DUC_DCC/SaveReportLog");
const SearchSaveReportLogService = (Search: SearchData) =>
  axiosInstance.get("/DUC_DCC/SaveReportLog", { params: Search });

const reportSaveLog = {
  GetSaveReportLogService,
  SearchSaveReportLogService,
};

export default reportSaveLog;
