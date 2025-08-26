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

import type { User } from "@/layouts/userType";
import sharedUsers from "@/shared/hooks/sharedUsers";
export default function Saved_Reports() {

  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;
  const { sessionUser } = sharedUsers(resultData?.emp_no as string)


  const [tapData, setTapData] = useState("DUC");

  const [loadingDataGrid, setLoadigDataGrid] = useState(false);

  const [dataDuc, SetDataDUC] = useState<ReportSaveLog[]>([]);
  const [dataDcc, SetDataDCC] = useState<ReportSaveLog[]>([]);
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

  const countAllDuc = {
    ducYesterdayCount: 0,
    ducTwoDaysAgoCount: 0,
    ducAllCount: 0,
  };

  const countAllDcc = {
    dccYesterdayCount: 0,
    dccTwoDaysAgoCount: 0,
    dccAllCount: 0,
  };

  const [countsDucAll, setCountDucAll] = useState(countAllDuc);
  const [countsDccAll, setCountDccAll] = useState(countAllDcc);

  const [checkBoxdccUsual, setCheckBoxdccUsual] = useState("Usual Event");
  const [checkBoxdccUnusual, setCheckBoxdccUnusual] = useState("Unusual Event");
  const [checkBoxducUsual, setCheckBoxducUsual] = useState("Usual Event");
  const [checkBoxducUnusual, setCheckBoxducUnusual] = useState("Unusual Event");

  const [valueRedio, setValueRedio] = useState("Usual Event");
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };

  const handleClear = () => {
    SetTextSearch("");
    fetchData("DUC", dayHisDateduc, SetDataDUC);
    fetchData("DCC", dayHisDatedcc, SetDataDCC);
    setDateStart(null);
    setDateEnd(null);
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
      const activeData = value === "1" ? dataDuc : dataDcc;

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
    [dataDuc, dataDcc, value]
  );

  // เพิ่ม dependencies เพื่อให้ function อัปเดตเมื่อข้อมูลเปลี่ยน

  // const dataCount = useCallback(async () => {
  //   // Helper function สำหรับสร้างวันที่เป็น string เพื่อลดการเขียนโค้ดซ้ำ
  //   const createDateStr = (daysToSubtract: number): string => {
  //     const targetDate = new Date();
  //     targetDate.setDate(targetDate.getDate() - daysToSubtract);
  //     return datetime.DateSearch(targetDate);
  //   };

  //   const yesterdayStr = createDateStr(1);
  //   const twoDaysAgoStr = createDateStr(2);

  //   // พารามิเตอร์ร่วมที่ใช้ในการเรียก API ทุกครั้ง
  //   const commonParams = {
  //     checkBoxUsual,
  //     checkBoxUnusual,
  //   };

  //   // Helper function สำหรับเรียก API และคืนค่าจำนวนผลลัพธ์ พร้อมจัดการ error
  //   const getLogCount = async (params: object): Promise<number> => {
  //     try {
  //       const response = await reportSaveLog.GetSaveReportLogService(params);
  //       return response.data.result.length;
  //     } catch (error) {
  //       console.error(`Failed to fetch logs for params: ${JSON.stringify(params)}`, error);
  //       return 0; // คืนค่า 0 เพื่อป้องกันแอปพังเมื่อ API error
  //     }
  //   };

  //   try {
  //     // เรียก API ทั้งหมดพร้อมกัน (parallel) เพื่อประสิทธิภาพที่ดีกว่า
  //     const [ducYesterdayCount, dccYesterdayCount, ducTwoDaysAgoCount, dccTwoDaysAgoCount, dccAllCount, ducAllCount,
  //     ] = await Promise.all([

  //       getLogCount({ tapData: "DUC", startDate: yesterdayStr, endDate: yesterdayStr, ...commonParams }),
  //       getLogCount({ tapData: "DCC", startDate: yesterdayStr, endDate: yesterdayStr, ...commonParams }),
  //       getLogCount({ tapData: "DUC", endDate: twoDaysAgoStr, ...commonParams }),
  //       getLogCount({ tapData: "DCC", endDate: twoDaysAgoStr, ...commonParams }),
  //       getLogCount({ tapData: "DCC", ...commonParams }),
  //       getLogCount({ tapData: "DUC", ...commonParams }),
  //     ]);

  //     setCountDucAll({
  //       ducYesterdayCount, ducTwoDaysAgoCount, dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount, ducAllCount,
  //     });
  //     setCountDccAll({
  //       ducYesterdayCount, ducTwoDaysAgoCount, dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount, ducAllCount,
  //     });

  //   } catch (error) {
  //     // ดักจับ error ที่อาจเกิดจาก Promise.all
  //     console.error("An error occurred while fetching report counts in parallel:", error);
  //   }
  // }, [checkBoxUnusual, checkBoxUsual]);

  const dataCount = useCallback(async () => {
    const createDateStr = (daysToSubtract: number): string => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysToSubtract);
      return datetime.DateSearch(targetDate);
    };

    const yesterdayStr = createDateStr(1);
    const twoDaysAgoStr = createDateStr(2);
    const plant = sessionUser.plant;
    const getLogCount = async (params: object): Promise<number> => {
      try {
        const response = await reportSaveLog.GetSaveReportLogService(params);
        return response.data.result.length;
      } catch (error) {
        console.error(
          `Failed to fetch logs for params: ${JSON.stringify(params)}`,
          error
        );
        return 0;
      }
    };

    try {
      // DUC ใช้ checkBoxducUsual, checkBoxducUnusual
      const [ducYesterdayCount, ducTwoDaysAgoCount, ducAllCount] =
        await Promise.all([
          getLogCount({
            tapData: "DUC",
            startDate: yesterdayStr,
            endDate: yesterdayStr,
            checkBoxUsual: checkBoxducUsual,
            checkBoxUnusual: checkBoxducUnusual,
            plant,
            Search: textSearch,
          }),
          getLogCount({
            tapData: "DUC",
            endDate: twoDaysAgoStr,
            checkBoxUsual: checkBoxducUsual,
            checkBoxUnusual: checkBoxducUnusual,
            plant,
            Search: textSearch,
          }),
          getLogCount({
            tapData: "DUC",
            checkBoxUsual: checkBoxducUsual,
            checkBoxUnusual: checkBoxducUnusual,
            plant,
            Search: textSearch,
          }),
        ]);

      // DCC ใช้ checkBoxdccUsual, checkBoxdccUnusual
      const [dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount] =
        await Promise.all([
          getLogCount({
            tapData: "DCC",
            startDate: yesterdayStr,
            endDate: yesterdayStr,
            checkBoxUsual: checkBoxdccUsual,
            checkBoxUnusual: checkBoxdccUnusual,
            plant,
            Search: textSearch,
          }),
          getLogCount({
            tapData: "DCC",
            endDate: twoDaysAgoStr,
            checkBoxUsual: checkBoxdccUsual,
            checkBoxUnusual: checkBoxdccUnusual,
            plant,
            Search: textSearch,
          }),
          getLogCount({
            tapData: "DCC",
            checkBoxUsual: checkBoxdccUsual,
            checkBoxUnusual: checkBoxdccUnusual,
            plant,
            Search: textSearch,
          }),
        ]);

      setCountDucAll({ ducYesterdayCount, ducTwoDaysAgoCount, ducAllCount });
      setCountDccAll({ dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount });
    } catch (error) {
      console.error("An error occurred while fetching report counts:", error);
    }
  }, [
    sessionUser.plant,
    checkBoxducUsual,
    checkBoxducUnusual,
    checkBoxdccUsual,
    checkBoxdccUnusual
  ]);

  const fetchData = useCallback(
    async (
      tapData: "DUC" | "DCC",
      dayHistory: number,
      setData: (data: ReportSaveLog[]) => void
    ) => {
      try {
        setLoadigDataGrid(true);
        const plant = sessionUser?.plant;
        console.log(tapData);

        const { startDate, endDate } = datetime.buildDateParams(dayHistory);
        const checkBoxUsual =
          tapData === "DUC" ? checkBoxducUsual : checkBoxdccUsual;
        const checkBoxUnusual =
          tapData === "DUC" ? checkBoxducUnusual : checkBoxdccUnusual;
        const res = await reportSaveLog.GetSaveReportLogService({
          tapData,
          startDate,
          endDate,
          checkBoxUsual,
          checkBoxUnusual,
          plant,
        });

        const newData = res.data.result.map(
          (item: ReportSaveLog, index: number) => ({
            ...item,
            no: index + 1,
          })
        );

        setData(newData);
        SetTextSearch("");
        setDateStart(null);
        setDateEnd(null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadigDataGrid(false);
      }
    },
    [checkBoxducUsual, checkBoxdccUsual, checkBoxducUnusual, checkBoxdccUnusual, sessionUser?.plant]
  );

  const handleSearch = useCallback(
    async (dayHistory: number, setData: (data: ReportSaveLog[]) => void) => {
      try {

        setLoadigDataGrid(true);
        const plant = sessionUser.plant;
        const { startDate, endDate } = datetime.buildDateParamsSearch(
          dayHistory,
          dateStart,
          dateEnd
        );
        const checkBoxUsual =
          tapData === "DUC" ? checkBoxducUsual : checkBoxdccUsual;
        const checkBoxUnusual =
          tapData === "DUC" ? checkBoxducUnusual : checkBoxdccUnusual;

        const res = await reportSaveLog.SearchSaveReportLogService({
          Search: textSearch,
          tapData,
          startDate,
          endDate,
          checkBoxUsual,
          checkBoxUnusual,
          plant
        });

        const newData = res.data.result.map(
          (item: ReportSaveLog, index: number) => ({
            ...item,
            no: index + 1,
          })
        );

        setData(newData);
      } catch (err) {
        console.log(err);
      } finally {

        setLoadigDataGrid(false);
      }
    },
    [
      sessionUser.plant,
      dateStart,
      dateEnd,
      tapData,
      checkBoxducUsual,
      checkBoxdccUsual,
      checkBoxducUnusual,
      checkBoxdccUnusual,
      textSearch,
    ]
  );



  useEffect(() => {
    fetchData("DUC", dayHisDateduc, SetDataDUC);
    fetchData("DCC", dayHisDatedcc, SetDataDCC);
    dataCount();
  }, [dataCount, fetchData, dayHisDateduc, dayHisDatedcc]);

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
          fetchData("DUC", dayHisDateduc, SetDataDUC);
          fetchData("DCC", dayHisDatedcc, SetDataDCC);
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
  const handleSearchAll = async () => {
    await handleSearch(Number(dayHisDateduc), SetDataDUC);
    await handleSearch(Number(dayHisDatedcc), SetDataDCC);
  };

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
                onSearchClick={handleSearchAll}
                onClearClick={handleClear}
                setDateStart={setDateStart}
                setDatetEnd={setDateEnd}
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
                          label={`DUC Log (${countsDucAll.ducAllCount})`}
                          value="1"
                          onClick={() => { setTapData("DUC"), handleClear() }}
                        />
                      )}

                      {appIds.includes("2") && (
                        <Tab
                          label={`DCC Log (${countsDccAll.dccAllCount})`}
                          value="2"
                          onClick={() => { setTapData("DCC"), handleClear() }}
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
                              Latest Data ({countsDucAll.ducYesterdayCount})
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
                              Previous Data ({countsDucAll.ducTwoDaysAgoCount})
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
                          rows={dataDuc}
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
                              Latest Data ({countsDccAll.dccYesterdayCount})
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
                              Previous Data ({countsDccAll.dccTwoDaysAgoCount})
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
                      </Grid>
                      <Container
                        fixed
                        disableGutters
                        maxWidth={isAbove1537 ? "xl" : "lg"}
                      >
                        <DataGridPremium
                          rows={dataDcc}
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
