import { DataGridPremium } from "@mui/x-data-grid-premium";
import CancelPresentation from "@mui/icons-material/CancelPresentation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import reportLogService from "../service/reportlogService";
import type { MUIColor, ReportLog } from "../types/reportlog";
import Swal from "sweetalert2";
import datetime from "@/shared/utils/handleDatetime";

import SaveIcon from "@mui/icons-material/Save";
// import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { getColumnsDUC } from "../constants/reportLogDucColumns";
import { getColumnsDCC } from "../constants/reportLogDccColumns";
import ReportLogDialog from "../components/ReportLogDialog";
import ButtonGroup from "@mui/material/ButtonGroup";
import ReportLogToolbar from "../components/ReportLogToolbar";

import { useMediaQuery } from "@mui/system";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
// import GetUserlogin from "@/shared/utils/serviceUser";
import type { User } from "@/layouts/userType";
import SearchIcon from '@mui/icons-material/Search';
import sharedUsers from "@/shared/hooks/sharedUsers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ReportLogPage() {

  const twoDaysAgo = dayjs().subtract(2, "day");

  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;
  const { sessionUser } = sharedUsers(resultData?.emp_no as string)

  const appIds = useMemo(() => {
    return sessionUser?.app_Id
      ? sessionUser.app_Id
        .split(",")
        .map((id) => id.trim())
        .sort((a, b) => Number(a) - Number(b))
      : [];
  }, [sessionUser?.app_Id]);

  const [value, setValue] = useState<string>(appIds[0] ?? "1");

  useEffect(() => {
    if (appIds.length > 0) {
      setValue(appIds[0]); // กำหนด tab แรก
    }
  }, [appIds]);

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setComment("");
    setValueRedio("Usual Event");
  };

  const [tapData, setTapData] = useState("DUC");
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);
  const [textSearch, SetTextSearch] = useState<string>("");

  const [conment, setComment] = useState<string>("");
  const [colerTodayduc, setColerTodayDuc] = useState<MUIColor>("secondary");
  const [colerHistoryduc, setColerHistoryDuc] = useState<MUIColor>("info");
  const [colerTodaydcc, setColerTodayDcc] = useState<MUIColor>("secondary");
  const [colerHistorydcc, setColerHistoryDcc] = useState<MUIColor>("info");

  const [dayHisDateduc, setsDayHisDateDuc] = useState(1);
  const [dayHisDatedcc, setsDayHisDateDcc] = useState(1);

  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
  const [dataId, setDataId] = useState<number[]>([]);

  const [valueRedio, setValueRedio] = useState("Usual Event");
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };


  const [checkBoxdccUsual, setCheckBoxdccUsual] = useState("Usual Event");
  const [checkBoxdccUnusual, setCheckBoxdccUnusual] = useState("Unusual Event");
  const [checkBoxducUsual, setCheckBoxducUsual] = useState("Usual Event");
  const [checkBoxducUnusual, setCheckBoxducUnusual] = useState("Unusual Event");

  const handleClear = () => {
    setDateStart(null);
    setDateEnd(null);
    setPendingStart(null);
    setPendingEnd(null);
  };


  const handleClickOpen = () => {
    let numericIds = null;
    if (tapData == "DUC") numericIds = datasDuc.map((item) => Number(item.id));
    else numericIds = datasDcc.map((item) => Number(item.id));

    if (numericIds.length == 0) {
      Swal.fire({
        title: "No data to display!",
        icon: "warning",
      });
      return;
    }
    setDataId(numericIds);
    setOpen(true);
  };


  // const handleSearch = useCallback(
  //   async (tapData: "DUC" | "DCC", dayHistory: number, setData: (data: ReportLog[]) => void) => {
  //     try {
  //       const plant = sessionUser.plant;
  //       setLoadingDataGrid(true);

  //       const { startDate, endDate } = datetime.buildDateParamsSearch(
  //         dayHistory,
  //         dateStart,
  //         dateEnd
  //       );
  //       const checkBoxUsual =
  //         tapData === "DUC" ? checkBoxducUsual : checkBoxdccUsual;
  //       const checkBoxUnusual =
  //         tapData === "DUC" ? checkBoxducUnusual : checkBoxdccUnusual;

  //       const res = await reportLogService.SearchReportLogService({
  //         Search: textSearch,
  //         tapData,
  //         startDate,
  //         endDate,
  //         checkBoxUsual,
  //         checkBoxUnusual,
  //         plant,
  //       });

  //       const newData = res.data.result.map(
  //         (item: ReportLog, index: number) => ({
  //           ...item,
  //           no: index + 1,
  //         })
  //       );

  //       setData(newData);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoadingDataGrid(false);
  //     }
  //   },
  //   [sessionUser.plant, dateStart, dateEnd, checkBoxducUsual, checkBoxdccUsual, checkBoxducUnusual, checkBoxdccUnusual, textSearch]
  // );

  //   const dataCount = useCallback(async (searchText?: string, dateStart?: Dayjs | null, dateEnd?: Dayjs | null) => {
  //     const createDateStr = (daysToSubtract: number): string => {
  //       const targetDate = new Date();
  //       targetDate.setDate(targetDate.getDate() - daysToSubtract);
  //       return datetime.DateSearch(targetDate);
  //     };


  //     const searchStartDate = dateStart ? datetime.DateSearch(dateStart.toDate()) : "";
  //     const searchEndDate = dateEnd ? datetime.DateSearch(dateEnd.toDate()) : "";

  //     console.log(searchStartDate, searchEndDate);


  //     const yesterdayStr = createDateStr(1);
  //     const twoDaysAgoStr = createDateStr(2);
  //     const plant = sessionUser.plant;

  //     const getLogCount = async (params: object): Promise<number> => {
  //       try {
  //         const response = await reportLogService.SearchReportLogService(params);
  //         return response.data.result.length;
  //       } catch (error) {
  //         console.error(`Failed to fetch logs for params: ${JSON.stringify(params)}`, error);
  //         return 0;
  //       }
  //     };

  //     try {
  //       // DUC
  //       const [ducYesterdayCount, ducTwoDaysAgoCount, ducAllCount] = await Promise.all([
  //         getLogCount({
  //           Search: searchText,
  //           tapData: "DUC",
  //           startDate: yesterdayStr,
  //           endDate: yesterdayStr,
  //           checkBoxUsual: checkBoxducUsual,
  //           checkBoxUnusual: checkBoxducUnusual,
  //           plant,
  //         }),
  //         getLogCount({
  //           Search: searchText,
  //           tapData: "DUC",
  //           endDate: twoDaysAgoStr,
  //           checkBoxUsual: checkBoxducUsual,
  //           checkBoxUnusual: checkBoxducUnusual,
  //           plant,
  //         }),
  //         getLogCount({
  //           Search: searchText,
  //           tapData: "DUC",
  //           checkBoxUsual: checkBoxducUsual,
  //           checkBoxUnusual: checkBoxducUnusual,
  //           plant,
  //         }),
  //       ]);

  //       // DCC
  //    const [ducYesterdayCount, ducTwoDaysAgoCount, ducAllCount] = await Promise.all([
  //   getLogCount({
  //     Search: searchText,
  //     tapData: "DUC",
  //     startDate: yesterdayStr,
  //     endDate: yesterdayStr,
  //     checkBoxUsual: checkBoxducUsual,
  //     checkBoxUnusual: checkBoxducUnusual,
  //     plant,
  //   }),
  //   getLogCount({
  //     Search: searchText,
  //     tapData: "DUC",
  //     startDate: "", // <-- อันนี้ไม่จำเป็น แต่ให้ส่งเป็นช่วงสองวัน
  //     endDate: twoDaysAgoStr,
  //     checkBoxUsual: checkBoxducUsual,
  //     checkBoxUnusual: checkBoxducUnusual,
  //     plant,
  //   }),
  //   getLogCount({
  //     Search: searchText,
  //     tapData: "DUC",
  //     startDate: searchStartDate,   
  //     endDate: searchEndDate,      
  //     checkBoxUsual: checkBoxducUsual,
  //     checkBoxUnusual: checkBoxducUnusual,
  //     plant,
  //   }),
  // ]);

  //       // setCountDucAll({ ducYesterdayCount, ducTwoDaysAgoCount, ducAllCount });
  //       // setCountDccAll({ dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount });
  //     } catch (error) {
  //       console.error("An error occurred while fetching report counts:", error);
  //     }
  //   }, [sessionUser.plant, checkBoxducUsual, checkBoxducUnusual, checkBoxdccUsual, checkBoxdccUnusual]);


  // const fetchData = useCallback(
  //   async (
  //     tapData: "DUC" | "DCC",
  //     dayHistory: number, textSearch: string,
  //     setData: (data: ReportLog[]) => void
  //   ) => {
  //     try {
  //       setLoadingDataGrid(true);
  //       const plant = sessionUser.plant;
  //       const { startDate, endDate } = datetime.buildDateParams(dayHistory);
  //       // console.log(textSearch, tapData, dayHistory, startDate, endDate);
  //       const checkBoxUsual =
  //         tapData === "DUC" ? checkBoxducUsual : checkBoxdccUsual;
  //       const checkBoxUnusual =
  //         tapData === "DUC" ? checkBoxducUnusual : checkBoxdccUnusual;
  //       const res = await reportLogService.GetReportLogService({
  //         tapData,
  //         startDate,
  //         endDate,
  //         checkBoxUsual,
  //         checkBoxUnusual,
  //         plant,
  //         Search: textSearch
  //       });

  //       const newData = res.data.result.map(
  //         (item: ReportLog, index: number) => ({
  //           ...item,
  //           no: index + 1,
  //         })
  //       );
  //       setData(newData);
  //       // SetTextSearch("");
  //       setDateStart(null);
  //       setDateEnd(null);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoadingDataGrid(false);
  //     }
  //   },
  //   [checkBoxdccUnusual, checkBoxdccUsual, checkBoxducUnusual, checkBoxducUsual, sessionUser.plant]
  // );


  const [pendingStart, setPendingStart] = useState<Dayjs | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Dayjs | null>(null);

  const handleApplyDate = () => {
    if (pendingStart && pendingEnd) {
      setDateStart(pendingStart);
      setDateEnd(pendingEnd);
    }
  };



  const [datasDuc, setDatasDuc] = useState<ReportLog[]>([]);
  const [datasDcc, setDatasDcc] = useState<ReportLog[]>([]);
  const [ducCounts, setDucCounts] = useState({
    all: 0,
    latest: 0,
    previous: 0
  });

  const [dccCounts, setDccCounts] = useState({
    all: 0,
    latest: 0,
    previous: 0
  });

  const fetchDuc = useCallback(async () => {
    try {
      setLoadingDataGrid(true);
      const plant = sessionUser?.plant;
      const { startDate, endDate } = datetime.buildDateParamsSearch(dayHisDateduc, dateStart, dateEnd);

      // ข้อมูลที่จะแสดงในตาราง
      const res = await reportLogService.GetReportLogService({
        tapData: "DUC",
        startDate,
        endDate,
        checkBoxUsual: checkBoxducUsual,
        checkBoxUnusual: checkBoxducUnusual,
        plant,
        Search: textSearch
      });

      const newData = res.data.result.map((item: ReportLog, index: number) => ({
        ...item,
        no: index + 1,
      }));

      setDatasDuc(newData);

      // ---------- คำนวณ count ----------
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // latest data (เมื่อวาน)
      const resLatest = await reportLogService.GetReportLogService({
        tapData: "DUC",
        startDate: datetime.DateSearch(yesterday),
        endDate: datetime.DateSearch(yesterday),
        checkBoxUsual: checkBoxducUsual,
        checkBoxUnusual: checkBoxducUnusual,
        plant,
        Search: textSearch
      });


      // previous data (สองวันก่อน)
      const date_Start = dateEnd == null ? null : dateStart;
      const resPrev = await reportLogService.GetReportLogService({
        tapData: "DUC",
        startDate: date_Start ? datetime.DateSearch(date_Start.toDate()) : "",
        endDate: dateEnd ? datetime.DateSearch(dateEnd.toDate()) : datetime.DateSearch(twoDaysAgo),
        checkBoxUsual: checkBoxducUsual,
        checkBoxUnusual: checkBoxducUnusual,
        plant,
        Search: textSearch
      });

      setDucCounts({
        all: resLatest.data.result.length + resPrev.data.result.length,
        latest: resLatest.data.result.length,
        previous: resPrev.data.result.length,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDataGrid(false);
    }
  }, [checkBoxducUnusual, checkBoxducUsual, dateEnd, dateStart, dayHisDateduc, sessionUser?.plant, textSearch]);



  const fetchDcc = useCallback(async () => {
    try {
      setLoadingDataGrid(true);
      const plant = sessionUser?.plant;
      const { startDate, endDate } = datetime.buildDateParamsSearch(dayHisDatedcc, dateStart, dateEnd);
      const res = await reportLogService.GetReportLogService({
        tapData,
        startDate,
        endDate,
        checkBoxUsual: checkBoxdccUsual,
        checkBoxUnusual: checkBoxdccUnusual,
        plant,
        Search: textSearch
      });
      const newData = res.data.result.map(
        (item: ReportLog, index: number) => ({
          ...item,
          no: index + 1,
        })
      );
      setDatasDcc(newData);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      // latest data (เมื่อวาน)
      const resLatest = await reportLogService.GetReportLogService({
        tapData: "DCC",
        startDate: datetime.DateSearch(yesterday),
        endDate: datetime.DateSearch(yesterday),
        checkBoxUsual: checkBoxdccUsual,
        checkBoxUnusual: checkBoxdccUnusual,
        plant,
        Search: textSearch
      });

      // previous data (สองวันก่อน)
      const date_Start = dateEnd == null ? null : dateStart;
      const resPrev = await reportLogService.GetReportLogService({
        tapData: "DCC",
        startDate: date_Start ? datetime.DateSearch(date_Start.toDate()) : "",
        endDate: dateEnd ? datetime.DateSearch(dateEnd.toDate()) : datetime.DateSearch(twoDaysAgo),
        checkBoxUsual: checkBoxdccUsual,
        checkBoxUnusual: checkBoxdccUnusual,
        plant,
        Search: textSearch
      });

      setDccCounts({
        all: resLatest.data.result.length + resPrev.data.result.length,
        latest: resLatest.data.result.length,
        previous: resPrev.data.result.length,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDataGrid(false);
    }
  }, [checkBoxdccUnusual, checkBoxdccUsual, dateEnd, dateStart, dayHisDatedcc, sessionUser?.plant, tapData, textSearch])

  useEffect(() => {
    fetchDuc()
    fetchDcc()

  }, [fetchDuc, fetchDcc, textSearch]);


  const hendleSubmit = async () => {
    const email = sessionUser?.emp_email ?? "";

    try {
      Swal.fire({
        title: "Are you sure?",
        html: `<b>Action:</b> ${valueRedio}<br/><b>Total :</b> (${dataId.length}) items <br/>
        <b>Comment:</b> ${conment || "<i>No comment</i>"}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Success!",
            text: `Report log total ${dataId.length} items`,
            icon: "success",
          });

          await reportLogService.ApprovedReportLogService(
            dataId,
            email,
            valueRedio,
            conment
          );

          handleClose();
          fetchDcc();
          fetchDuc();

        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const isBetween1201And1536 = useMediaQuery(
    "(min-width:1201px) and (max-width:1536px)"
  );
  const isAbove1537 = useMediaQuery("(min-width:1537px)");


  const dccColumns = useMemo(
    () => getColumnsDCC(sessionUser.is_review),
    [sessionUser.is_review]
  );
  const ducColumns = useMemo(
    () => getColumnsDUC(sessionUser.is_review),
    [sessionUser.is_review]
  );

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
                dateStart={dateStart}
                dateEnd={dateEnd}
              />
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
                <Grid size={{ xs: 11, sm: 11, md: 11, lg: 8, xl: 8 }}>
                  <h2>Report Log</h2>
                </Grid>
              </Grid>
              <Grid size={12}>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChange}
                      textColor="secondary"
                      indicatorColor="secondary"
                    >
                      {appIds.includes("1") && (
                        <Tab
                          label={`DUC Log (${ducCounts.all})`}
                          value="1"
                          onClick={() => setTapData("DUC")}
                        />
                      )}

                      {appIds.includes("2") && (
                        <Tab
                          label={`DCC Log (${dccCounts.all})`}
                          value="2"
                          onClick={() => setTapData("DCC")}
                        />
                      )}
                    </TabList>
                  </Box>
                  {appIds.includes("1") && (
                    <TabPanel value="1">
                      <Grid
                        container
                        spacing={2}
                        justifyContent="start"
                        alignItems="end"
                      >
                        <Grid
                          size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                          mb={3}
                          justifyContent="flex-start"
                          display="flex"
                        >
                          <ButtonGroup
                            disableElevation
                            variant="outlined"
                            aria-label="Disabled button group"
                          >
                            <Button
                              variant="contained"
                              color={colerTodayduc}
                              onClick={() => {
                                setsDayHisDateDuc(1);
                                setColerTodayDuc("secondary");
                                setColerHistoryDuc("primary");
                              }}
                            >
                              Latest Data
                              ({
                                ducCounts.latest
                              })
                            </Button>
                            <Button
                              variant="contained"
                              color={colerHistoryduc}
                              onClick={() => {
                                setsDayHisDateDuc(0);
                                setColerTodayDuc("primary");
                                setColerHistoryDuc("secondary");
                              }}
                            >
                              Previous Data ({ducCounts.previous})
                            </Button>
                          </ButtonGroup>
                        </Grid>
                        <Grid
                          size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                          mb={1}
                          justifyContent="flex-end"
                          display="flex"
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxducUsual === "Usual Event"}
                                onChange={(e) =>
                                  setCheckBoxducUsual(
                                    e.target.checked ? "Usual Event" : ""
                                  )
                                }
                              />
                            }
                            label="Usual Event"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxducUnusual === "Unusual Event"}
                                onChange={(e) =>
                                  setCheckBoxducUnusual(
                                    e.target.checked ? "Unusual Event" : ""
                                  )
                                }
                              />
                            }
                            label="Unusual Event"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 10, lg: 11, xl: 11 }} mb={2} >
                          {dayHisDateduc === 0 && (
                            <>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2} alignItems="center" justifyContent="flex-end" display="flex">
                                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2, xl: 2 }}  >
                                    <DatePicker
                                      label="Start Date"
                                      value={pendingStart}
                                      format="DD/MM/YYYY"
                                      disableFuture
                                      maxDate={twoDaysAgo}
                                      onChange={(newValue) => setPendingStart(newValue)}
                                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 6, xl: 2 }} >
                                    <DatePicker
                                      label="End Date"
                                      value={pendingEnd}
                                      format="DD/MM/YYYY"
                                      disableFuture
                                      minDate={pendingStart as Dayjs}
                                      maxDate={twoDaysAgo}
                                      onChange={(newValue) => setPendingEnd(newValue)}
                                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 1, xl: 1 }}>
                                    <Button variant="contained" fullWidth onClick={handleApplyDate}  >
                                      <SearchIcon />
                                    </Button>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 1, xl: 1 }}>
                                    <Button fullWidth variant="contained" color="error" onClick={handleClear} title="Clear search" aria-label="clear search">
                                      <CancelPresentation />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </LocalizationProvider>
                            </>
                          )}

                        </Grid>
                        <Grid
                          size={{ xs: 12, sm: 12, md: 2, lg: 1, xl: 1 }}
                          mb={2.2}
                          justifyContent="flex-end"
                          display="flex"
                        >
                          {sessionUser.is_accept && (
                            <Button
                              variant="contained"
                              fullWidth
                              color="success"
                              onClick={handleClickOpen}
                              startIcon={<SaveIcon />}
                            >
                              Save
                            </Button>
                          )}

                          {/* <Button variant="outlined" loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DUC </Button> */}
                        </Grid>
                      </Grid>
                      <Container
                        fixed
                        disableGutters
                        maxWidth={isAbove1537 ? "xl" : "lg"}
                      >
                        <DataGridPremium
                          getRowId={(row) => row.id.toString()}
                          loading={loadingDataGrid}
                          rows={datasDuc}
                          columns={ducColumns}
                          pagination
                          disablePivoting
                          disableColumnSorting
                          disableColumnFilter
                          disableColumnMenu
                          paginationModel={paginationModel}
                          onPaginationModelChange={(model) =>
                            setPaginationModel(model)
                          }
                          initialState={{
                            pinnedColumns: {
                              left: ["__check__", "no"],
                              right: ["event_type", "Edit"],
                            },
                          }}
                          pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                          showToolbar={true}
                          slotProps={{
                            toolbar: {
                              csvOptions: { disableToolbarButton: true },
                              printOptions: { disableToolbarButton: true },
                              excelOptions: {
                                disableToolbarButton:
                                  sessionUser.is_export == false ? true : false,
                              },
                              showQuickFilter: false,
                            },
                          }}
                          getRowClassName={(params) =>
                            params.row.unauthorized === "Y" ||
                              params.row.download_more_10_files_day === "Y" ||
                              params.row.employee_resigning_within_one_month ===
                              "Y"
                              ? "row--highlight"
                              : ""
                          }
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
                        />
                      </Container>
                    </TabPanel>
                  )}
                  {appIds.includes("2") && (
                    <TabPanel value="2">
                      <Grid
                        container
                        spacing={2}
                        justifyContent="start"
                        alignItems="end"
                      >
                        <Grid
                          size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                          mb={3}
                          justifyContent="flex-start"
                          display="flex"
                        >
                          <ButtonGroup
                            disableElevation
                            variant="outlined"
                            aria-label="Disabled button group"
                          >
                            <Button
                              variant="contained"
                              color={colerTodaydcc}
                              onClick={() => {
                                setsDayHisDateDcc(1);
                                setColerTodayDcc("secondary");
                                setColerHistoryDcc("primary");
                              }}
                            >
                              Latest Data ({dccCounts.latest})
                            </Button>
                            <Button
                              variant="contained"
                              color={colerHistorydcc}
                              onClick={() => {
                                setsDayHisDateDcc(0);
                                setColerTodayDcc("primary");
                                setColerHistoryDcc("secondary");
                              }}
                            >
                              Previous Data ({dccCounts.previous})
                            </Button>
                          </ButtonGroup>
                        </Grid>
                        <Grid
                          size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
                          mb={1}
                          justifyContent="flex-end"
                          display="flex"
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxdccUsual === "Usual Event"}
                                onChange={(e) =>
                                  setCheckBoxdccUsual(
                                    e.target.checked ? "Usual Event" : ""
                                  )
                                }
                              />
                            }
                            label="Usual Event"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkBoxdccUnusual === "Unusual Event"}
                                onChange={(e) =>
                                  setCheckBoxdccUnusual(
                                    e.target.checked ? "Unusual Event" : ""
                                  )
                                }
                              />
                            }
                            label="Unusual Event"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 10, lg: 11, xl: 11 }} mb={2} >
                          {dayHisDatedcc === 0 && (
                            <>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2} alignItems="center" justifyContent="flex-end" display="flex">
                                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2, xl: 2 }}  >
                                    <DatePicker
                                      label="Start Date"
                                      value={pendingStart}
                                      format="DD/MM/YYYY"
                                      disableFuture
                                      maxDate={twoDaysAgo}
                                      onChange={(newValue) => setPendingStart(newValue)}
                                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 6, xl: 2 }} >
                                    <DatePicker
                                      label="End Date"
                                      value={pendingEnd}
                                      format="DD/MM/YYYY"
                                      disableFuture
                                      minDate={pendingStart as Dayjs}
                                      maxDate={twoDaysAgo}
                                      onChange={(newValue) => setPendingEnd(newValue)}
                                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 1, xl: 1 }}>
                                    <Button variant="contained" fullWidth onClick={handleApplyDate}  >
                                      <SearchIcon />
                                    </Button>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 1, xl: 1 }}>
                                    <Button fullWidth variant="contained" color="error" onClick={handleClear} title="Clear search" aria-label="clear search">
                                      <CancelPresentation />
                                    </Button>
                                  </Grid>
                                </Grid>
                              </LocalizationProvider>
                            </>
                          )}

                        </Grid>
                        <Grid
                          size={{ xs: 12, sm: 12, md: 2, lg: 1, xl: 1 }}
                          mb={2.2}
                          justifyContent="flex-end"
                          display="flex"

                        >
                          {sessionUser.is_accept && (
                            <Button
                              variant="contained"
                              color="success"
                              fullWidth
                              onClick={handleClickOpen}
                              startIcon={<SaveIcon />}
                            >
                              Save
                            </Button>
                          )}

                          {/* <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DCC </Button> */}
                        </Grid>
                      </Grid>
                      <Container
                        fixed
                        disableGutters
                        maxWidth={isAbove1537 ? "xl" : "lg"}
                      >
                        <DataGridPremium
                          getRowId={(row) => row.id.toString()}
                          loading={loadingDataGrid}
                          rows={datasDcc}
                          columns={dccColumns}
                          pagination
                          disablePivoting
                          disableColumnSorting
                          disableColumnFilter
                          disableColumnMenu
                          paginationModel={paginationModel}
                          onPaginationModelChange={(model) =>
                            setPaginationModel(model)
                          }
                          initialState={{
                            pinnedColumns: {
                              left: ["__check__", "no"],
                              right: ["event_type", "Edit"],
                            },
                          }}
                          pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                          showToolbar={true}
                          slotProps={{
                            toolbar: {
                              csvOptions: { disableToolbarButton: true },
                              printOptions: { disableToolbarButton: true },
                              excelOptions: {
                                disableToolbarButton:
                                  sessionUser.is_export == false ? true : false,
                              },
                              showQuickFilter: false,
                            },
                          }}
                          getRowClassName={(params) =>
                            params.row.unauthorized === "Y" ||
                              params.row.download_more_10_files_day === "Y" ||
                              params.row.employee_resigning_within_one_month ===
                              "Y"
                              ? "row--highlight"
                              : ""
                          }
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
                        />
                      </Container>
                    </TabPanel>
                  )}
                </TabContext>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
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
