import {
  DataGridPremium,
} from "@mui/x-data-grid-premium";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";
import reportLogService from "../service/reportlogService";
import type { MUIColor, ReportLog } from "../types/reportlog";
import Swal from "sweetalert2";
import datetime from "@/shared/utils/handleDatetime";

import SaveIcon from "@mui/icons-material/Save";
// import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import type { User } from "@/layouts/userType";
import { columnsDuc } from "../constants/reportLogDucColumns";
import { columnsDCC } from "../constants/reportLogDccColumns";
import ReportLogDialog from "../components/ReportLogDialog";
import ButtonGroup from '@mui/material/ButtonGroup';
import ReportLogToolbar from "../components/ReportLogToolbar";

import { useMediaQuery } from "@mui/system";
import type { Dayjs } from "dayjs";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function ReportLogPage() {

  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;

  // const { id, tap } = useParams<{ id: string, tap: string }>();

  const [value, setValue] = useState('1');

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setComment("");
    setValueRedio('Usual Event');
  };


  const [tapData, setTapData] = useState('DUC');

  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);
  // const [loadingExport, setLoadingExport] = useState(false)


  const [dataDuc, SetDataDUC] = useState<ReportLog[]>([]);
  const [dataDcc, SetDataDCC] = useState<ReportLog[]>([]);
  const [textSearch, SetTextSearch] = useState<string>("");

  const [conment, setComment] = useState<string>("");
  const [colerTodayduc, setColerTodayDuc] = useState<MUIColor>("secondary");
  const [colerHistoryduc, setColerHistoryDuc] = useState<MUIColor>("info");
  const [colerTodaydcc, setColerTodayDcc] = useState<MUIColor>("secondary");
  const [colerHistorydcc, setColerHistoryDcc] = useState<MUIColor>("info");

  const [dayHisDateduc, setsDayHisDateDuc] = useState(1);
  const [dayHisDatedcc, setsDayHisDateDcc] = useState(1);

  const [checkBoxkUsual, setCheckBoxUsual] = useState("Usual Event");
  const [checkBoxkUnusual, setCheckBoxUnusual] = useState("Unusual Event");

  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);

  const [valueRedio, setValueRedio] = useState('Usual Event');
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };


  const countAll = {
    ducYesterdayCount: 0,
    dccYesterdayCount: 0,
    ducTwoDaysAgoCount: 0,
    dccTwoDaysAgoCount: 0,
    dccAllCount: 0,
    ducAllCount: 0
  }

  const [countsDucAll, setCountDucAll] = useState(countAll);
  const [countsDccAll, setCountDccAll] = useState(countAll);


  const handleClear = () => {
    SetTextSearch('');
    fetchData("DUC", dayHisDateduc, SetDataDUC);
    fetchData("DCC", dayHisDatedcc, SetDataDCC);

  }

  // const fetchDUC = useCallback(async () => {
  //   try {
  //     setLoadnigDataGrid(true)

  //     let dateToday = "";
  //     let dateEndDate = "";

  //     if (dayHisDateduc == 1) {
  //       const targetDate = new Date()
  //       targetDate.setDate(targetDate.getDate() - 1)
  //       dateToday = datetime.DateSearch(targetDate);
  //       dateEndDate = datetime.DateSearch(targetDate);

  //     } else if (dayHisDateduc == 0) {

  //       // const targetDate = new Date("2025-07-14");
  //       const targetDate = new Date();
  //       targetDate.setDate(targetDate.getDate() - 2); // ลบ 1 วัน เพราะใน C# +1 วัน
  //       dateEndDate = datetime.DateSearch(targetDate);
  //     }

  //     const res = await reportLogService.GetReportLogService({ tapData: "DUC", startDate: dateToday, endDate: dateEndDate });
  //     SetDataDUC(res.data.result);
  //     setLoadnigDataGrid(false)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [dayHisDateduc]);



  // const fetchDCC = useCallback(async () => {
  //   try {
  //     setLoadnigDataGrid(true)
  //     let dateToday = "";
  //     let dateEndDate = "";

  //     if (dayHisDatedcc == 1) {
  //       const targetDate = new Date()
  //       targetDate.setDate(targetDate.getDate() - 1)
  //       dateToday = datetime.DateSearch(targetDate);
  //       dateEndDate = datetime.DateSearch(targetDate);

  //     } else if (dayHisDatedcc == 0) {

  //       const targetDate = new Date()
  //       targetDate.setDate(targetDate.getDate() - 2); // ลบ 2 วัน เพราะใน C# +1 วัน
  //       dateEndDate = datetime.DateSearch(targetDate);
  //     }


  //     const res = await reportLogService.GetReportLogService({ tapData: "DCC", startDate: dateToday, endDate: dateEndDate });
  //     SetDataDCC(res.data.result);
  //     setLoadnigDataGrid(false)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [dayHisDatedcc]);


  const fetchData = useCallback(
    async (tapData: "DUC" | "DCC", dayHistory: number, setData: (data: ReportLog[]) => void) => {
      try {
        setLoadnigDataGrid(true);

        const { startDate, endDate } = datetime.buildDateParams(dayHistory);

        const res = await reportLogService.GetReportLogService({
          tapData,
          startDate,
          endDate,
          checkBoxkUsual,
          checkBoxkUnusual,
        });

        const newData = res.data.result.map((item: ReportLog, index: number) => ({
          ...item,
          no: index + 1,
        }));

        setData(newData);
        SetTextSearch("");
        setDateStart(null)
        setDateEnd(null)
      } catch (err) {
        console.log(err);
      } finally {
        setLoadnigDataGrid(false);
      }
    },
    [checkBoxkUnusual, checkBoxkUsual]
  );

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

  const dataCount_new = useCallback(async () => {
    // Helper function สำหรับสร้างวันที่เป็น string เพื่อลดการเขียนโค้ดซ้ำ
    const createDateStr = (daysToSubtract: number): string => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - daysToSubtract);
      return datetime.DateSearch(targetDate);
    };

    const yesterdayStr = createDateStr(1);
    const twoDaysAgoStr = createDateStr(2);

    // พารามิเตอร์ร่วมที่ใช้ในการเรียก API ทุกครั้ง
    const commonParams = {
      checkBoxkUsual,
      checkBoxkUnusual,
    };

    // Helper function สำหรับเรียก API และคืนค่าจำนวนผลลัพธ์ พร้อมจัดการ error
    const getLogCount = async (params: object): Promise<number> => {
      try {
        const response = await reportLogService.GetReportLogService(params);
        return response.data.result.length;
      } catch (error) {
        console.error(`Failed to fetch logs for params: ${JSON.stringify(params)}`, error);
        return 0; // คืนค่า 0 เพื่อป้องกันแอปพังเมื่อ API error
      }
    };

    try {
      // เรียก API ทั้งหมดพร้อมกัน (parallel) เพื่อประสิทธิภาพที่ดีกว่า
      const [ducYesterdayCount, dccYesterdayCount, ducTwoDaysAgoCount, dccTwoDaysAgoCount, dccAllCount, ducAllCount,
      ] = await Promise.all([

        getLogCount({ tapData: "DUC", startDate: yesterdayStr, endDate: yesterdayStr, ...commonParams }),
        getLogCount({ tapData: "DCC", startDate: yesterdayStr, endDate: yesterdayStr, ...commonParams }),
        getLogCount({ tapData: "DUC", endDate: twoDaysAgoStr, ...commonParams }),
        getLogCount({ tapData: "DCC", endDate: twoDaysAgoStr, ...commonParams }),
        getLogCount({ tapData: "DCC", ...commonParams }),
        getLogCount({ tapData: "DUC", ...commonParams }),
      ]);

      setCountDucAll({
        ducYesterdayCount, ducTwoDaysAgoCount, dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount, ducAllCount,
      });
      setCountDccAll({
        ducYesterdayCount, ducTwoDaysAgoCount, dccYesterdayCount, dccTwoDaysAgoCount, dccAllCount, ducAllCount,
      });

    } catch (error) {
      // ดักจับ error ที่อาจเกิดจาก Promise.all
      console.error("An error occurred while fetching report counts in parallel:", error);
    }
  }, [checkBoxkUnusual, checkBoxkUsual]);


  useEffect(() => {
    dataCount_new()
    fetchData("DUC", dayHisDateduc, SetDataDUC);
    fetchData("DCC", dayHisDatedcc, SetDataDCC);
  }, [dataCount_new, dayHisDatedcc, dayHisDateduc, fetchData]);




  const hendleSubmit = async () => {
    const email = resultData?.emp_email ?? "";
    try {
      Swal.fire({
        title: "Are you sure?",
        html: `<b>Action:</b> ${valueRedio}<br/><b>Comment:</b> ${conment || '<i>No comment</i>'}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Success!",
            text: `Report log total `,
            icon: "success",
          });
          await reportLogService.ApprovedReportLogService(email, valueRedio, conment);

          handleClose();
          fetchData("DUC", dayHisDateduc, SetDataDUC);
          fetchData("DCC", dayHisDatedcc, SetDataDCC);
        }
      });

    } catch (err) {
      console.error(err);

    }
  };

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const isBetween1201And1536 = useMediaQuery("(min-width:1201px) and (max-width:1536px)");
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

              <ReportLogToolbar
                textSearch={textSearch}
                onSearchChange={SetTextSearch}
                onSearchClick={handleSearch}
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
                <Grid size={{ xs: 11, sm: 11, md: 11, lg: 8, xl: 8 }} >
                  <h2>Report Log</h2>
                </Grid>
              </Grid>
              <Grid size={12} >
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} textColor="secondary"
                      indicatorColor="secondary">
                      <Tab
                        label={`DUC Log (${countsDucAll.ducAllCount})`}
                        value="1"
                        onClick={() => setTapData("DUC")}
                      />
                      <Tab
                        label={`DCC Log (${countsDccAll.dccAllCount})`}
                        value="2"
                        onClick={() => setTapData("DCC")}
                      />
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
                          <Button
                            variant="contained"
                            color={colerTodayduc}
                            onClick={() => {
                              setsDayHisDateDuc(1);
                              setColerTodayDuc("secondary");
                              setColerHistoryDuc("primary");
                            }}
                          > Latest Data ({countsDucAll.ducYesterdayCount}) </Button>
                          <Button
                            variant="contained"
                            color={colerHistoryduc}
                            onClick={() => {
                              setsDayHisDateDuc(0);
                              setColerTodayDuc("primary");
                              setColerHistoryDuc("secondary");
                            }}
                          > Previous Data ({countsDucAll.ducTwoDaysAgoCount})</Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={1}
                        justifyContent="flex-end"
                        display="flex">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checkBoxkUsual === "Usual Event"}
                              onChange={(e) =>
                                setCheckBoxUsual(e.target.checked ? "Usual Event" : "")
                              }
                            />
                          }
                          label="Usual Event"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checkBoxkUnusual === "Unusual Event"}
                              onChange={(e) =>
                                setCheckBoxUnusual(e.target.checked ? "Unusual Event" : "")
                              }
                            />
                          }
                          label="Unusual Event"
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }} mb={2} justifyContent="flex-end" display="flex">
                        <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save</Button>
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
                        rows={dataDuc}
                        columns={columnsDuc}
                        pagination
                        disablePivoting
                        disableColumnSorting
                        disableColumnFilter
                        disableColumnMenu
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => setPaginationModel(model)}
                        initialState={{
                          pinnedColumns: { left: ['__check__', 'no'], right: ['event_type'] }
                        }}
                        pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                        showToolbar={true}
                        slotProps={{
                          toolbar: {
                            csvOptions: { disableToolbarButton: true },
                            printOptions: { disableToolbarButton: true },
                            showQuickFilter: false,
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
                            Previous Data ({countsDccAll.dccTwoDaysAgoCount}
                            )
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={1}
                        justifyContent="flex-end"
                        display="flex">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checkBoxkUsual === "Usual Event"}
                              onChange={(e) =>
                                setCheckBoxUsual(e.target.checked ? "Usual Event" : "")
                              }
                            />
                          }
                          label="Usual Event"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checkBoxkUnusual === "Unusual Event"}
                              onChange={(e) =>
                                setCheckBoxUnusual(e.target.checked ? "Unusual Event" : "")
                              }
                            />
                          }
                          label="Unusual Event"
                        />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }} mb={2} justifyContent="flex-end" display="flex">
                        <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save</Button>
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
                        rows={dataDcc}
                        columns={columnsDCC}
                        pagination
                        disablePivoting
                        disableColumnSorting
                        disableColumnFilter
                        disableColumnMenu
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => setPaginationModel(model)}
                        initialState={{
                          pinnedColumns: { left: ['__check__', 'no'], right: ['event_type'] }
                        }}
                        pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                        showToolbar={true}
                        slotProps={{
                          toolbar: {
                            csvOptions: { disableToolbarButton: true },
                            printOptions: { disableToolbarButton: true },
                            showQuickFilter: false,
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
