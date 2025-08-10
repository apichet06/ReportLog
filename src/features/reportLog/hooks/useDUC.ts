import { useCallback, useEffect, useState } from "react";
import reportLogService from "../service/reportlogService";
import datetime from "@/shared/utils/handleDatetime";

export const useDUC = () => {
  const [ducData, SetDataDUC] = useState([]);
  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);
  const [dayHisDateduc, setsDayHisDateDuc] = useState(1);

  const fetchDUC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true);

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDateduc == 1) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1);
        dateToday = datetime.DateSearch(targetDate);
        dateEndDate = datetime.DateSearch(targetDate);
      } else if (dayHisDateduc == 0) {
        // const targetDate = new Date("2025-07-14");
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 2); // ลบ 1 วัน เพราะใน C# +1 วัน
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

  useEffect(() => {
    fetchDUC();
  }, [fetchDUC]);

  return { ducData, loadingDataGrid, setsDayHisDateDuc };
};
