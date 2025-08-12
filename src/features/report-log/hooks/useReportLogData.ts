import { useDUC } from "./useDUC";
import { useDCC } from "./useDCC";
import { useLoadingDateById } from "./useLoadingDateById";
import type { ReportLogState } from "../types/reportLogTypes";

export function useReportLogData(state: ReportLogState) {
  const { ducData, fetchDUC } = useDUC(state);
  const { dccData, fetchDCC } = useDCC(state);

  const { LoadingData } = useLoadingDateById(state.id.toString(), state);
  return {
    ducData,
    ducleng: ducData.length,
    fetchDUC,
    dccData,
    fetchDCC,
    LoadingData,
  };
}
