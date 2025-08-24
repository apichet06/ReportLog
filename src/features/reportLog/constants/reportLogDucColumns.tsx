
import { fNumber } from "@/shared/utils/formatNumber";
import datetime from "@/shared/utils/handleDatetime";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-premium";
import { StatusIconCell } from "../components/StatusIconCell";
import ColumnHeaderWithInfo from "./ColumnHeaderWithInfo";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

export const getColumnsDUC = (is_view: boolean): GridColDef[] => {
  const columns: GridColDef[] = [

    {
      field: "no",
      headerName: "NO",
      align: "center",
      sortable: false,
      renderHeader: () => <ColumnHeaderWithInfo field="no" label="NO" />,
      headerAlign: "center", flex: 0.5, minWidth: 100,
      renderCell: (params: GridRenderCellParams) => {
        const sortedRowIds = params.api.getSortedRowIds();
        const rowIndex = sortedRowIds.indexOf(params.id);
        return fNumber(rowIndex + 1);
      },
    },
    {
      field: "group_name", headerName: "GROUP NAME", flex: 2, minWidth: 160,
      renderHeader: () => <ColumnHeaderWithInfo field="group_name" label="GROUP NAME" />,
    },
    {
      field: "username", headerName: "USERNAME", flex: 2, minWidth: 140,
      renderHeader: () => <ColumnHeaderWithInfo field="username" label="USERNAME" />,
    },
    {
      field: "action", headerName: "ACTION", minWidth: 140,
      renderHeader: () => <ColumnHeaderWithInfo field="action" label="ACTION" />,
    },
    {
      field: "action_date_time",
      headerName: "ACTION DATE TIME",
      description: "This column has a value getter and is not sortable.",
      sortable: false, flex: 2, minWidth: 160,
      renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time)),
      renderHeader: () => <ColumnHeaderWithInfo field="action_date_time" label="ACTION DATE TIME" />,
    },
    {
      field: "detail", headerName: "DETAIL", flex: 5, minWidth: 500,
      renderHeader: () => <ColumnHeaderWithInfo field="detail" label="DETAIL" />,
    },
    {
      field: "bu", headerName: "BU", flex: 1, minWidth: 140,
      renderCell: (params) => (params.row.bu ?? ''),
      renderHeader: () => <ColumnHeaderWithInfo field="bu" label="BU" />,
    },
    {
      field: "position", headerName: "POSITION", flex: 2, minWidth: 220,
      renderCell: (params) => (params.row.position ?? ''),
      renderHeader: () => <ColumnHeaderWithInfo field="position" label="POSITION" />,
    },
    // {
    //     field: "resigned_date",
    //     headerName: "RESIGNED DATE",
    //     flex: 2, minWidth: 140,
    //     renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
    // },
    // {
    //     field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2, minWidth: 140,
    //     renderCell: (params) => (params.row.days_after_action ?? '')
    // },
    {
      field: "event_type",
      headerName: "EVENT TYPE", flex: 2, minWidth: 150,
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
      renderHeader: () => <ColumnHeaderWithInfo field="event_type" label="EVENT TYPE" />,
    },
    {
      field: "download_more_10_files_day",
      headerName: "LARGE DOWNLOAD (>10)", flex: 2, minWidth: 230,
      renderCell: (params) => <StatusIconCell value={params.value as string} />,
      align: 'center',
      renderHeader: () => <ColumnHeaderWithInfo field="download_more_10_files_day" label="LARGE DOWNLOAD (>10)" />,

    },
    {
      field: "unauthorized",
      headerName: "UNAUTHORIZED", flex: 2, minWidth: 170,
      renderCell: (params) => <StatusIconCell value={params.value as string} />,
      align: 'center',
      renderHeader: () => <ColumnHeaderWithInfo field="unauthorized" label="UNAUTHORIZED" />,
    },
    {
      field: "employee_resigning_within_one_month",
      headerName: "RESIGNING (<1 MO.)", flex: 2, minWidth: 200,// การลาออกของพนักงานภายในหนึ่งเดือน
      renderCell: (params) => <StatusIconCell value={params.value as string} />,
      align: 'center',
      renderHeader: () => <ColumnHeaderWithInfo field="employee_resigning_within_one_month" label="RESIGNING (<1 MO.)" />,
    },

  ];
  if (is_view) {
    columns.push({
      field: "Edit",
      headerName: "",
      headerAlign: "center",
      align: "center",
      flex: 2.5,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Button
            component={Link}
            to={`/reportlog/${Number(params.row.id)}/${params.row.app_log}`}
            variant="outlined"
            color="primary"
            size="small"
            target="_blank"
          >
            <VisibilityIcon />
          </Button>
        );
      },
    });

  }
  return columns;
}
