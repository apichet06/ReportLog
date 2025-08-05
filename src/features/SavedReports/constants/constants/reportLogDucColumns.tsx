
import { fNumber } from "@/shared/utils/formatNumber";
import datetime from "@/shared/utils/handleDatetime";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const StatusIconCell = ({ value }: { value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    {value === "Y" ? (
      <img src={"/img/alert.png"} width={"20px"} height={"20px"} alt="Alert" />
    ) : (
      <img src={"/img/success.png"} width={"20px"} height={"20px"} alt="Success" />
    )}
  </Box>
);


export const getColumnsDUC = (handleSubmit: (id: number) => void): GridColDef[] => [
  {
    field: "no",
    headerName: "ID",
    align: "center",
    headerAlign: "center", flex: 0.5, minWidth: 60,
    renderCell: (params: GridRenderCellParams) => {
      const sortedRowIds = params.api.getSortedRowIds();
      const rowIndex = sortedRowIds.indexOf(params.id);
      return fNumber(rowIndex + 1);
    },
  },
  { field: "group_name", headerName: "GROUP NAME", flex: 2, minWidth: 140, },
  { field: "username", headerName: "USERNAME", flex: 2, minWidth: 140, },
  {
    field: "action",
    headerName: "ACTION",
    minWidth: 140,
  },
  {
    field: "action_date_time",
    headerName: "ACTION DATE TIME",
    description: "This column has a value getter and is not sortable.",
    sortable: false, flex: 2, minWidth: 140,

    renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
  },
  { field: "detail", headerName: "DETAIL", flex: 5, minWidth: 240, },
  { field: "bu", headerName: "BU", flex: 1, minWidth: 140 },
  { field: "position", headerName: "POSITION", flex: 2, minWidth: 220, },
  {
    field: "resigned_date",
    headerName: "RESIGNED DATE",
    flex: 2, minWidth: 140,
    renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
  },
  { field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2, minWidth: 140, },
  {
    field: "event_type",
    headerName: "EVENT TYPE", flex: 2, minWidth: 140,
    renderCell: (params) => {
      const event_type = params.value as string;
      return (
        <span
          style={{ color: event_type === "Unusual Event" ? "red" : "inherit" }}
        >
          {event_type}
        </span>
      );
    },
  },
  {
    field: "download_more_10_files_day",
    headerName: "LARGE DOWNLOAD (>10)", flex: 2, minWidth: 200,
    renderCell: (params) => <StatusIconCell value={params.value as string} />,
    align: 'center'
  },
  {
    field: "unauthorized",
    headerName: "UNAUTHORIZED", flex: 2, minWidth: 120,
    renderCell: (params) => <StatusIconCell value={params.value as string} />,
    align: 'center'
  },
  {
    field: "employee_resigning_within_one_month",
    headerName: "RESIGNING (<1 MO.)", flex: 2, minWidth: 140,// การลาออกของพนักงานภายในหนึ่งเดือน
    renderCell: (params) => <StatusIconCell value={params.value as string} />,
    align: 'center'
  },
  {
    field: "admin_confirm",
    headerName: "CONFIRMED BY", flex: 2, minWidth: 140,
  },
  {
    field: "admin_confirm_date",
    headerName: "CONFIRMED DATE", flex: 2, minWidth: 140,
    renderCell: (params) => (params.row.admin_confirm_date ? datetime.DateTimeLongTH(params.row.admin_confirm_date) : '')
  },
  {
    field: "admin_confirm_edit", headerName: "EDITED BY", flex: 2, minWidth: 140
  },
  {
    field: "admin_edit_confirm_date", // แก้ไข field ที่ซ้ำกัน
    headerName: "EDIT DATE", flex: 2, minWidth: 120,
    renderCell: (params) => (params.row.admin_edit_confirm_date ? datetime.DateTimeLongTH(params.row.admin_edit_confirm_date) : '')
  },
  { field: "admin_confirm_comment", headerName: "COMMENT", flex: 2, minWidth: 140 },
  { field: "admin_confirm_event", headerName: "CONFIRMED EVENT", flex: 2, minWidth: 140 },
  {
    field: "manage",
    headerName: "EDIT",
    headerAlign: "center",
    align: "center",
    flex: 2.5,
    minWidth: 100,
    renderCell: (params) => {
      return (
        <Button variant="outlined" size="small" color="primary" onClick={() => handleSubmit(Number(params.id))} ><DriveFileRenameOutlineIcon /></Button>
      );
    },
  },

];