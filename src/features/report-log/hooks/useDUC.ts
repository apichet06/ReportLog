// useDUC.ts
import { useCallback, useEffect } from "react";
import reportLogService from "@/features/reportLog/service/reportlogService";
import datetime from "@/shared/utils/handleDatetime";
import type { ReportLogState } from "../types/reportLogTypes";

export const useDUC = (state: ReportLogState) => {
  const { setLoadingDataGrid, dayHisDateduc, setDataDUC, dataDuc } = state;
  const fetchDUC = useCallback(async () => {
    try {
      setLoadingDataGrid(true);

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDateduc === 1) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1);
        dateToday = datetime.DateSearch(targetDate);
        dateEndDate = datetime.DateSearch(targetDate);
      } else if (dayHisDateduc === 0) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 2);
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.GetReportLogService({
        tapData: "DUC",
        startDate: dateToday,
        endDate: dateEndDate,
      });
      setDataDUC(res.data.result);
      setLoadingDataGrid(false);
    } catch (err) {
      console.log(err);
    }
  }, [dayHisDateduc, setDataDUC, setLoadingDataGrid]);

  useEffect(() => {
    fetchDUC();
  }, [fetchDUC]);

  return {
    ducData: dataDuc,
    fetchDUC,
  };
};
