import { fNumber } from "@/shared/utils/formatNumber";
import datetime from "@/shared/utils/handleDatetime";
import type { GridColDef, } from "@mui/x-data-grid-premium";
import { StatusIconCell } from "../components/StatusIconCell";

import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const columnsDCC: GridColDef[] = [
    {
        field: "no",
        headerName: "ID",
        align: "center",
        headerAlign: "center", flex: 0.5,
        renderCell: (row) => fNumber(row.row.no), sortable: true,
        // renderCell: (params: GridRenderCellParams) => {
        //     const { page, pageSize } = params.api.state.pagination.paginationModel;
        //     const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        //     const rowNumber = page * pageSize + rowIndex + 1;
        //     return fNumber(rowNumber);
        // },

        minWidth: 70
    },
    { field: "group_name", headerName: "GROUP NAME", flex: 2, minWidth: 170 },
    { field: "username", headerName: "USERNAME", minWidth: 170 },
    {
        field: "action",
        headerName: "ACTION",
        flex: 2.2,
        minWidth: 130
    },
    {
        field: "action_date_time",
        headerName: "ACTION DATE TIME",
        description: "This column has a value getter and is not sortable.",
        sortable: false, flex: 2, minWidth: 140,
        renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
    },
    { field: "detail", headerName: "DETAIL", flex: 5, minWidth: 500, },
    {
        field: "bu", headerName: "BU", flex: 1, minWidth: 140,
        renderCell: (params) => (params.row.bu ?? '-')
    },
    {
        field: "position", headerName: "POSITION", flex: 2, minWidth: 220,
        renderCell: (params) => (params.row.position ?? '-')
    },
    {
        field: "resigned_date",
        headerName: "RESIGNED DATE",
        flex: 2, minWidth: 140,
        renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '-')
    },
    {
        field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2, minWidth: 140,
        renderCell: (params) => (params.row.days_after_action ?? '-')
    },
    {
        field: "event_type",
        headerName: "EVENT TYPE", flex: 2, minWidth: 110,
        renderCell: (params) => {
            const even_type = params.value as string;
            return (
                <span style={{ color: even_type == "Unusual Event" ? "red" : "inherit" }}  >
                    {even_type}
                </span>
            );
        },
    },
    {
        field: "download_more_10_files_day",
        headerName: "LARGE DOWNLOAD (>10)", flex: 2, minWidth: 180,
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
        field: "is_bu_dcc",
        headerName: "IS BU DCC", flex: 2, minWidth: 100,
        renderCell: (params) => <StatusIconCell value={params.value as string} />,
        align: 'center'
    },
    {
        field: "Edit",
        headerName: "VIEW EDIT",
        headerAlign: "center",
        align: "center",
        flex: 2.5,
        minWidth: 100,
        renderCell: (params) => {
            return (
                <Button
                    component={Link}
                    to={`/report-log/${Number(params.row.id)}/${params.row.app_log}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                    target="_blank"
                >
                    <VisibilityIcon />
                </Button>
            );
        },
    },
];