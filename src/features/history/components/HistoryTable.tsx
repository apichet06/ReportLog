import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import ColumnHeaderWithInfo from "../constants/ColumnHeaderWithInfo";
import { fNumber } from "@/shared/utils/formatNumber";
import Container from '@mui/material/Container';
import { DataGridPremium } from "@mui/x-data-grid-premium";
import type { Histotys } from "../types/historyType";
import { useState } from "react";
import datetime from "@/shared/utils/handleDatetime";
// import Typography from '@mui/material/Typography';
interface Props {
    rows: Histotys[];
    isAbove1537: boolean;
    isBetween1201And1536: boolean;
    loading: boolean;
}

export default function HistoryTable({ rows, isAbove1537, isBetween1201And1536, loading }: Props) {

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
            field: "emp_no", headerName: "Emp No", flex: 0.5, minWidth: 100,
            renderHeader: () => <ColumnHeaderWithInfo field="emp_no" label="Emp No" />,
        },
        {
            field: "fullname", headerName: "Full Name", flex: 0.5, minWidth: 180,
            renderHeader: () => <ColumnHeaderWithInfo field="fullname" label="Full Name" />,

        },
        {
            field: "processType", headerName: "Process", flex: 0.5, minWidth: 140,
            renderHeader: () => <ColumnHeaderWithInfo field="processType" label="ProcessType" />,

        },
        {
            field: "comment", headerName: "Comment", flex: 0.5, minWidth: 300,
            renderHeader: () => <ColumnHeaderWithInfo field="comment" label="Comment" />,
        },
        {
            field: "app_log", headerName: "App Name", flex: 0.5, minWidth: 100,
            renderHeader: () => <ColumnHeaderWithInfo field="app_log" label="App Name" />,
        },
        {
            field: "action", headerName: "Action", flex: 0.5, minWidth: 150,
            renderHeader: () => <ColumnHeaderWithInfo field="action" label="Action" />,
        },
        {
            field: "details", headerName: "Detail", flex: 0.5, minWidth: 620,
            renderHeader: () => <ColumnHeaderWithInfo field="details" label="Details" />,
        },
        {
            field: "action_datetime", headerName: "Action Date", flex: 0.5, minWidth: 120,
            renderCell: (params) =>
                params.row.action_datetime != null
                    ? datetime.DateTimeLongTH(params.row.action_datetime)
                    : "",
            renderHeader: () => <ColumnHeaderWithInfo field="action_datetime" label="Action Date" />,
        },

    ];


    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10
    });

    return (
        <Container
            fixed
            disableGutters
            maxWidth={isAbove1537 ? "xl" : "lg"}
        >
            <DataGridPremium
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[5, 10, 15, 20, 40, 60, 80, 100]}
                disablePivoting
                loading={loading}
                disableColumnSorting
                disableColumnFilter
                disableColumnMenu
                pagination
                initialState={{
                    pinnedColumns: {
                        left: ["no"],
                        right: ["actions"],
                    },
                }}
                sx={{
                    ...(isAbove1537 ? { marginInline: "-9%" } : {}),
                    ...(isBetween1201And1536
                        ? { marginInline: "-10%" }
                        : {}),
                    fontSize: "12px",
                    // "& .MuiDataGrid-cell[data-field='no'],& .MuiDataGrid-cell[data-field='emp_no']": { color: "#696969" },
                    // "& .MuiDataGrid-cell[data-field='fullname'],& .MuiDataGrid-cell[data-field='processType']": { color: "#696969" },
                    // "& .MuiDataGrid-cell[data-field='comment'],& .MuiDataGrid-cell[data-field='action_datetime']": { color: "#696969" },
                    // "& .MuiDataGrid-cell[data-field='app_log'],& .MuiDataGrid-cell[data-field='action']": { color: "#669999" },
                    // "& .MuiDataGrid-cell[data-field='details']": { color: "#669999" }
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(model) => setPaginationModel(model)}
            />
        </Container>
    );

}