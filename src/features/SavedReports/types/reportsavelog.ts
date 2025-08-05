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
  Admin_confirm: string;
  admin_confirm_event: string;
  admin_confirm_comment: string;
  admin_confirm_date: Date;
  admin_confirm_edit: string;
}

export interface SearchData {
  Search?: string;
  startDate?: string;
  endDate?: string;
  tapData?: string; // Additional field for tap data
}

export interface TabDataState {
  tapData?: string;
  startDate?: string;
  endDate?: string;
  dayHisDate?: number;
}

export interface EditAccept {
  Admin_confirm_edit: string;
  Admin_confirm_comment: string;
  Admin_confirm_event: string;
}

export type MUIColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "inherit";
