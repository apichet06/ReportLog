import { DataGridPremium, type GridColDef, type GridPaginationModel, type GridRowSelectionModel } from "@mui/x-data-grid-premium";
// import { columnsDuc } from "../constants/reportLogDucColumns";
import type { ReportLog } from "../types/reportLogTypes";

interface ReportLogTableProps {
    rows: ReportLog[]; // หรือใช้ type ของ row ที่คุณมี
    loading: boolean;
    selectionModel: GridRowSelectionModel;
    setSelectionModel: (model: GridRowSelectionModel) => void;
    paginationModel: GridPaginationModel;
    setPaginationModel: (model: GridPaginationModel) => void;

    isAbove1537: boolean;
    isBetween1201And1536: boolean;
    columns: GridColDef[];
}

export function ReportLogTable({ rows, loading, setSelectionModel, paginationModel, setPaginationModel, isAbove1537, isBetween1201And1536, columns }: ReportLogTableProps) {
    return (
        <DataGridPremium
            getRowId={(row) => row.id.toString()}
            loading={loading}
            rows={rows}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            initialState={{
                pinnedColumns: { left: ['__check__', 'no'], right: ['event_type', 'Edit'] }
            }}
            pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
            getRowClassName={(params) =>
                params.row.unauthorized === "Y" ||
                    params.row.download_more_10_files_day === "Y" ||
                    params.row.employee_resigning_within_one_month === "Y"
                    ? "row--highlight"
                    : ""
            }
            showToolbar={true}
            slotProps={{
                toolbar: {
                    csvOptions: { disableToolbarButton: true },
                    printOptions: { disableToolbarButton: true },
                    excelOptions: {
                        // ระบุ fields ที่ต้องการ export ตามลำดับ
                        // แก้ไข 'id' เป็น 'no' เพื่อให้ตรงกับ field ของคอลัมน์ ID
                        fields: ['no', 'group_name', 'username', 'action', 'action_date_time', 'detail', 'bu', 'position', 'resigned_date', 'days_after_action', 'event_type', 'download_more_10_files_day', 'unauthorized', 'employee_resigning_within_one_month', 'is_bu_dcc', 'admin_confirm', 'admin_confirm_date', 'admin_confirm_edit', 'admin_edit_confirm_date', 'admin_confirm_comment', 'admin_confirm_event']
                    }
                },
            }}
            sx={{
                ...(isAbove1537 ? { marginInline: '-9%' } : {}),
                ...(isBetween1201And1536 ? { marginInline: '-10%' } : {}),
                "& .row--highlight": {
                    bgcolor: "rgba(255,165,0,0.1)",
                    color: "orange",
                    "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" },
                },
                fontSize: "12px",
            }}

        />
    );
}
