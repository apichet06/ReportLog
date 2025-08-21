import axiosInstance from "@/shared/utils/axiosInstance";
import type { DataAcceptDataAllEamil } from "../types/saveOnemailTypes";

const ApprovedSaveOnemailService = (
  plant: string,
  app_log: string,
  datetime: string,
  data: DataAcceptDataAllEamil
) =>
  axiosInstance.put(
    `DUC_DCC/SaveAllDayInEmail/${plant}/${app_log}/${datetime}`,
    {
      admin_confirm: data.admin_confirm,
    }
  );

export default ApprovedSaveOnemailService;
