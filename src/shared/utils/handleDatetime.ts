import dayjs from "dayjs";
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

export default DateLongTH;
