import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import datetime from "@/shared/utils/handleDatetime";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useState } from "react";
import reportSaveLog from "../service/saveReposrtService";
import type { ReportSaveLog } from "../types/reportsavelog";
import type { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import Container from '@mui/material/Container';
import { fNumber } from "@/shared/utils/formatNumber";

export default function Saved_Reports() {

  const [data, SetData] = useState<ReportSaveLog[]>();
  const [textSearch, SetTextSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);

  const fetchDUC = useCallback(async () => {
    try {
      setLoading(true)
      const res = await reportSaveLog.GetSaveReportLogService();
      SetData(res.data.result);
      setLoading(false)
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportSaveLog.SearchSaveReportLogService({ Search: textSearch, startDate, endDate });
      SetData(res.data.result)
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [endDate, startDate, textSearch]);

  useEffect(() => {
    fetchDUC();
  }, [fetchDUC]);


  const handleExportExcel = useCallback(async () => {

    try {

      const res = await reportSaveLog.exportExcel({ Search: textSearch, startDate, endDate });

      const blob = res.data;

      // ดึงชื่อไฟล์จาก header 'content-disposition'
      const contentDisposition = res.headers['content-disposition'];
      let fileName = `${new Date().getTime()}reportAccept.xlsx`; // Default filename
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = decodeURIComponent(fileNameMatch[1]);
        }
      }

      // สร้าง URL ชั่วคราวสำหรับดาวน์โหลด
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      // เพิ่ม link เข้าไปใน DOM, กด, และลบออก
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }

  }, [textSearch, startDate, endDate])



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
    { field: "action", headerName: "ACTION", width: 130 },

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
    { field: "resigned_date", headerName: "RESINGNED DATE", width: 130 },
    { field: "days_after_action", headerName: "DAY AFTER ACTION", width: 160 },
    {
      field: "event_type",
      headerName: "EVENT TYPE",
      width: 140,
      renderCell: (params) => {
        const even_type = params.value as string;
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
    {
      field: "users_action",
      headerName: "USERS ACTION",
      width: 160,

    },
    {
      field: "user_action_date",
      headerName: "USER ACTION DATE",
      sortable: false,
      width: 160,
      renderCell: (params) => (datetime.DateTimeLongTH(params.row.user_action_date))
    }

  ];


  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {loading ? (
          <Stack
            spacing={2}
            sx={{ color: 'grey.500', width: '100%', justifyContent: 'center' }}
            direction="row"
            alignItems="center"
          >
            <CircularProgress color="inherit" size={200} thickness={2} />
          </Stack>
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                mb={3}
              >
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    label="Search ALL"
                    type="search"
                    size="small"
                    onChange={(e) => SetTextSearch(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <DatePicker
                          label="From"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                          disableFuture
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <DatePicker
                          label="To"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                          disableFuture
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleSearch()}
                    fullWidth
                  >
                    <SearchIcon />
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <hr />

            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <Grid
                container
                spacing={2}
                justifyContent="start"
                alignItems="start"
              >
                <Grid size={{ xs: 11, sm: 11, md: 11, lg: 10 }} >
                  <h2>Saved DCC & DUC Reports</h2>
                </Grid>
                <Grid size={{ xs: 1, sm: 1, md: 1, lg: 2 }} mt={3}>
                  <Button variant="outlined" startIcon={<SystemUpdateAltIcon />} onClick={handleExportExcel}>
                    Export Excel
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Paper sx={{ width: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={data}
                loading={loadingDataGrid}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                getRowClassName={(params) =>
                  params.row.unauthorized === "Y" ||
                    params.row.download_more_10_files_day === "Y" ||
                    params.row.employee_resigning_within_one_month === "Y"
                    ? "row--highlight"
                    : ""
                }
                sx={{
                  "& .row--highlight": {
                    bgcolor: "rgba(255,165,0,0.1)",
                    color: "orange",
                    "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" },
                  },
                  fontSize: "12px",
                  "& .MuiDataGrid-columnHeaders": {
                    fontSize: "14px",
                  },
                }}
              />

            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>

  );
}
