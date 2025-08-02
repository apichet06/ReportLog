import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import { Fragment, useCallback, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import reportLogService from "../service/reportlogService";
import type { ReportLog } from "../types/reportlog";
import Swal from "sweetalert2";
import datetime from "@/shared/utils/handleDatetime";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { fNumber } from "@/shared/utils/formatNumber";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CancelPresentation from '@mui/icons-material/CancelPresentation';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';


import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import type { GridRowId } from "@mui/x-data-grid";







export default function ReportLogPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [] as unknown as GridRowSelectionModel
  );

  const [value, setValue] = useState('1');

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(false);
  const [rowDatas, setRowDatas] = useState<GridRowId[]>([]);


  const handleClickOpen = () => {
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
    setRowDatas(rawData)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [tapData, setTapData] = useState('DUC');

  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false)


  const [dataDuc, SetDataDUC] = useState<ReportLog[]>();
  const [dataDcc, SetDataDCC] = useState<ReportLog[]>();
  const [textSearch, SetTextSearch] = useState<string>("");

  const [conment, setComment] = useState<string>("");


  const [valueRedio, setValueRedio] = useState('Usual');
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };



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
      flex: 2,
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
      renderCell: (params) => {
        const download_more_10_files_day = params.value as string;
        return (
          <span >
            {download_more_10_files_day == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </span>
        );
      },
      align: 'center'
    },
    {
      field: "unauthorized",
      headerName: "UNAUTHORIZED", flex: 2,
      renderCell: (params) => {
        const unauthorized = params.value as string;
        return (
          <span >
            {unauthorized == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </span>
        );
      },
      align: 'center'
    },
    {
      field: "employee_resigning_within_one_month",
      headerName: "EMPLOYEE RESINGING WITHHIN ONE MONTH", flex: 2,
      renderCell: (params) => {
        const employee_resigning_within_one_month = params.value as string;
        return (
          <span >
            {employee_resigning_within_one_month == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </span>
        );
      },
      align: 'center'
    }
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
      flex: 2.2
    },
    {
      field: "action_date_time",
      headerName: "ACTION DATE TIME",
      description: "This column has a value getter and is not sortable.",
      sortable: false, flex: 2,
      renderCell: (params) => (datetime.DateTimeLongTH(params.row.action_date_time))
    },
    { field: "detail", headerName: "DETAIL", flex: 5 },
    { field: "bu", headerName: "BU", flex: 3, },
    { field: "position", headerName: "POSITION", flex: 2 },
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
      renderCell: (params) => {
        const download_more_10_files_day = params.value as string;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {download_more_10_files_day == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </Box>
        );
      },
      align: 'center'
    },
    {
      field: "unauthorized",
      headerName: "UNAUTHORIZED", flex: 2,
      renderCell: (params) => {
        const unauthorized = params.value as string;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {unauthorized == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </Box>
        );
      },
      align: 'center'
    },
    {
      field: "employee_resigning_within_one_month",
      headerName: "EMPLOYEE RESINGING WITHHIN ONE MONTH", flex: 2,
      renderCell: (params) => {
        const employee_resigning_within_one_month = params.value as string;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {employee_resigning_within_one_month == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </Box>
        );
      },
      align: 'center'
    },
    {
      field: "is_bu_dcc",
      headerName: "IS BU DCC", flex: 1.5,
      renderCell: (params) => {
        const is_bu_dcc = params.value as string;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {is_bu_dcc == "Y" ?
              <img src={"img/alert.png"} width={"20px"} height={"20px"} />
              : <img src={"img/success.png"} width={"20px"} height={"20px"} />}
          </Box>
        );
      },
      align: 'center'
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
      const res = await reportLogService.GetReportLogService({ tapData: "DUC" });
      SetDataDUC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchDCC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportLogService.GetReportLogService({ tapData: "DCC" });
      SetDataDCC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, []);



  const handleSearch = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      const res = await reportLogService.SearchReportLogService({ Search: textSearch, startDate, endDate, tapData });
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
      await setLoadingExport(true)
      const res = await reportLogService.exportExcel({ Search: textSearch, startDate, endDate, tapData });
      const blob = res.data;

      // ดึงชื่อไฟล์จาก header 'content-disposition'
      const contentDisposition = res.headers['content-disposition'];
      let fileName = `${new Date().getTime()} ${tapData} report.xlsx`; // Default filename
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

      await setLoadingExport(false)

    } catch (err) {
      console.log(err);
    }

  }, [textSearch, startDate, endDate, tapData])



  useEffect(() => {
    fetchDUC();
    fetchDCC()
  }, [fetchDCC, fetchDUC]);


  const paginationModel = { page: 0, pageSize: 10 };

  const hendleSubmit = async () => {

    const numericIds = rowDatas.map((id) => Number(id));

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
          fetchDCC()
        }
      });

    } catch (err) {
      console.error(err);

    }
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
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
                  <h2>Log Report DCC & DUC</h2>
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
                        <Button variant="contained" color="success" onClick={hendleSubmit} startIcon={<SaveIcon />}> Save Duc</Button>
                        <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DUC </Button>
                      </Grid>
                    </Grid>
                    <DataGrid
                      getRowId={(row) => row.id.toString()}
                      loading={loadingDataGrid}
                      rows={dataDuc}
                      columns={columnsDuc}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                      checkboxSelection
                      onRowSelectionModelChange={(newSelection) =>
                        setSelectionModel(newSelection)
                      }
                      showToolbar={true}
                      slotProps={{
                        toolbar: {
                          csvOptions: { disableToolbarButton: true },
                          printOptions: { disableToolbarButton: true },
                        },
                      }}
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
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} mb={3} justifyContent="flex-end" display="flex">
                        <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save DCC</Button>
                        <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DCC </Button>
                      </Grid>
                    </Grid>
                    <Box style={{ width: '100%' }}>
                      <DataGrid
                        getRowId={(row) => row.id.toString()}
                        loading={loadingDataGrid}
                        rows={dataDcc}
                        columns={columnsDCC}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelection) =>
                          setSelectionModel(newSelection)
                        }
                        showToolbar={true}
                        slotProps={{
                          toolbar: {
                            csvOptions: { disableToolbarButton: true },
                            printOptions: { disableToolbarButton: true },
                            // showQuickFilter: false,
                          },
                        }}
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
                    </Box>

                  </TabPanel>
                </TabContext>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container >


      <Fragment>

        <Dialog
          fullScreen={fullScreen}
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Form Accept
          </DialogTitle>
          <DialogContent dividers>
            <FormControl>
              <FormLabel>Confirm Event</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={valueRedio}
                onChange={handleChangeRedio}
              >
                <FormControlLabel value="Usual" control={<Radio />} label="Usual Event" />
                <FormControlLabel value="Unusual" control={<Radio />} label="Unusual Event" />
              </RadioGroup>
            </FormControl>
            <TextField
              id="standard-multiline-static"
              label="Comment"
              multiline
              rows={4}
              placeholder="Please Comment accept..."
              variant="filled"
              fullWidth
              color="success"
            />

          </DialogContent>
          <DialogActions>
            <Button onClick={hendleSubmit}>
              save
            </Button>
            <Button onClick={handleClose} autoFocus>
              cancle
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>

    </>
  );
}
