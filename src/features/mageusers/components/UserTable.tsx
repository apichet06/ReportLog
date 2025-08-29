import { DataGridPremium, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid-premium";
import type { UsersPermission } from "../types/UsersPermission";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import datetime from "@/shared/utils/handleDatetime";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";
import { fNumber } from "@/shared/utils/formatNumber";
import ColumnHeaderWithInfo from "../constants/ColumnHeaderWithInfo";
interface Props {
  rows: UsersPermission[];
  onEdit: (row: UsersPermission) => void;
  onDelete: (id: number) => void;
  isAbove1537: boolean;
  isBetween1201And1536: boolean;
}

export default function UserTable({ rows, onEdit, onDelete, isAbove1537, isBetween1201And1536 }: Props) {
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
      field: "emp_no", headerName: "Emp No", minWidth: 100,
      renderHeader: () => <ColumnHeaderWithInfo field="emp_no" label="Emp No" />,
    },
    {
      field: "emp_email", headerName: "Email", minWidth: 180,
      renderHeader: () => <ColumnHeaderWithInfo field="emp_email" label="Email" />,
    },
    {
      field: "plant_Name", headerName: "Plant Name", minWidth: 120,
      renderHeader: () => <ColumnHeaderWithInfo field="plant_name" label="Plant Name" />,
    },
    {
      field: "fullname", headerName: "Full Name", minWidth: 190,
      renderHeader: () => <ColumnHeaderWithInfo field="fullname" label="FullName" />,
    },

    {
      field: "app_Names", headerName: "App ID", minWidth: 100,
      renderHeader: () => <ColumnHeaderWithInfo field="app_Names" label="App Name" />,
    },
    {
      field: "is_email",
      headerName: "is Email",
      renderCell: (params) => params.row.is_email && <DoneIcon />,
      renderHeader: () => <ColumnHeaderWithInfo field="is_email" label="Is Email" />,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "is_accept",
      headerName: "is Accept",
      renderCell: (params) => params.row.is_accept && <DoneIcon />,
      renderHeader: () => <ColumnHeaderWithInfo field="is_accept" label="Is Accept" />,
      align: "center",
      headerAlign: "center",
      minWidth: 100
    },
    {
      field: "is_review",
      headerName: "is Review",
      renderCell: (params) => params.row.is_review && <DoneIcon />,
      renderHeader: () => <ColumnHeaderWithInfo field="is_review" label="Is Review" />,
      align: "center",
      headerAlign: "center",
      minWidth: 100
    },
    {
      field: "is_export",
      headerName: "is Export",
      renderCell: (params) => params.row.is_export && <DoneIcon />,
      renderHeader: () => <ColumnHeaderWithInfo field="is_export" label="Is Export" />,
      align: "center",
      headerAlign: "center",
      minWidth: 100
    },
    {
      field: "created_by", headerName: "Created By", minWidth: 100,
      renderHeader: () => <ColumnHeaderWithInfo field="created_by" label="Created By" />,
    },
    {
      field: "created_date",
      headerName: "Created Date",
      renderCell: (params) => datetime.DateTimeLongTH(params.row.created_date),
      renderHeader: () => <ColumnHeaderWithInfo field="created_date" label="Created Date" />,
      minWidth: 130
    },
    {
      field: "updated_by", headerName: "Updated By", minWidth: 120,
      renderHeader: () => <ColumnHeaderWithInfo field="updated_by" label="Updated By" />,
    },
    {
      field: "updated_date",
      headerName: "Updated Date",
      renderCell: (params) =>
        params.row.updated_date != null
          ? datetime.DateTimeLongTH(params.row.updated_date)
          : "",
      renderHeader: () => <ColumnHeaderWithInfo field="updated_date" label="Updated Date" />,
      minWidth: 120
    },
    {
      field: "status", headerName: "Status", minWidth: 100,
      renderHeader: () => <ColumnHeaderWithInfo field="status" label="Status" />,
    },
    {
      field: "actions",
      headerName: "",
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
      minWidth: 150
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
        disableColumnSorting
        disableColumnFilter
        disableColumnMenu
        pagination
        showToolbar
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
            excelOptions: {
              disableToolbarButton: true,
            },
          },
        }}
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
        }}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
      />
    </Container>
  );
}
