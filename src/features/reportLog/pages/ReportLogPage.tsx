import {
  DataGrid,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import reportLogService from "../service/reportlogService";
import type { ReportLog } from "../types/reportlog";
import Swal from "sweetalert2";
import datetime from "@/shared/utils/handleDatetime";
// import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import CancelPresentation from '@mui/icons-material/CancelPresentation';
import type { GridRowId } from "@mui/x-data-grid";
import type { User } from "@/layouts/userType";
import { columnsDuc } from "../constants/reportLogDucColumns";
import { columnsDCC } from "../constants/reportLogDccColumns";
import ReportLogDialog from "../components/ReportLogDialog";
import { ButtonGroup } from "@mui/material";
import ReportLogToolbar from "../components/ReportLogToolbar";

type MUIColor = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'inherit';



export default function ReportLogPage() {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [] as unknown as GridRowSelectionModel
  );
  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;


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


  const [tapData, setTapData] = useState('DUC');

  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false)


  const [dataDuc, SetDataDUC] = useState<ReportLog[]>();
  const [dataDcc, SetDataDCC] = useState<ReportLog[]>();
  const [textSearch, SetTextSearch] = useState<string>("");

  const [conment, setComment] = useState<string>("");
  const [colerTodayduc, setColerTodayDuc] = useState<MUIColor>("secondary");
  const [colerHistoryduc, setColerHistoryDuc] = useState<MUIColor>("info");
  const [colerTodaydcc, setColerTodayDcc] = useState<MUIColor>("secondary");
  const [colerHistorydcc, setColerHistoryDcc] = useState<MUIColor>("info");

  const [dayHisDateduc, setsDayHisDateDuc] = useState(1);
  const [dayHisDatedcc, setsDayHisDateDcc] = useState(1);

  const [valueRedio, setValueRedio] = useState('Usual');
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };





  const handleClear = () => {
    SetTextSearch('');
    fetchDCC();
    fetchDUC();
    // setStartDate(null);
    // setEndDate(null);
  }

  const fetchDUC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDateduc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());

      } else if (dayHisDateduc == 0) {

        const targetDate = new Date("2025-07-14");
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportLogService.GetReportLogService({ tapData: "DUC", startDate: dateToday, endDate: dateEndDate });
      SetDataDUC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [dayHisDateduc]);



  const fetchDCC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)
      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDatedcc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());

      } else if (dayHisDatedcc == 0) {

        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }


      const res = await reportLogService.GetReportLogService({ tapData: "DCC", startDate: dateToday, endDate: dateEndDate });
      SetDataDCC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [dayHisDatedcc]);




  const handleSearch = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)

      const res = await reportLogService.SearchReportLogService({ Search: textSearch, tapData });
      if (tapData === 'DUC')
        SetDataDUC(res.data.result)
      else
        SetDataDCC(res.data.result)
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [textSearch, tapData]);


  const handleExportExcel = useCallback(async () => {
    try {

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

      await setLoadingExport(true)

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDatedcc == 1 || dayHisDateduc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());

      } else if (dayHisDatedcc == 0 || dayHisDateduc == 0) {

        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }


      const res = await reportLogService.exportExcel({ Search: textSearch, startDate: dateToday, endDate: dateEndDate, tapData });
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

  }, [selectionModel, dayHisDatedcc, dayHisDateduc, textSearch, tapData])



  useEffect(() => {
    fetchDUC();
    fetchDCC()
  }, [fetchDCC, fetchDUC, dayHisDatedcc, dayHisDateduc]);






  const hendleSubmit = async () => {

    const numericIds = rowDatas.map((id) => Number(id));
    const email = resultData?.emp_email ?? "";
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
          await reportLogService.ApprovedReportLogService(numericIds, email, valueRedio, conment);

          fetchDUC();
          fetchDCC()
        }
      });

    } catch (err) {
      console.error(err);

    }
  };

  const paginationModel = { page: 0, pageSize: 10 };

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

              <ReportLogToolbar
                textSearch={textSearch}
                onSearchChange={SetTextSearch}
                onSearchClick={handleSearch}
                onClearClick={handleClear}
              />
              {/* 
              <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                mb={3}
              >
                <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 10 }}>
                  <TextField
                    label="Search ALL"
                    type="search"
                    size="small"
                    value={textSearch}
                    onChange={(e) => SetTextSearch(e.target.value)}
                  />
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

              </Grid> */}
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
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-start" display="flex">
                        <ButtonGroup
                          disableElevation
                          variant="outlined"
                          aria-label="Disabled button group"
                        >
                          <Button variant="contained" color={colerTodayduc} onClick={() => (setsDayHisDateDuc(1), setColerTodayDuc("secondary"), setColerHistoryDuc("primary"))} >Today</Button>
                          <Button variant="contained" color={colerHistoryduc} onClick={() => (setsDayHisDateDuc(0), setColerTodayDuc("primary"), setColerHistoryDuc("secondary"))}>History</Button>
                        </ButtonGroup>
                      </Grid>

                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
                        <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save Duc</Button>
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
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-start" display="flex">
                        <ButtonGroup
                          disableElevation
                          variant="outlined"
                          aria-label="Disabled button group"
                        >
                          <Button variant="contained" color={colerTodaydcc} onClick={() => (setsDayHisDateDcc(1), setColerTodayDcc("secondary"), setColerHistoryDcc("primary"))} >Today</Button>
                          <Button variant="contained" color={colerHistorydcc} onClick={() => (setsDayHisDateDcc(0), setColerTodayDcc("primary"), setColerHistoryDcc("secondary"))}>History</Button>
                        </ButtonGroup>
                      </Grid>

                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
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
      <ReportLogDialog
        open={open}
        onClose={handleClose}
        valueRedio={valueRedio}
        comment={conment}
        onSubmit={hendleSubmit}
        onRadioChange={handleChangeRedio}
        onCommentChange={setComment}
      />
    </>
  );
}
