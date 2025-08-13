import { useCallback, useEffect } from "react";
import reportLogService from "../services/reportLogServices";
import datetime from "@/shared/utils/handleDatetime";
import type { ReportLogState } from "../types/reportLogTypes";

export const useDCC = (state: ReportLogState) => {
  const {
    setLoadingDataGrid,
    dayHisDatedcc,
    setDataDCC,
    dataDcc,
    checkBoxkUsual,
    checkBoxkUnusual,
    setTextSearch,
  } = state;

  const fetchDCC = useCallback(async () => {
    try {
      setLoadingDataGrid(true);
      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDatedcc == 1) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1);
        dateToday = datetime.DateSearch(targetDate);
        dateEndDate = datetime.DateSearch(targetDate);
      } else if (dayHisDatedcc == 0) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 2); // ลบ 2 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.GetReportLogService({
        tapData: "DCC",
        startDate: dateToday,
        endDate: dateEndDate,
        checkBoxkUsual,
        checkBoxkUnusual,
      });
      setDataDCC(res.data.result);
      setLoadingDataGrid(false);
      setTextSearch("");
    } catch (err) {
      console.log(err);
    }
  }, [
    checkBoxkUnusual,
    checkBoxkUsual,
    dayHisDatedcc,
    setDataDCC,
    setLoadingDataGrid,
    setTextSearch,
  ]);

  useEffect(() => {
    fetchDCC();
  }, [fetchDCC]);

  return {
    dccData: dataDcc,
    fetchDCC,
  };
};
