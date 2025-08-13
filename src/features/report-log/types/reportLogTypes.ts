import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type {
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid-premium";

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
  is_bu_dcc: string;
  admin_confirm: string;
  admin_confirm_comment: string;
  admin_confirm_event: string;
  admin_confirm_date: string;
}

export interface AcceptById {
  Admin_confirm: string;
  Admin_confirm_comment: string;
  Admin_confirm_event: string;
}

export interface TabDataState {
  tapData?: string;
  startDate?: string;
  endDate?: string;
  dayHisDate?: number;
  checkBoxkUsual?: string;
  checkBoxkUnusual?: string;
}

export type MUIColor =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface ReportLogState {
  colerTodayduc: MUIColor;
  setColerTodayDuc: (value: MUIColor) => void;

  colerHistoryduc: MUIColor;
  setColerHistoryDuc: (value: MUIColor) => void;

  rowDatas: GridRowId[];
  setRowDatas: (value: GridRowId[]) => void;

  conment: string;
  setComment: (value: string) => void;

  valueRedio: string;
  setValueRedio: (value: string) => void;
  handleChangeRedio: (event: ChangeEvent<HTMLInputElement>) => void;

  selectionModel: GridRowSelectionModel;
  setSelectionModel: (value: GridRowSelectionModel) => void;

  open: boolean;
  setOpen: (value: boolean) => void;

  paginationModel: { page: number; pageSize: number };
  setPaginationModel: (value: { page: number; pageSize: number }) => void;

  dayHisDatedcc: number; // สมมติเป็น 0 หรือ 1
  setDayHisDatedcc: Dispatch<SetStateAction<number>>;

  dayHisDateduc: number; // สมมติเป็น 0 หรือ 1
  setDayHisDateduc: Dispatch<SetStateAction<number>>;

  textSearch: string;
  setTextSearch: Dispatch<SetStateAction<string>>;

  tapData: string;
  setTapData: Dispatch<SetStateAction<string>>;

  setLoadingDataGrid: Dispatch<SetStateAction<boolean>>;
  loadingDataGrid: boolean;

  loadingExport: boolean;

  setLoadingExport: Dispatch<SetStateAction<boolean>>;
  setDataDUC: Dispatch<SetStateAction<ReportLog[]>>;
  setDataDCC: Dispatch<SetStateAction<ReportLog[]>>;
  dataDuc: ReportLog[];
  dataDcc: ReportLog[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  editingId: number | null;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  data: ReportLog | null;
  setData: Dispatch<SetStateAction<ReportLog | null>>;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  setCheckBoxUnusual: Dispatch<SetStateAction<string>>;
  setCheckBoxUsual: Dispatch<SetStateAction<string>>;
  checkBoxkUsual: string;
  checkBoxkUnusual: string;
}

export interface SearchData {
  Search?: string;
  startDate?: string;
  endDate?: string;
  tapData?: string; // Additional field for tap data
  dayHisDate?: number; // ToDay and History
  checkBoxkUsual?: string;
  checkBoxkUnusual?: string;
}
