import { useCallback, useEffect } from "react";
import reportLogService from "../services/reportLogServices";
import type { ReportLogState } from "../types/reportLogTypes";

export const useLoadingDateById = (id: string, state: ReportLogState) => {
  const { setData, setEditingId } = state;

  const LoadingData = useCallback(async () => {
    try {
      const res = await reportLogService.GetReportLogById(Number(id));

      if (res.data?.result.length > 0) {
        setData(res.data.result[0]);
        setEditingId(res.data.result[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id, setData, setEditingId]);

  useEffect(() => {
    LoadingData();
  }, [LoadingData]);

  return { LoadingData };
};
