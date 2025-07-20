import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useCallback, useEffect, useState } from "react";
import reportLogService from "../service/reportlogService";
import type { ReportLog } from "../types/reportlog";
import Swal from "sweetalert2";
import datetime from "@/shared/utils/handleDatetime";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { fNumber } from "@/shared/utils/formatNumber";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
export default function ReportLogPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [] as unknown as GridRowSelectionModel
  );


  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);

  const [data, SetData] = useState<ReportLog[]>();
  const [textSearch, SetTextSearch] = useState<string>("");
  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: "ID",
      width: 70,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams) => {
        const sortedRowIds = params.api.getSortedRowIds();
        const rowIndex = sortedRowIds.indexOf(params.id);
        return fNumber(rowIndex + 1);
      },
    },
    { field: "group_name", headerName: "GROUP NAME", width: 130 },
    { field: "username", headerName: "USERNAME", width: 130 },
    {
      field: "action",
      headerName: "ACTION",
      width: 90,
    },
    {
      field: "action_date_time",
      headerName: "ACTION DATE TIME",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
    },
    { field: "detail", headerName: "DETAIL", width: 400 },
    { field: "bu", headerName: "BU", width: 160 },
    { field: "position", headerName: "POSITION", width: 160 },
    {
      field: "resigned_date", headerName: "RESINGNED DATE", width: 130,
      renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
    },
    { field: "days_after_action", headerName: "DAY AFTER ACTION", width: 160 },
    {
      field: "event_type",
      headerName: "EVENT TYPE",
      width: 140,
      renderCell: (params) => {
        const even_type = params.value as string; // 👈 ยืนยันว่าเป็น number
        return (
          <span
            style={{ color: even_type == "Unusual Event" ? "red" : "inherit" }}
          >
            {even_type}
          </span>
        );
      },
    },
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


  const fetchDUC = useCallback(async () => {
    try {
      setLoading(true)
      const res = await reportLogService.GetReportLogService();
      console.log(res.data.result);
      SetData(res.data.result);
      setLoading(false)
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportLogService.SearchReportLogService({ Search: textSearch, startDate, endDate });
      SetData(res.data.result)
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [textSearch, startDate, endDate]);

  useEffect(() => {
    fetchDUC();
  }, [fetchDUC]);



  const paginationModel = { page: 0, pageSize: 5 };

  const hendleSubmit = async () => {
    const rawData = Array.isArray(selectionModel)
      ? selectionModel
      : Array.from(selectionModel.ids);

    if (rawData.length === 0) {
      Swal.fire({
        title: "No rows selected!",
        icon: "error",
      });
      return;
    }
    const numericIds = rawData.map((id) => Number(id));

    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Success!",
            icon: "success",
          });
          await reportLogService.ApprovedReportLogService(numericIds);
          fetchDUC();
        }
      });

    } catch (err) {
      console.error(err);

    }
  };


  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Grid container spacing={2} justifyContent="center">

        {loading ?
          <Stack spacing={2} sx={{ color: 'grey.500' }} direction="row" alignItems="center">
            <CircularProgress color="inherit" size={200} thickness={2} />
          </Stack>
          :
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 11 }}>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { width: "100%" } }}
              noValidate
              autoComplete="off"
            >

              <Grid
                container
                spacing={2}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Grid size={6}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Search ALL"
                    type="search"
                    size="small"
                    onChange={(e) => SetTextSearch(e.target.value)}
                  />
                </Grid>
                <Grid size={5} sx={{ mb: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker', 'DatePicker']}>
                      <Grid container spacing={4}>
                        <Grid size={6} >
                          <DatePicker
                            label="Form"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            disableFuture
                          />
                        </Grid>
                        <Grid size={6}>
                          <DatePicker
                            label="TO"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            disableFuture
                          />
                        </Grid>
                      </Grid>
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid
                  size={1}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button variant="contained" onClick={() => handleSearch()}>
                    <SearchIcon />
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <hr />
            <h2>Report Log DCC & DUC</h2>

            <Paper sx={{ width: "100%" }}>
              <DataGrid
                getRowId={(row) => row.id.toString()}
                loading={loadingDataGrid}
                rows={data}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) =>
                  setSelectionModel(newSelection)
                }
                getRowClassName={(params) =>
                  params.row.unauthorized == "Y" ||
                    params.row.download_more_10_files_day == "Y" ||
                    params.row.employee_resigning_within_one_month == "Y"
                    ? "row--highlight"
                    : ""
                }
                sx={{
                  // ถ้าต้องการให้ "ทั้งแถว" สีเขียว (พื้นหลัง + ตัวอักษร)
                  "& .row--highlight": {
                    bgcolor: "rgba(255,165,0,0.1)", // พื้นหลังเขียวอ่อน (ปรับได้)
                    color: "orange", // สีตัวอักษร
                    "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" }, // hover color
                  },
                  fontSize: "12px",
                }}
              />
            </Paper>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="success" onClick={hendleSubmit}>
                <SaveIcon />
                submit to save
              </Button>
            </Box>
          </Grid>
        }
      </Grid>
    </Container>
  );
}
