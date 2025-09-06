import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import datetime from "@/shared/utils/handleDatetime";
import Box from "@mui/material/Box";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import reportSaveLog from "../service/saveReposrtService";
import type { ReportSaveLog } from "../types/reportsavelog";
import Container from "@mui/material/Container";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import ReportLogDialog from "../components/ReportLogDialog";
import Swal from "sweetalert2";
import ReportLogToolbars from "../components/ReportLogToolbars";
import { getColumnsDCC } from "../constants/reportLogDccColumns";
import { getColumnsDUC } from "../constants/reportLogDucColumns"; // หมายเหตุ: columnsDuc อาจต้องปรับแก้ในลักษณะเดียวกันถ้ามีปุ่ม action 
import {
  DataGridPremium,
  type GridPaginationModel,
} from "@mui/x-data-grid-premium";
import type { Dayjs } from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import type { User } from "@/layouts/userType";
import sharedUsers from "@/shared/hooks/sharedUsers";
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
  const [appliedSearch, setAppliedSearch] = useState<string>("");




  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [conment, setComment] = useState<string>("");

  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);

  const [datasDuc, setDatasDuc] = useState<ReportSaveLog[]>([]);
  const [datasDcc, setDatasDcc] = useState<ReportSaveLog[]>([]);
  const [checkBoxdccUsual, setCheckBoxdccUsual] = useState("Usual Event");
  const [checkBoxdccUnusual, setCheckBoxdccUnusual] = useState("Unusual Event");
  const [checkBoxducUsual, setCheckBoxducUsual] = useState("Usual Event");
  const [checkBoxducUnusual, setCheckBoxducUnusual] = useState("Unusual Event");

  const [valueRedio, setValueRedio] = useState("Usual Event");
  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio((event.target as HTMLInputElement).value);
  };

  const handleClear = () => {
    setAppliedSearch("");
    SetTextSearch("");
    setDateStart(null);
    setDateEnd(null);
    setPendingStart(null);
    setPendingEnd(null);
  };


  const [pendingStart, setPendingStart] = useState<Dayjs | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Dayjs | null>(null);

  const handleApplyDate = () => {
    if (pendingStart && pendingEnd) {
      setDateStart(pendingStart);
      setDateEnd(pendingEnd);
    }

    setAppliedSearch(textSearch);
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


  const [ducCounts, setDucCounts] = useState({
    all: 0,
  });

  const [dccCounts, setDccCounts] = useState({
    all: 0,
  });



  const fetchDuc = useCallback(async () => {
    try {
      setLoadingDataGrid(true);
      const plant = sessionUser?.plant;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const startDate = dateStart ? datetime.DateSearch(dateStart.toDate()) : "";
      const endDate = dateEnd ? datetime.DateSearch(dateEnd.toDate()) : datetime.DateSearch(yesterday);
      // ดึงข้อมูลมาแสดงในตาราง
      const res = await reportSaveLog.GetSaveReportLogService({
        tapData: "DUC",
        startDate,
        endDate,
        checkBoxUsual: checkBoxducUsual,
        checkBoxUnusual: checkBoxducUnusual,
        plant,
        Search: appliedSearch
      });

      const newData = res.data.result.map((item: ReportSaveLog, index: number) => ({
        ...item,
        no: index + 1,
      }));

      setDatasDuc(newData);

      // ---------- คำนวณ count ----------
      setDucCounts({
        all: newData.length
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDataGrid(false);
    }
  }, [checkBoxducUnusual, checkBoxducUsual, dateEnd, dateStart, sessionUser?.plant, appliedSearch]);



  const fetchDcc = useCallback(async () => {
    try {
      setLoadingDataGrid(true);
      const plant = sessionUser?.plant;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const startDate = dateStart ? datetime.DateSearch(dateStart.toDate()) : "";
      const endDate = dateEnd ? datetime.DateSearch(dateEnd.toDate()) : datetime.DateSearch(yesterday);
      const res = await reportSaveLog.GetSaveReportLogService({
        tapData: "DCC",
        startDate,
        endDate: endDate,
        checkBoxUsual: checkBoxdccUsual,
        checkBoxUnusual: checkBoxdccUnusual,
        plant,
        Search: appliedSearch
      });
      const newData = res.data.result.map(
        (item: ReportSaveLog, index: number) => ({
          ...item,
          no: index + 1,
        })
      );
      setDatasDcc(newData);
      setDccCounts({
        all: newData.length,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDataGrid(false);
    }
  }, [checkBoxdccUnusual, checkBoxdccUsual, dateEnd, dateStart, sessionUser?.plant, appliedSearch])

  useEffect(() => {
    fetchDuc()
    fetchDcc()

  }, [fetchDuc, fetchDcc]);



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
              <ReportLogToolbars
                textSearch={textSearch}
                onSearchChange={SetTextSearch}
                handleApplyDate={handleApplyDate}
                handleClear={handleClear}
                twoDaysAgo={twoDaysAgo}
                pendingStart={pendingStart}
                pendingEnd={pendingEnd}
                setPendingStart={setPendingStart}
                setPendingEnd={setPendingEnd}
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

                        />
                      )}

                      {appIds.includes("2") && (
                        <Tab
                          label={`DCC Log (${dccCounts.all})`}
                          value="2"

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
                          size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
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
                            params.row.admin_confirm_event === "Unusual Event" ? "row--highlight" : ""
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
                          size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
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
