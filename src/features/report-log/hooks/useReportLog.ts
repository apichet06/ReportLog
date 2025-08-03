// src/features/report-log/hooks/useReportLog.ts
import { useCallback, useEffect, useState } from "react";
import type { GridPaginationModel } from "@mui/x-data-grid";
import reportLogService from "../services/reportLogServices";
import type { ReportLog } from "../types/reportlog";
import datetime from "@/shared/utils/handleDatetime";

export function useReportLog(paginationModel: GridPaginationModel) {
  const [rows, setRows] = useState<ReportLog[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [dayHisDateduc, setsDayHisDateDuc] = useState(1);
  const [dayHisDatedcc, setsDayHisDateDcc] = useState(1);

  const [dataDuc, SetDataDUC] = useState<ReportLog[]>();
  const [dataDcc, SetDataDCC] = useState<ReportLog[]>();
  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);

  const fetchDUC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true);

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDateduc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());
      } else if (dayHisDateduc == 0) {
        const targetDate = new Date("2025-07-14");
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.GetReportLogService({
        tapData: "DUC",
        startDate: dateToday,
        endDate: dateEndDate,
      });
      SetDataDUC(res.data.result);
      setLoadnigDataGrid(false);
    } catch (err) {
      console.log(err);
    }
  }, [dayHisDateduc]);

  const fetchDCC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true);
      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDatedcc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());
      } else if (dayHisDatedcc == 0) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.GetReportLogService({
        tapData: "DCC",
        startDate: dateToday,
        endDate: dateEndDate,
      });
      SetDataDCC(res.data.result);
      setLoadnigDataGrid(false);
    } catch (err) {
      console.log(err);
    }
  }, [dayHisDatedcc]);

  useEffect(() => {
    fetchDCC();
    fetchDUC();
  }, [fetchDCC, fetchDUC, paginationModel]);

  return {
    rows,
    rowCount,
    loading,
    setsDayHisDateDcc,
    setsDayHisDateDuc,
    dataDuc,
    dataDcc,
    loadingDataGrid,
    setLoading,
    setRowCount,
    setRows,
  };
}
