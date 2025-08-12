import { useReportLogState } from "./useReportLogState";
import { useReportLogActions } from "./useReportLogActions";
import { useReportLogData } from "./useReportLogData";
import type { User } from "@/layouts/userType";
import useExportExcel from "./useExportExcel";

export function useReportLog(userData: User | null) {
  // สร้าง state ครั้งเดียว
  const state = useReportLogState();

  // ส่ง state นี้ให้ทุก hook ที่ต้องใช้
  const { ducData, dccData, fetchDUC, fetchDCC, LoadingData } =
    useReportLogData(state);

  const actions = useReportLogActions(
    state,
    fetchDUC,
    fetchDCC,
    LoadingData,
    userData,
    state.setDataDUC,
    state.setDataDCC,
    state.setLoadingDataGrid
  );

  const { handleExportExcel } = useExportExcel(state);

  return {
    ...state,
    ...actions,
    ducData,
    dccData,
    handleExportExcel,
    fetchDUC,
    fetchDCC,
    LoadingData,
    ducDataleng: ducData.length,
  };
}
