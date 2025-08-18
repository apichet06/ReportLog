import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");
dayjs.extend(buddhistEra);

const DateLongTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("DD/MM/YYYY");
};

const DateTimeLongTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("DD/MM/YYYY HH:mm");
};

const DateSearch = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("YYYY-MM-DD");
};

// Helper function สร้างพารามิเตอร์วันที่
const buildDateParams = (dayHistory: number) => {
  let startDate = "";
  let endDate = "";

  if (dayHistory === 1) {
    // เมื่อวาน
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 1);
    startDate = datetime.DateSearch(targetDate);
    endDate = datetime.DateSearch(targetDate);
  } else if (dayHistory === 0) {
    // ย้อนหลัง 2 วัน
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - 2);
    endDate = datetime.DateSearch(targetDate);
  }

  return { startDate, endDate };
};

const buildDateParamsSearch = (
  dayHistory: number,
  customStart?: Dayjs | null,
  customEnd?: Dayjs | null
) => {
  let startDate = "";
  let endDate = "";

  if (dayHistory === 1) {
    // เมื่อวาน
    const target = new Date();
    target.setDate(target.getDate() - 1);
    startDate = datetime.DateSearch(target);
    endDate = datetime.DateSearch(target);
  } else if (dayHistory === 0) {
    // ย้อนหลัง 2 วัน แต่ถ้า user เลือก customStart && customEnd ใช้ช่วงนั้นแทน
    if (customStart && customEnd) {
      startDate = dayjs(customStart).format("YYYY-MM-DD");
      endDate = dayjs(customEnd).format("YYYY-MM-DD");
    } else {
      const target = new Date();
      target.setDate(target.getDate() - 2);
      endDate = datetime.DateSearch(target);
    }
  }

  return { startDate, endDate };
};

const datetime = {
  DateLongTH,
  DateTimeLongTH,
  DateSearch,
  buildDateParams,
  buildDateParamsSearch,
};
export default datetime;
