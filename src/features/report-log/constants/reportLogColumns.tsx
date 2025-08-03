
import { fNumber } from "@/shared/utils/formatNumber";
import datetime from "@/shared/utils/handleDatetime";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const columnsDuc: GridColDef[] = [
  {
    field: "no",
    headerName: "ID",

    align: "center",
    headerAlign: "center", flex: 0.5,
    renderCell: (params: GridRenderCellParams) => {
      const sortedRowIds = params.api.getSortedRowIds();
      const rowIndex = sortedRowIds.indexOf(params.id);
      return fNumber(rowIndex + 1);
    },
  },
  { field: "group_name", headerName: "GROUP NAME", flex: 2 },
  { field: "username", headerName: "USERNAME", flex: 2 },
  {
    field: "action",
    headerName: "ACTION",
    flex: 2,
  },
  {
    field: "action_date_time",
    headerName: "ACTION DATE TIME",
    description: "This column has a value getter and is not sortable.",
    flex: 2,

    renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
  },
  { field: "detail", headerName: "DETAIL", flex: 5 },
  { field: "bu", headerName: "BU", flex: 1, },
  { field: "position", headerName: "POSITION", flex: 2, },
  {
    field: "resigned_date", headerName: "RESINGNED DATE", flex: 2,
    renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
  },
  { field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2 },
  {
    field: "event_type",
    headerName: "EVENT TYPE", flex: 2,
    renderCell: (params) => {
      const even_type = params.value as string;
      return (
        <span style={{ color: even_type == "Unusual Event" ? "red" : "inherit" }}
        >
          {even_type}
        </span>
      );
    },
  },
  {
    field: "download_more_10_files_day",
    headerName: "DOWNLOAD MORE 10 FILES DAY", flex: 2,
    renderCell: (params) => {
      const download_more_10_files_day = params.value as string;
      return (
        <span >
          {download_more_10_files_day == "Y" ?
            <img src={"img/alert.png"} width={"20px"} height={"20px"} />
            : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
        </span>
      );
    },
    align: 'center'
  },
  {
    field: "unauthorized",
    headerName: "UNAUTHORIZED", flex: 2,
    renderCell: (params) => {
      const unauthorized = params.value as string;
      return (
        <span >
          {unauthorized == "Y" ?
            <img src={"img/alert.png"} width={"20px"} height={"20px"} />
            : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
        </span>
      );
    },
    align: 'center'
  },
  {
    field: "employee_resigning_within_one_month",
    headerName: "EMPLOYEE RESINGING WITHHIN ONE MONTH", flex: 2,
    renderCell: (params) => {
      const employee_resigning_within_one_month = params.value as string;
      return (
        <span >
          {employee_resigning_within_one_month == "Y" ?
            <img src={"img/alert.png"} width={"20px"} height={"20px"} />
            : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
        </span>
      );
    },
    align: 'center'
  }
];