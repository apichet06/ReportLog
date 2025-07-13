import axiosInstance from "@/shared/utils/axiosInstance";
import type { ReportLog } from "../types/reportlog";

const ApprovedReportLogService = (data: ReportLog[]) =>
  axiosInstance.post("/reports/approved", { items: data });

export default ApprovedReportLogService;
