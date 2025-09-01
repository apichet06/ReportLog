import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import datetime from "@/shared/utils/handleDatetime";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import reportSaveLog from "../service/saveReposrtService";
import type { MUIColor, ReportSaveLog } from "../types/reportsavelog";
import Container from "@mui/material/Container";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import ReportLogDialog from "../components/ReportLogDialog";
import Swal from "sweetalert2";
import ReportLogToolbar from "../components/ReportLogToolbar";
import { getColumnsDCC } from "../constants/reportLogDccColumns";
import { getColumnsDUC } from "../constants/reportLogDucColumns"; // หมายเหตุ: columnsDuc อาจต้องปรับแก้ในลักษณะเดียวกันถ้ามีปุ่ม action
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  DataGridPremium,
  type GridPaginationModel,
} from "@mui/x-data-grid-premium";
import type { Dayjs } from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import SearchIcon from "@mui/icons-material/Search";
import CancelPresentation from "@mui/icons-material/CancelPresentation";
import type { User } from "@/layouts/userType";
import sharedUsers from "@/shared/hooks/sharedUsers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
export default function Saved_Reports() {
  const twoDaysAgo = dayjs().subtract(2, "day");
  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;
  const { sessionUser } = sharedUsers(resultData?.emp_no as string)
  const [loadingDataGrid, setLoadingDataGrid] = useState(false);


  const [textSearch, SetTextSearch] = useState<string>("");



  const [dayHisDateduc, setsDayHisDateDuc] = useState(1);
  const [dayHisDatedcc, setsDayHisDateDcc] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [conment, setComment] = useState<string>("");
  const [colerTodayduc, setColerTodayDuc] = useState<MUIColor>("secondary");
  const [colerHistoryduc, setColerHistoryDuc] = useState<MUIColor>("info");
  const [colerTodaydcc, setColerTodayDcc] = useState<MUIColor>("secondary");
  const [colerHistorydcc, setColerHistoryDcc] = useState<MUIColor>("info");
  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);

  const [datasDuc, setDatasDuc] = useState<ReportSaveLog[]>([]);
  const [datasDcc, setDatasDcc] = useState<ReportSaveLog[]>([]);
  const [checkBoxdccUsual, setCheckBoxdccUsual] = useState("Usual Event");
  const [checkBoxdccUnusual, setCheckBoxdccUnusual] = useState("Unusual Event");
  const [checkBoxducUsual, setCheckBoxducUsual] = useState("Usual Event");
  const [checkBoxducUnusual, setCheckBoxducUnusual] = useState("Unusual Event");
  const [tapData, setTapData] = useState("DUC");
  const [valueRedio, setValueRedio] = useState("Usual Event");
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };

  const handleClear = () => {
    setPendingStart(null);
    setPendingEnd(null);
    setDateStart(null);
    setDateEnd(null);
  };

  const [pendingStart, setPendingStart] = useState<Dayjs | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Dayjs | null>(null);
  const handleApplyDate = () => {
    if (pendingStart && pendingEnd) {
      setDateStart(pendingStart);
      setDateEnd(pendingEnd);
    }
  };


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

  const handleEditClick = useCallback(
    (id: number) => {
      const activeData = value === "1" ? datasDuc : datasDcc;

      const rowToEdit = activeData?.find((row) => row.id == id);

      if (rowToEdit) {
        // เพิ่มค่า fallback เพื่อป้องกัน error จากค่า null
        setValueRedio(rowToEdit.admin_confirm_event || "Usual Event");
        setComment(rowToEdit.admin_confirm_comment || "");

        setEditingId(id);
        setOpen(true);
      } else {
        // กรณีหาข้อมูลไม่เจอ (ซึ่งไม่ควรเกิด)
        console.error(`Row with ID ${id} not found.`);
        Swal.fire("Error", `Could not find data for item ID: ${id}`, "error");
      }
    },
    [value, datasDuc, datasDcc]
  );



  // const fetchData = useCallback(
  //   async (
  //     tapData: "DUC" | "DCC",
  //     dayHistory: number,
  //     setData: (data: ReportSaveLog[]) => void
  //   ) => {
  //     try {
  //       setLoadingDataGrid(true);
  //       const plant = sessionUser?.plant;


  //       const { startDate, endDate } = datetime.buildDateParams(dayHistory);
  //       const checkBoxUsual =
  //         tapData === "DUC" ? checkBoxducUsual : checkBoxdccUsual;
  //       const checkBoxUnusual =
  //         tapData === "DUC" ? checkBoxducUnusual : checkBoxdccUnusual;
  //       const res = await reportSaveLog.GetSaveReportLogService({
  //         tapData,
  //         startDate,
  //         endDate,
  //         checkBoxUsual,
  //         checkBoxUnusual,
  //         plant,
  //         Search: textSearch,
  //       });

  //       const newData = res.data.result.map(
  //         (item: ReportSaveLog, index: number) => ({
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
  //   [sessionUser?.plant, checkBoxducUsual, checkBoxdccUsual, checkBoxducUnusual, checkBoxdccUnusual, textSearch]
  // );

  // const handleSearch = useCallback(
  //   async (tapData: "DUC" | "DCC", dayHistory: number, setData: (data: ReportSaveLog[]) => void) => {
  //     try {

  //       setLoadingDataGrid(true);
  //       const plant = sessionUser.plant;
  //       const { startDate, endDate } = datetime.buildDateParamsSearch(
  //         dayHistory,
  //         dateStart,
  //         dateEnd
  //       );
  //       const checkBoxUsual =
  //         tapData === "DUC" ? checkBoxducUsual : checkBoxdccUsual;
  //       const checkBoxUnusual =
  //         tapData === "DUC" ? checkBoxducUnusual : checkBoxdccUnusual;

  //       const res = await reportSaveLog.SearchSaveReportLogService({
  //         Search: textSearch,
  //         tapData,
  //         startDate,
  //         endDate,
  //         checkBoxUsual,
  //         checkBoxUnusual,
  //         plant
  //       });

  //       const newData = res.data.result.map(
  //         (item: ReportSaveLog, index: number) => ({
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
      const res = await reportSaveLog.GetSaveReportLogService({
        tapData: "DUC",
        startDate,
        endDate,
        checkBoxUsual: checkBoxducUsual,
        checkBoxUnusual: checkBoxducUnusual,
        plant,
        Search: textSearch
      });

      const newData = res.data.result.map((item: ReportSaveLog, index: number) => ({
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
      const resLatest = await reportSaveLog.GetSaveReportLogService({
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
      const resPrev = await reportSaveLog.GetSaveReportLogService({
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
      const res = await reportSaveLog.GetSaveReportLogService({
        tapData,
        startDate,
        endDate,
        checkBoxUsual: checkBoxdccUsual,
        checkBoxUnusual: checkBoxdccUnusual,
        plant,
        Search: textSearch
      });
      const newData = res.data.result.map(
        (item: ReportSaveLog, index: number) => ({
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
      const resLatest = await reportSaveLog.GetSaveReportLogService({
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
      const resPrev = await reportSaveLog.GetSaveReportLogService({
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



  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setComment("");
    setValueRedio("Usual Event");

  };

  const handleDialogSubmit = async () => {
    if (editingId === null) {
      console.error("Submit clicked, but no ID is being edited.");
      Swal.fire("Error", "No item was selected for editing.", "error");
      return;
    }

    const email = sessionUser?.emp_email ?? "";
    try {
      Swal.fire({
        title: `Are you sure?`,
        html: `<b>Action:</b> ${valueRedio}<br/><b>Comment:</b> ${conment || "<i>No comment</i>"
          }`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const dataToSubmit = {
            Admin_confirm_edit: email,
            Admin_confirm_comment: conment,
            Admin_confirm_event: valueRedio,
          };
          await reportSaveLog.ApprovedReportLogEditService(
            editingId,
            dataToSubmit
          );

          Swal.fire({
            title: "Success!",
            icon: "success",
          });
          handleClose(); // ปิด Dialog และรีเซ็ต state
          fetchDcc()
          fetchDuc()

        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });

  const dccColumns = useMemo(
    () => getColumnsDCC(handleEditClick, sessionUser.is_accept),
    [handleEditClick, sessionUser.is_accept]
  );
  const ducColumns = useMemo(
    () => getColumnsDUC(handleEditClick, sessionUser.is_accept),
    [handleEditClick, sessionUser.is_accept]
  );

  const isBetween1201And1536 = useMediaQuery(
    "(min-width:1201px) and (max-width:1536px)"
  );
  const isAbove1537 = useMediaQuery("(min-width:1537px)");


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
              {/* <CloseIcon color='success' /> */}
              <ReportLogToolbar
                textSearch={textSearch}
                onSearchChange={SetTextSearch}

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
                  <h2>Audit Log Report</h2>
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
                              Latest Data ({ducCounts.latest})
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
                          mb={3}
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
                        <Grid size={{ xs: 12, sm: 12, md: 10, lg: 12, xl: 12 }} mb={2} >
                          {dayHisDateduc === 0 && (
                            <>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2} alignItems="center" justifyContent="flex-end" display="flex">
                                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2, xl: 2 }}  >
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
                                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2, xl: 2 }} >
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
                      </Grid>
                      {/* {window.innerWidth} */}
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
                          initialState={{
                            pinnedColumns: {
                              left: ["no"],
                              right: [
                                "event_type",
                                "admin_confirm_event",
                                "manage",
                              ],
                            },
                          }}
                          paginationModel={paginationModel}
                          onPaginationModelChange={setPaginationModel}
                          pageSizeOptions={[5, 10, 15, 20, 40, 60, 80, 100]}
                          disablePivoting
                          disableColumnMenu
                          disableColumnSorting
                          disableColumnFilter
                          getRowClassName={(params) =>
                            params.row.unauthorized === "Y" ||
                              params.row.download_more_10_files_day === "Y" ||
                              params.row.employee_resigning_within_one_month ===
                              "Y"
                              ? "row--highlight"
                              : ""
                          }
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
                          mb={3}
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
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} mb={2} >
                          {dayHisDatedcc === 0 && (
                            <>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2} alignItems="center" justifyContent="flex-end" display="flex">
                                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2, xl: 2 }}  >
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
                                  <Grid size={{ xs: 12, sm: 12, md: 4, lg: 2, xl: 2 }} >
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
                      </Grid>
                      <Container
                        fixed
                        disableGutters
                        maxWidth={isAbove1537 ? "xl" : "lg"}
                      >
                        <DataGridPremium
                          rows={datasDcc}
                          columns={dccColumns}
                          loading={loadingDataGrid}
                          getRowId={(row) => row.id.toString()}
                          pagination
                          paginationModel={paginationModel}
                          onPaginationModelChange={(model) =>
                            setPaginationModel(model)
                          }
                          pageSizeOptions={[5, 10, 15, 20, 40, 60, 80, 100]}
                          disablePivoting
                          disableColumnSorting
                          disableColumnFilter
                          disableColumnMenu
                          initialState={{
                            pinnedColumns: {
                              left: ["no"],
                              right: [
                                "event_type",
                                "admin_confirm_event",
                                "manage",
                              ],
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
                          showToolbar={true}
                          slotProps={{
                            toolbar: {
                              csvOptions: { disableToolbarButton: true },
                              printOptions: { disableToolbarButton: true },
                              showQuickFilter: false,
                              excelOptions: {
                                disableToolbarButton:
                                  sessionUser.is_export == false ? true : false,
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
        onSubmit={handleDialogSubmit}
        onRadioChange={handleChangeRedio}
        onCommentChange={setComment}
      />
    </>
  );
}
