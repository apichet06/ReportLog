// import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from "@mui/material/Grid";
// import { type GridRowSelectionModel } from "@mui/x-data-grid";

import datetime from "@/shared/utils/handleDatetime";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type SyntheticEvent } from "react";
import reportSaveLog from "../service/saveReposrtService";
import type { MUIColor, ReportSaveLog } from "../types/reportsavelog";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Container from '@mui/material/Container';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from '@mui/material/Tab';
import TabPanel from "@mui/lab/TabPanel";
import ReportLogDialog from "../components/ReportLogDialog";
import Swal from "sweetalert2";
import type { User } from "@/layouts/userType";
import ReportLogToolbar from "../components/ReportLogToolbar";
import { getColumnsDCC } from "../constants/constants/reportLogDccColumns";
import { getColumnsDUC } from "../constants/constants/reportLogDucColumns"; // หมายเหตุ: columnsDuc อาจต้องปรับแก้ในลักษณะเดียวกันถ้ามีปุ่ม action
import ButtonGroup from '@mui/material/ButtonGroup';
import { DataGridPremium, type GridPaginationModel } from '@mui/x-data-grid-premium';



export default function Saved_Reports() {


  // const [paginationModel, setPaginationModel] = useState({
  //   page: 0,
  //   pageSize: 10,
  // });


  const [value, setValue] = useState('1');

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;


  const [tapData, setTapData] = useState('DUC');

  const [loadingDataGrid, setLoadnigDataGrid] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false)

  const [dataDuc, SetDataDUC] = useState<ReportSaveLog[]>([]);
  const [dataDcc, SetDataDCC] = useState<ReportSaveLog[]>();
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


  const [valueRedio, setValueRedio] = useState('Usual');
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };


  const handleClear = () => {
    SetTextSearch('');
    // setStartDate(null);
    // setEndDate(null);
  }


  const handleEditClick = useCallback((id: number) => {

    const activeData = value === '1' ? dataDuc : dataDcc;

    const rowToEdit = activeData?.find(row => row.id == id);


    if (rowToEdit) {
      // เพิ่มค่า fallback เพื่อป้องกัน error จากค่า null
      setValueRedio(rowToEdit.admin_confirm_event || 'Usual');
      setComment(rowToEdit.admin_confirm_comment || '');


      setEditingId(id);
      setOpen(true);
    } else {
      // กรณีหาข้อมูลไม่เจอ (ซึ่งไม่ควรเกิด)
      console.error(`Row with ID ${id} not found.`);
      Swal.fire("Error", `Could not find data for item ID: ${id}`, "error");
    }
  }, [dataDuc, dataDcc, value,]); // เพิ่ม dependencies เพื่อให้ function อัปเดตเมื่อข้อมูลเปลี่ยน



  const fetchDUC = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)

      let dateToday = "";
      let dateEndDate = "";

      if (dayHisDateduc == 1) {
        dateToday = datetime.DateSearch(new Date());
        dateEndDate = datetime.DateSearch(new Date());

      } else if (dayHisDateduc == 0) {

        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() - 1); // ลบ 1 วัน เพราะใน C# +1 วัน
        dateEndDate = datetime.DateSearch(targetDate);
      }

      const res = await reportSaveLog.GetSaveReportLogService({ tapData: "DUC", startDate: dateToday, endDate: dateEndDate });
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

      const res = await reportSaveLog.GetSaveReportLogService({ tapData: "DCC", startDate: dateToday, endDate: dateEndDate });
      SetDataDCC(res.data.result);
      setLoadnigDataGrid(false)
    } catch (err) {
      console.log(err);
    }
  }, [dayHisDatedcc]);



  const handleSearch = useCallback(async () => {
    try {
      setLoadnigDataGrid(true)

      const res = await reportSaveLog.SearchSaveReportLogService({ Search: textSearch, tapData });
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

      const res = await reportSaveLog.exportExcel({ Search: textSearch, startDate: dateToday, endDate: dateEndDate, tapData });

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

      await setLoadingExport(false)

    } catch (err) {
      console.log(err);
    }


  }, [dayHisDatedcc, dayHisDateduc, textSearch, tapData])


  useEffect(() => {
    fetchDUC();
    fetchDCC()
  }, [fetchDCC, fetchDUC]);



  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setComment("");
    setValueRedio('Usual');
  };


  const handleDialogSubmit = async () => {
    if (editingId === null) {
      console.error("Submit clicked, but no ID is being edited.");
      Swal.fire("Error", "No item was selected for editing.", "error");
      return;
    }

    const email = resultData?.emp_email ?? "";
    try {
      Swal.fire({
        title: `Are you sure?`,
        html: `<b>Action:</b> ${valueRedio}<br/><b>Comment:</b> ${conment || '<i>No comment</i>'}`,
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
          await reportSaveLog.ApprovedReportLogEditService(editingId, dataToSubmit);


          Swal.fire({
            title: "Success!",
            icon: "success",
          });
          handleClose(); // ปิด Dialog และรีเซ็ต state
          fetchDUC(); // อาจจะดึงข้อมูลใหม่เฉพาะส่วนที่เกี่ยวข้อง
          fetchDCC();
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

  // สร้าง config ของคอลัมน์ DCC โดยส่ง handler เข้าไป
  const dccColumns = useMemo(() => getColumnsDCC(handleEditClick), [handleEditClick]);
  const ducColumns = useMemo(() => getColumnsDUC(handleEditClick), [handleEditClick]);
  // const theme = useTheme();
  // const isExtraLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

  const isExtraLargeScreen = useMediaQuery('(min-width:1537px)');
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
                        <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={handleExportExcel} sx={{ ml: 2 }}> Export DUC </Button>
                      </Grid>
                    </Grid>
                    {/* {window.innerWidth} */}
                    <Container fixed disableGutters maxWidth={isExtraLargeScreen ? 'xl' : 'lg'}>
                      <DataGridPremium
                        getRowId={(row) => row.id.toString()}
                        loading={loadingDataGrid}
                        rows={dataDuc}
                        columns={ducColumns}
                        pagination
                        initialState={{ pinnedColumns: { left: ['no'], right: ['manage'] } }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
                        getRowClassName={(params) =>
                          params.row.unauthorized === "Y" ||
                            params.row.download_more_10_files_day === "Y" ||
                            params.row.employee_resigning_within_one_month === "Y"
                            ? "row--highlight"
                            : ""
                        }
                        sx={{
                          marginInline: '-9%',
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
                          <Button variant="contained" color={colerTodaydcc} onClick={() => (setsDayHisDateDcc(1), setColerTodayDcc("secondary"), setColerHistoryDcc("primary"))} >Today</Button>
                          <Button variant="contained" color={colerHistorydcc} onClick={() => (setsDayHisDateDcc(0), setColerTodayDcc("primary"), setColerHistoryDcc("secondary"))}>History</Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
                        <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={handleExportExcel} sx={{ ml: 2 }}> Export DCC </Button>
                      </Grid>
                    </Grid>
                    <Container fixed disableGutters maxWidth={isExtraLargeScreen ? 'xl' : 'lg'}>
                      <DataGridPremium
                        rows={dataDcc}
                        columns={dccColumns}
                        getRowId={(row) => row.id.toString()}
                        pagination
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => setPaginationModel(model)}
                        pageSizeOptions={[5, 10, 15, 20]}
                        initialState={{ pinnedColumns: { left: ['no'], right: ['manage'] } }}
                        getRowClassName={(params) =>
                          params.row.unauthorized === "Y" ||
                            params.row.download_more_10_files_day === "Y" ||
                            params.row.employee_resigning_within_one_month === "Y"
                            ? "row--highlight"
                            : ""
                        }
                        sx={{
                          marginInline: '-9%',
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
        </Grid >
      </Container >
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
