import { fNumber } from "@/shared/utils/formatNumber";
import datetime from "@/shared/utils/handleDatetime";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid-premium";
import { StatusIconCell } from "../components/StatusIconCell";


export const columnsDCC: GridColDef[] = [
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
    { field: "bu", headerName: "BU", flex: 3, minWidth: 140, },
    { field: "position", headerName: "POSITION", flex: 2, minWidth: 220 },
    {
        field: "resigned_date", headerName: "RESINGNED DATE", flex: 2, minWidth: 150,
        renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
    },
    { field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2, minWidth: 150 },
    {
        field: "event_type",
        headerName: "EVENT TYPE", flex: 2, minWidth: 130,
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
];