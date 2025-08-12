import { useCallback } from "react";
// import type { ReportLogState } from "../types/reportLogTypes";
import datetime from "@/shared/utils/handleDatetime";
import reportLogService from "../services/reportLogServices";

interface ExportExcelState {
  dayHisDatedcc: number;
  dayHisDateduc: number;
  textSearch: string;
  tapData: string;
  setLoadingExport: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useExportExcel(state: ExportExcelState) {
  const {
    dayHisDatedcc,
    dayHisDateduc,
    textSearch,
    tapData,
    setLoadingExport,
  } = state;

  const handleExportExcel = useCallback(async () => {
    try {
      setLoadingExport(true);
      let dateToday = "";
      let dateEndDate = "";

      const isToday =
        tapData === "DUC" ? dayHisDateduc === 1 : dayHisDatedcc === 1;

      if (isToday) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());
      } else {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.exportExcel({
        Search: textSearch,
        startDate: dateToday,
        endDate: dateEndDate,
        tapData: tapData,
      });

      const blob = res.data;

      const contentDisposition = res.headers["content-disposition"];
      let fileName = `${new Date().getTime()} report.xlsx`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLoadingExport(false);
    } catch (err) {
      console.log(err);
      setLoadingExport(false);
    }
  }, [dayHisDatedcc, dayHisDateduc, setLoadingExport, tapData, textSearch]);

  return { handleExportExcel };
}
