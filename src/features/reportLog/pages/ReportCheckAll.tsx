import { DataGridPremium, type GridRowId, type GridRowSelectionModel } from "@mui/x-data-grid-premium";
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
import type { ReportLog } from "../types/reportlog";
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
import ReportLogDialogCheckAll from "../components/ReportLogDialogCheckAll";
import ReportLogToolbars from "../components/ReportLogToolbars";

import { useMediaQuery } from "@mui/system";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
// import GetUserlogin from "@/shared/utils/serviceUser";
import type { User } from "@/layouts/userType";
import sharedUsers from "@/shared/hooks/sharedUsers";

export default function ReportCheckAll() {

    const twoDaysAgo = dayjs().subtract(1, "day");

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
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
    const [tapData, setTapData] = useState("DUC");
    const [loadingDataGrid, setLoadingDataGrid] = useState(false);
    const [textSearch, SetTextSearch] = useState<string>("");
    const [appliedSearch, setAppliedSearch] = useState<string>("");
    const [conment, setComment] = useState<string>("");


    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
    const [dataId, setDataId] = useState<GridRowId[]>([]);

    const [valueRedio, setValueRedio] = useState("Usual Event");
    const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
        setValueRedio((event.target as HTMLInputElement).value);
    };


    const [checkBoxdccUsual, setCheckBoxdccUsual] = useState("Usual Event");
    const [checkBoxdccUnusual, setCheckBoxdccUnusual] = useState("Unusual Event");
    const [checkBoxducUsual, setCheckBoxducUsual] = useState("Usual Event");
    const [checkBoxducUnusual, setCheckBoxducUnusual] = useState("Unusual Event");

    const handleClear = () => {
        setAppliedSearch("");
        SetTextSearch("");
        setDateStart(null);
        setDateEnd(null);
        setPendingStart(null);
        setPendingEnd(null);
    };





    // const handleClickOpen = () => {
    //     let numericIds = null;
    //     if (tapData == "DUC") numericIds = datasDuc.map((item) => Number(item.id));
    //     else numericIds = datasDcc.map((item) => Number(item.id));

    //     if (numericIds.length == 0) {
    //         Swal.fire({
    //             title: "No data to display!",
    //             icon: "warning",
    //         });
    //         return;
    //     }
    //     setDataId(numericIds);
    //     setOpen(true);
    // };


    const [pendingStart, setPendingStart] = useState<Dayjs | null>(null);
    const [pendingEnd, setPendingEnd] = useState<Dayjs | null>(null);

    const handleApplyDate = () => {
        if (pendingStart && pendingEnd) {
            setDateStart(pendingStart);
            setDateEnd(pendingEnd);
        }

        setAppliedSearch(textSearch);
    };



    const [datasDuc, setDatasDuc] = useState<ReportLog[]>([]);
    const [datasDcc, setDatasDcc] = useState<ReportLog[]>([]);
    const [ducCounts, setDucCounts] = useState({
        all: 0,

    });

    const [dccCounts, setDccCounts] = useState({
        all: 0,

    });



    const selectedIds = useMemo<GridRowId[]>(() => {
        if (tapData == "DUC") {
            if (Array.isArray(rowSelectionModel)) {
                return rowSelectionModel;
            }
            if (rowSelectionModel.type === 'exclude') {
                const allRowIds = new Set(datasDuc.map((r) => r.id));
                return Array.from(allRowIds);
            }

            if (rowSelectionModel.type === 'include') {
                return Array.from(rowSelectionModel.ids);
            }

        } else {
            if (Array.isArray(rowSelectionModel)) {
                return rowSelectionModel;
            }
            if (rowSelectionModel.type === 'exclude') {
                const allRowIds = new Set(datasDcc.map((r) => r.id));
                return Array.from(allRowIds);
            }

            if (rowSelectionModel.type === 'include') {
                return Array.from(rowSelectionModel.ids);
            }

        }


        return [];
    }, [datasDcc, datasDuc, rowSelectionModel, tapData]);

    // console.log(tapData, '-', selectedIds);

    const handleClickOpen = () => {

        // console.log(selectedIds.length);

        if (selectedIds.length == 0) {
            Swal.fire({
                title: "No data to display!",
                icon: "warning",
            });
            return;
        }
        setDataId(selectedIds);
        setOpen(true);
    };


    const fetchDuc = useCallback(async () => {
        try {
            setLoadingDataGrid(true);
            const plant = sessionUser?.plant;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const startDate = dateStart ? datetime.DateSearch(dateStart.toDate()) : "";
            const endDate = dateEnd ? datetime.DateSearch(dateEnd.toDate()) : datetime.DateSearch(yesterday);
            // ดึงข้อมูลมาแสดงในตาราง
            const res = await reportLogService.GetReportLogService({
                tapData: "DUC",
                startDate,
                endDate,
                checkBoxUsual: checkBoxducUsual,
                checkBoxUnusual: checkBoxducUnusual,
                plant,
                Search: appliedSearch
            });

            const newData = res.data.result.map((item: ReportLog, index: number) => ({
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
            const res = await reportLogService.GetReportLogService({
                tapData: "DCC",
                startDate,
                endDate: endDate,
                checkBoxUsual: checkBoxdccUsual,
                checkBoxUnusual: checkBoxdccUnusual,
                plant,
                Search: appliedSearch
            });
            const newData = res.data.result.map(
                (item: ReportLog, index: number) => ({
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
                                    <h2>Review Log</h2>
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
                                                    size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
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
                                                <Grid
                                                    size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                                                    mb={2.2}
                                                    justifyContent="flex-end"
                                                    display="flex"
                                                >
                                                    {sessionUser.is_accept && (
                                                        <Button
                                                            variant="contained"
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
                                                    checkboxSelection={sessionUser.is_accept}
                                                    disablePivoting
                                                    disableColumnSorting
                                                    disableColumnFilter
                                                    disableColumnMenu
                                                    paginationModel={paginationModel}
                                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                                        setRowSelectionModel(newRowSelectionModel);
                                                    }}
                                                    rowSelectionModel={rowSelectionModel}
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
                                                    size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
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
                                                <Grid
                                                    size={{ xs: 12, sm: 12, md: 2, lg: 12, xl: 12 }}
                                                    mb={2.2}
                                                    justifyContent="flex-end"
                                                    display="flex"

                                                >
                                                    {sessionUser.is_accept && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"

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
                                                    checkboxSelection={sessionUser.is_accept}
                                                    pagination
                                                    disablePivoting
                                                    disableColumnSorting
                                                    disableColumnFilter
                                                    disableColumnMenu
                                                    paginationModel={paginationModel}
                                                    onRowSelectionModelChange={(newRowSelectionModel) => {
                                                        setRowSelectionModel(newRowSelectionModel);
                                                    }}
                                                    rowSelectionModel={rowSelectionModel}
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
            <ReportLogDialogCheckAll
                open={open}
                onClose={handleClose}
                valueRedio={valueRedio}
                selectedIds={selectedIds}
                comment={conment}
                onSubmit={hendleSubmit}
                onRadioChange={handleChangeRedio}
                onCommentChange={setComment}
            />
        </>
    )
}
