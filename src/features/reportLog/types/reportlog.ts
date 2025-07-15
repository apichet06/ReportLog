export interface ReportLog {
  id: number;
  group_name: string;
  username: string;
  action: string;
  action_date_time: string;
  detail: string; //  รายละเอียด
  bu: string; // business unit
  position: string; // ตำแหน่ง
  resigned_date: string;
  days_after_action: number;
  event_type: string; //ปกติ - ไม่ปกติ
  unauthorized: string;
  download_more_10_files_day: string; // ดาวน์โหลดมากกว่า 10 files
  employee_resigning_within_one_month: string; //พนักงานลาออกภายในหนึ่งเดือน
}
