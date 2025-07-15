import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { DataGrid, GridSearchIcon, type GridColDef } from "@mui/x-data-grid";
import type { ReportSaveLog } from "../types/reportsavelog";
import DateLongTH from "@/shared/utils/handleDatetime";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
export default function Saved_Reports() {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
    },
    { field: "group_name", headerName: "GROUP NAME", width: 130 },
    { field: "username", headerName: "USERNAME", width: 130 },
    { field: "action", headerName: "ACTION", width: 130 },
    // {
    //   field: "action",
    //   headerName: "ACTION",
    //   type: "string",
    //   width: 90,
    //   renderCell: (params) => {
    //     const age = params.value as number; // 👈 ยืนยันว่าเป็น number
    //     return (
    //       <span style={{ color: age > 35 ? "red" : "inherit" }}>{age}</span>
    //     );
    //   },
    // },
    {
      field: "action_date_time",
      headerName: "ACTION DATE TIME",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (_value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
    { field: "detail", headerName: "DETAIL", width: 400 },
    { field: "bu", headerName: "BU", width: 160 },
    { field: "position", headerName: "POSITION", width: 160 },
    { field: "resigned_date", headerName: "RESINGNED DATE", width: 130 },
    { field: "days_after_action", headerName: "DAY AFTER ACTION", width: 160 },
    { field: "event_type", headerName: "EVENT TYPE", width: 140 },
    {
      field: "download_more_10_files_day",
      headerName: "DOWNLOAD MORE 10 FILES DAY",
      width: 160,
    },
    {
      field: "unauthorized",
      headerName: "UNAUTHORIZED",
      width: 140,
    },
    {
      field: "employee_resigning_within_one_month",
      headerName: "EMPLOYEE RESINGING WITHHIN ONE MONTH",
      width: 160,
    },
  ];

  const rows: ReportSaveLog[] = [
    {
      id: 1,
      group_name: "Snow",
      username: "Jon",
      action: "35",
      action_date_time: DateLongTH(new Date()),
      detail:
        "CB_CISCO_OTBU/Supplier_Cisco_OTBU/Poomjai/FIXTURE DIS ASSEMBLY P04-GROUP 6_2024-12-17.zip",
      bu: "CB-CISCO-CRBU",
      position: "Process Engineer 2",
      resigned_date: DateLongTH(new Date()),
      days_after_action: 134,
      event_type: "Usual Event",
      unauthorized: "N",
      download_more_10_files_day: "N",
      employee_resigning_within_one_month: "N",
    },
    {
      id: 2,
      group_name: "Snow",
      username: "Jon",
      action: "34",
      action_date_time: DateLongTH(new Date()),
      detail:
        "CB_CISCO_OTBU/Supplier_Cisco_OTBU/Poomjai/FIXTURE DIS ASSEMBLY P04-GROUP 6_2024-12-17.zip",
      bu: "CB-CISCO-CRBU",
      position: "Process Engineer 2",
      resigned_date: DateLongTH(new Date()),
      days_after_action: 134,
      event_type: "Usual Event",
      unauthorized: "N",
      download_more_10_files_day: "N",
      employee_resigning_within_one_month: "N",
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, sm: 12, md: 11, lg: 12, xl: 11 }}>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { width: "100%" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Grid size={11}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Search"
                    type="search"
                    size="small"
                  />
                </Grid>
                <Grid
                  size={1}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button variant="contained">
                    <GridSearchIcon />
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Box>
          <hr />
          <h2>Saved DCC & DUC Reports</h2>
          <Paper sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              getRowClassName={(params) =>
                params.row.action >= 35 ? "row--highlight" : ""
              }
              sx={{
                // ถ้าต้องการให้ "ทั้งแถว" สีเขียว (พื้นหลัง + ตัวอักษร)
                "& .row--highlight": {
                  bgcolor: "rgba(255,165,0,0.1)", // พื้นหลังเขียวอ่อน (ปรับได้)
                  color: "green", // สีตัวอักษร
                  "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" }, // hover color
                },
                fontSize: "12px",
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
