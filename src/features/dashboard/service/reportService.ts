import axiosInstance from "@/shared/utils/axiosInstance";
type ApprovedPayload = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  age: number;
}[];

const ApprovedReportService = (data: ApprovedPayload) =>
  axiosInstance.post("/reports/approved", { items: data });

export default ApprovedReportService;
