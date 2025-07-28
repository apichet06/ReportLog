import type { Dayjs } from "dayjs";

export interface ReportSaveLog {
  id: number;
  group_name: string;
  username: string;
  action: string;
  action_date_time: string;
  detail: string;
  bu: string;
  position: string;
  resigned_date: string;
  days_after_action: number;
  event_type: string;
  unauthorized: string;
  download_more_10_files_day: string; // ดาวน์โหลดมากกว่า 10 files
  employee_resigning_within_one_month: string; //พนักงานลาออกภายในหนึ่งเดือน
  is_not_dcc: string;
  users_action: string;
  user_action_date: Date;
}

export interface SearchData {
  Search?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  tapData?: string; // Additional field for tap data
}

export interface TabDataState {
  tapData?: string;
}
