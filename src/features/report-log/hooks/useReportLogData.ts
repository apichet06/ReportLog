import { useDUC } from "./useDUC";
import { useDCC } from "./useDCC";
import type { ReportLogState } from "../types/reportLogTypes";

export function useReportLogData(state: ReportLogState) {
  const { ducData, fetchDUC } = useDUC(state);
  const { dccData, fetchDCC } = useDCC(state);

  return {
    ducData,
    ducleng: ducData.length,
    fetchDUC,
    dccData,
    fetchDCC,
  };
}
