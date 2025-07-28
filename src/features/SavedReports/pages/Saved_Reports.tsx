import Grid from "@mui/material/Grid";

import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import datetime from "@/shared/utils/handleDatetime";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useCallback, useEffect, useState, type SyntheticEvent } from "react";
import reportSaveLog from "../service/saveReposrtService";
import type { ReportSaveLog } from "../types/reportsavelog";
import type { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import CancelPresentation from '@mui/icons-material/CancelPresentation';

import Container from '@mui/material/Container';
import { fNumber } from "@/shared/utils/formatNumber";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Tab } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";

export default function Saved_Reports() {


  const [value, setValue] = useState('1');

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tapData, setTapData] = useState('DUC');

  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);

  const [dataDuc, SetDataDUC] = useState<ReportSaveLog[]>();
  const [dataDcc, SetDataDCC] = useState<ReportSaveLog[]>();
  const [textSearch, SetTextSearch] = useState<string>("");

  const columnsDuc: GridColDef[] = [
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
    },
    { field: "group_name", headerName: "GROUP NAME", flex: 2 },
    { field: "username", headerName: "USERNAME", flex: 2 },
    {
      field: "action",
      headerName: "ACTION",

    },
    {
      field: "action_date_time",
      headerName: "ACTION DATE TIME",
      description: "This column has a value getter and is not sortable.",
      sortable: false, flex: 2,

      renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
    },
    { field: "detail", headerName: "DETAIL", flex: 5 },
    { field: "bu", headerName: "BU", flex: 1, },
    { field: "position", headerName: "POSITION", flex: 2, },
    {
      field: "resigned_date", headerName: "RESINGNED DATE", flex: 2,
      renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
    },
    { field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2 },
    {
      field: "event_type",
      headerName: "EVENT TYPE", flex: 2,

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
      headerName: "DOWNLOAD MORE 10 FILES DAY", flex: 2,

    },
    {
      field: "unauthorized",
      headerName: "UNAUTHORIZED", flex: 2,

    },
    {
      field: "employee_resigning_within_one_month",
      headerName: "EMPLOYEE RESINGING WITHHIN ONE MONTH", flex: 2,

    },
    {
      field: "users_action",
      headerName: "USERS ACCEPT", flex: 2,

    },
    {
      field: "user_action_date",
      headerName: "USER ACCEPT DATE", flex: 2,

    },
  ];




  const columnsDCC: GridColDef[] = [
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
    },
    { field: "group_name", headerName: "GROUP NAME", flex: 2 },
    { field: "username", headerName: "USERNAME", flex: 2 },
    {
      field: "action",
      headerName: "ACTION",

    },
    {
      field: "action_date_time",
      headerName: "ACTION DATE TIME",
      description: "This column has a value getter and is not sortable.",
      sortable: false, flex: 2,

      renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
    },
    { field: "detail", headerName: "DETAIL", flex: 5 },
    { field: "bu", headerName: "BU", flex: 1, },
    { field: "position", headerName: "POSITION", flex: 2, },
    {
      field: "resigned_date", headerName: "RESINGNED DATE", flex: 2,
      renderCell: (params) => (params.row.resigned_date ? datetime.DateLongTH(params.row.resigned_date) : '')
    },
    { field: "days_after_action", headerName: "DAY AFTER ACTION", flex: 2 },
    {
      field: "event_type",
      headerName: "EVENT TYPE", flex: 2,

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
      headerName: "DOWNLOAD MORE 10 FILES DAY", flex: 2,

    },
    {
      field: "unauthorized",
      headerName: "UNAUTHORIZED", flex: 2,

    },
    {
      field: "employee_resigning_within_one_month",
      headerName: "EMPLOYEE RESINGING WITHHIN ONE MONTH", flex: 2,

    },
    {
      field: "is_not_dcc",
      headerName: "Is_Not_DCC", flex: 2,

    },
    {
      field: "users_action",
      headerName: "USERS ACCEPT", flex: 2,

    },
    {
      field: "user_action_date",
      headerName: "USER ACCEPT DATE", flex: 2,

    },
  ];

  const handleClear = () => {
    SetTextSearch('');
    setStartDate(null);
    setEndDate(null);
  }

  const fetchDUC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportSaveLog.GetSaveReportLogService({ tapData: "DUC" });
      SetDataDUC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchDCC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportSaveLog.GetSaveReportLogService({ tapData: "DCC" });
      SetDataDCC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, []);



  const handleSearch = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportSaveLog.SearchSaveReportLogService({ Search: textSearch, startDate, endDate, tapData });
      if (tapData === 'DUC')
        SetDataDUC(res.data.result)
      else
        SetDataDCC(res.data.result)
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [textSearch, startDate, endDate, tapData]);


  const handleExportExcel = useCallback(async () => {
    try {
      const res = await reportSaveLog.exportExcel({ Search: textSearch, startDate, endDate, tapData });

      const blob = res.data;

      // ดึงชื่อไฟล์จาก header 'content-disposition'
      const contentDisposition = res.headers['content-disposition'];
      let fileName = `${new Date().getTime()} report.xlsx`; // Default filename
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

  }, [textSearch, startDate, endDate, tapData])



  useEffect(() => {
    fetchDUC();
    fetchDCC()
  }, [fetchDCC, fetchDUC]);


  const paginationModel = { page: 0, pageSize: 5 };



  return (
    <>
      <Container disableGutters maxWidth={false}>
        <Grid container spacing={2} justifyContent="center">
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} mt={2} mb={2}>
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
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField
                    label="Search ALL"
                    type="search"
                    size="small"
                    value={textSearch}
                    onChange={(e) => SetTextSearch(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <DatePicker
                          label="From"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue ?? null)}
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
                          onChange={(newValue) => setEndDate(newValue ?? null)}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                          disableFuture
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleSearch()}
                    fullWidth

                  >
                    <SearchIcon />
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 1 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleClear()}
                    fullWidth
                    color="error"
                  >
                    <CancelPresentation />
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
                <Grid size={{ xs: 11, sm: 11, md: 11, lg: 8, xl: 8 }} >
                  <h2>Audited Log Report DUC&DCC</h2>
                </Grid>

              </Grid>
              <Grid size={12} >
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} textColor="secondary"
                      indicatorColor="secondary">
                      <Tab label={`DUC Log (${dataDuc ? dataDuc.length : 0})`} value="1" onClick={() => setTapData('DUC')} />
                      <Tab label={`DCC Log (${dataDcc ? dataDcc.length : 0})`} value="2" onClick={() => setTapData('DCC')} />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <Grid
                      container
                      spacing={2}
                      justifyContent="start"
                      alignItems="end"
                    >
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} mb={3} justifyContent="flex-end" display="flex">
                        {/* <Button variant="contained" color="success" onClick={hendleSubmit}><SaveIcon /> Save Duc</Button> */}
                        <Button variant="outlined" startIcon={<SystemUpdateAltIcon />} onClick={handleExportExcel} sx={{ ml: 2 }}> Export DUC </Button>
                      </Grid>
                    </Grid>
                    <DataGrid
                      getRowId={(row) => row.id.toString()}
                      loading={loadingDataGrid}
                      rows={dataDuc}
                      columns={columnsDuc}
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
                      }}
                    />
                  </TabPanel>
                  <TabPanel value="2">
                    <Grid
                      container
                      spacing={2}
                      justifyContent="start"
                      alignItems="end"
                    >
                      <Grid size={{ xs: 1, sm: 1, md: 1, lg: 4, xl: 12 }} mb={3} justifyContent="flex-end" display="flex">
                        {/* <Button variant="contained" color="success" onClick={hendleSubmit}><SaveIcon /> Save DCC</Button> */}
                        <Button variant="outlined" startIcon={<SystemUpdateAltIcon />} onClick={handleExportExcel} sx={{ ml: 2 }}> Export DCC </Button>
                      </Grid>
                    </Grid>

                    <DataGrid
                      getRowId={(row) => row.id.toString()}
                      loading={loadingDataGrid}
                      rows={dataDcc}
                      columns={columnsDCC}
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
                      }}
                    />
                  </TabPanel>
                </TabContext>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container >
    </>
  );
}
