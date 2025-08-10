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
      await setLoadingExport(true);

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDatedcc == 1 && dayHisDateduc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());
      } else if (dayHisDatedcc == 0 && dayHisDateduc == 0) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 2); // ลบ 2 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.exportExcel({
        Search: textSearch,
        startDate: dateToday,
        endDate: dateEndDate,
        tapData,
      });
      const blob = res.data;

      // ดึงชื่อไฟล์จาก header 'content-disposition'
      const contentDisposition = res.headers["content-disposition"];
      let fileName = `${new Date().getTime()} ${tapData} report.xlsx`; // Default filename
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }

      // สร้าง URL ชั่วคราวสำหรับดาวน์โหลด
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      // เพิ่ม link เข้าไปใน DOM, กด, และลบออก
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      await setLoadingExport(false);
    } catch (err) {
      console.log(err);
    }
  }, [setLoadingExport, dayHisDatedcc, dayHisDateduc, textSearch, tapData]);

  return { handleExportExcel };
}
