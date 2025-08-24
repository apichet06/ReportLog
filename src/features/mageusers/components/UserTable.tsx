import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { UsersPermission } from "../types/UsersPermission";
import { Button, Container, } from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import datetime from "@/shared/utils/handleDatetime";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
interface Props {
  rows: UsersPermission[];
  onEdit: (row: UsersPermission) => void;
  onDelete: (id: number) => void;
  isAbove1537: boolean;
  isBetween1201And1536: boolean;
}

export default function UserTable({ rows, onEdit, onDelete, isAbove1537, isBetween1201And1536 }: Props) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "emp_no", headerName: "Emp No", flex: 0.6 },
    { field: "emp_email", headerName: "Email", flex: 1 },
    { field: "fullname", headerName: "Full Name", flex: 1.3 },
    { field: "app_Names", headerName: "App ID", flex: 1 },
    {
      field: "is_email",
      headerName: "is Email",
      renderCell: (params) => params.row.is_email && <DoneIcon />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "is_accept",
      headerName: "is Accept",
      renderCell: (params) => params.row.is_accept && <DoneIcon />,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "is_review",
      headerName: "is Review",
      renderCell: (params) => params.row.is_review && <DoneIcon />,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "is_export",
      headerName: "is Export",
      renderCell: (params) => params.row.is_export && <DoneIcon />,
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    { field: "created_by", headerName: "Created By", flex: 1 },
    {
      field: "created_date",
      headerName: "Created Date",
      renderCell: (params) => datetime.DateTimeLongTH(params.row.created_date),
      flex: 1,
    },
    { field: "updated_by", headerName: "Updated By", flex: 1 },
    {
      field: "updated_date",
      headerName: "Updated Date",
      renderCell: (params) =>
        params.row.updated_date != null
          ? datetime.DateTimeLongTH(params.row.updated_date)
          : "",
      flex: 1,
    },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Magnage",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <Button
            onClick={() => onEdit(params.row)}
            // variant="outlined"
            size="small"
            color="primary"
          >
            {" "}
            <DriveFileRenameOutlineIcon />
          </Button>
          <Button
            onClick={() => onDelete(params.row.id)}
            size="small"
            color="primary"
          >
            <DeleteIcon />
          </Button>
        </>
      ),
      flex: 1.3,
    },
  ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <Container
      fixed
      disableGutters
      maxWidth={isAbove1537 ? "xl" : "lg"}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[5, 10, 15, 20, 40, 60, 80, 100]}
        disableColumnSorting
        disableColumnFilter
        disableColumnMenu
        showToolbar
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
            excelOptions: {
              disableToolbarButton: false,
            },
          },
        }}
        sx={{
          ...(isAbove1537 ? { marginInline: "-9%" } : {}),
          ...(isBetween1201And1536
            ? { marginInline: "-10%" }
            : {}),
          "& .row--highlight": {
            bgcolor: "rgba(255,165,0,0.1)",
            color: "orange",
            "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" },
          },
          fontSize: "12px",
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
      />
    </Container>
  );
}
