import { fNumber } from "@/shared/utils/formatNumber";
import datetime from "@/shared/utils/handleDatetime";

import Button from "@mui/material/Button";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { StatusIconCell } from "../components/StatusIconCell";
import ColumnHeaderWithInfo from "./ColumnHeaderWithInfo";



export const getColumnsDCC = (handleSubmit: (id: number) => void): GridColDef[] => [
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
    {
        field: "is_bu_dcc",
        headerName: "IS BU DCC", flex: 2, minWidth: 140,
        renderCell: (params) => <StatusIconCell value={params.value as string} />,
        align: 'center',
        renderHeader: () => <ColumnHeaderWithInfo field="is_bu_dcc" label="IS BU DCC" />,
    },
    {
        field: "admin_confirm",
        headerName: "CONFIRMED BY", flex: 2, minWidth: 180,
        renderCell: (params) => (params.row.admin_confirm == ' ' ? '' : params.row.admin_confirm),
        renderHeader: () => <ColumnHeaderWithInfo field="admin_confirm" label="CONFIRMED BY" />,
    },
    {
        field: "admin_confirm_date",
        headerName: "CONFIRMED DATE", flex: 2, minWidth: 210,
        renderCell: (params) => (params.row.admin_confirm_date ? datetime.DateTimeLongTH(params.row.admin_confirm_date) : ''),
        renderHeader: () => <ColumnHeaderWithInfo field="admin_confirm_date" label="ADMIN CONFIRM DATE" />,
    },
    {
        field: "admin_confirm_edit", headerName: "EDITED BY", flex: 2, minWidth: 180,
        renderCell: (params) => (params.row.admin_confirm_edit == ' ' ? '' : params.row.admin_confirm_edit),
        renderHeader: () => <ColumnHeaderWithInfo field="admin_confirm_edit" label="EDITED BY" />,
    },
    {
        field: "admin_edit_confirm_date", // แก้ไข field ที่ซ้ำกัน
        headerName: "EDIT DATE", flex: 2, minWidth: 170,
        renderCell: (params) => (params.row.admin_edit_confirm_date ? datetime.DateTimeLongTH(params.row.admin_edit_confirm_date) : ''),
        renderHeader: () => <ColumnHeaderWithInfo field="admin_edit_confirm_date" label="EDIT DATE" />,

    },
    {
        field: "admin_confirm_comment", headerName: "COMMENT", flex: 2, minWidth: 200,
        renderCell: (params) => (params.row.admin_confirm_comment == "" ? '' : params.row.admin_confirm_comment),
        renderHeader: () => <ColumnHeaderWithInfo field="admin_confirm_comment" label="COMMENT" />,
    },
    {
        field: "admin_confirm_event", headerName: "CONFIRMED EVENT", flex: 2, minWidth: 190,
        renderCell: (params) => {
            const admin_confirm_event = params.value as string;
            return (
                <span
                    style={{ color: admin_confirm_event === "Unusual Event" ? "red" : "inherit" }}
                >
                    {admin_confirm_event}
                </span>
            );
        },
        renderHeader: () => <ColumnHeaderWithInfo field="admin_confirm_event" label="CONFIRMED EVENT" />,
    },
    {
        field: "manage",
        headerName: "",
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