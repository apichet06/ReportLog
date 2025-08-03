// src/features/report-log/components/ReportLogDataGrid.tsx
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import type { ReportLog } from "../types/reportlog";

interface Props {
    columns: GridColDef[];
    rows: ReportLog[];
    rowCount: number;
    loading: boolean;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
}

export default function ReportLogDataGrid({
    columns,
    rows,
    rowCount,
    loading,
    paginationModel,
    onPaginationModelChange,
}: Props) {
    return (
        <Box sx={{ height: 650 }}>
            <DataGrid
                columns={columns}
                rows={rows}
                rowCount={rowCount}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                loading={loading}
                disableColumnMenu
            />
        </Box>
    );
}
