// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
// import { Tab, Box, Grid, ButtonGroup, Button } from "@mui/material";
// import { DataGrid, type GridRowSelectionModel } from "@mui/x-data-grid";
// import { useState, type SyntheticEvent } from "react";
// import type { ReportLog } from "../types/reportlog";
// import { columnsDuc } from "../constants/reportLogColumns";
// import SaveIcon from "@mui/icons-material/Save";
// import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

// type MUIColor = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'inherit';



// export default function ReportLogTabs() {

//     const [value, setValue] = useState('1');
//     const handleChange = (_event: SyntheticEvent, newValue: string) => {
//         setValue(newValue);
//     };

//     const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
//         [] as unknown as GridRowSelectionModel
//     );
//     const [loadingDataGrid, setLoadnigDataGrid] = useState(false);
//     const [tapData, setTapData] = useState('DUC');
//     const [dataDuc, SetDataDUC] = useState<ReportLog[]>();
//     const [dataDcc, SetDataDCC] = useState<ReportLog[]>();
//     const [colerTodayduc, setColerTodayDuc] = useState<MUIColor>("secondary");
//     const [colerHistoryduc, setColerHistoryDuc] = useState<MUIColor>("info");
//     const [colerTodaydcc, setColerTodayDcc] = useState<MUIColor>("secondary");
//     const [colerHistorydcc, setColerHistoryDcc] = useState<MUIColor>("info");

//     const [dayHisDateduc, setsDayHisDateDuc] = useState(1);
//     const [dayHisDatedcc, setsDayHisDateDcc] = useState(1);


//     return (
//         <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
//             <TabContext value={value}>
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                     <TabList onChange={handleChange} textColor="secondary"
//                         indicatorColor="secondary">
//                         <Tab label={`DUC Log (${dataDuc ? dataDuc.length : 0})`} value="1" onClick={() => setTapData('DUC')} />
//                         <Tab label={`DCC Log (${dataDcc ? dataDcc.length : 0})`} value="2" onClick={() => setTapData('DCC')} />
//                     </TabList>
//                 </Box>
//                 <TabPanel value="1">
//                     <Grid
//                         container
//                         spacing={2}
//                         justifyContent="start"
//                         alignItems="end"
//                     >
//                         <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-start" display="flex">
//                             <ButtonGroup
//                                 disableElevation
//                                 variant="outlined"
//                                 aria-label="Disabled button group"
//                             >
//                                 <Button variant="contained" color={colerTodayduc} onClick={() => (setsDayHisDateDuc(1), setColerTodayDuc("secondary"), setColerHistoryDuc("primary"))} >Today</Button>
//                                 <Button variant="contained" color={colerHistoryduc} onClick={() => (setsDayHisDateDuc(0), setColerTodayDuc("primary"), setColerHistoryDuc("secondary"))}>History</Button>
//                             </ButtonGroup>
//                         </Grid>

//                         <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
//                             <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save Duc</Button>
//                             <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DUC </Button>
//                         </Grid>
//                     </Grid>
//                     <DataGrid
//                         getRowId={(row) => row.id.toString()}
//                         loading={loadingDataGrid}
//                         rows={dataDuc}
//                         columns={columnsDuc}
//                         initialState={{ pagination: { paginationModel } }}
//                         pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
//                         checkboxSelection
//                         onRowSelectionModelChange={(newSelection) =>
//                             setSelectionModel(newSelection)
//                         }
//                         showToolbar={true}
//                         slotProps={{
//                             toolbar: {
//                                 csvOptions: { disableToolbarButton: true },
//                                 printOptions: { disableToolbarButton: true },
//                             },
//                         }}
//                         getRowClassName={(params) =>
//                             params.row.unauthorized === "Y" ||
//                                 params.row.download_more_10_files_day === "Y" ||
//                                 params.row.employee_resigning_within_one_month === "Y"
//                                 ? "row--highlight"
//                                 : ""
//                         }
//                         sx={{
//                             "& .row--highlight": {
//                                 bgcolor: "rgba(255,165,0,0.1)",
//                                 color: "orange",
//                                 "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" },
//                             },
//                             fontSize: "12px",
//                         }}
//                     />
//                 </TabPanel>
//                 <TabPanel value="2">
//                     <Grid
//                         container
//                         spacing={2}
//                         justifyContent="start"
//                         alignItems="end"
//                     >
//                         <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-start" display="flex">
//                             <ButtonGroup
//                                 disableElevation
//                                 variant="outlined"
//                                 aria-label="Disabled button group"
//                             >
//                                 <Button variant="contained" color={colerTodaydcc} onClick={() => (setsDayHisDateDcc(1), setColerTodayDcc("secondary"), setColerHistoryDcc("primary"))} >Today</Button>
//                                 <Button variant="contained" color={colerHistorydcc} onClick={() => (setsDayHisDateDcc(0), setColerTodayDcc("primary"), setColerHistoryDcc("secondary"))}>History</Button>
//                             </ButtonGroup>
//                         </Grid>

//                         <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
//                             <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save DCC</Button>
//                             <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DCC </Button>
//                         </Grid>
//                     </Grid>
//                     <Box style={{ width: '100%' }}>
//                         {/* <DataGrid
//                             getRowId={(row) => row.id.toString()}
//                             loading={loadingDataGrid}
//                             rows={dataDcc}
//                             columns={columnsDCC}
//                             initialState={{ pagination: { paginationModel } }}
//                             pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
//                             checkboxSelection
//                             onRowSelectionModelChange={(newSelection) =>
//                                 setSelectionModel(newSelection)
//                             }
//                             showToolbar={true}
//                             slotProps={{
//                                 toolbar: {
//                                     csvOptions: { disableToolbarButton: true },
//                                     printOptions: { disableToolbarButton: true },
//                                     // showQuickFilter: false,
//                                 },
//                             }}
//                             getRowClassName={(params) =>
//                                 params.row.unauthorized === "Y" ||
//                                     params.row.download_more_10_files_day === "Y" ||
//                                     params.row.employee_resigning_within_one_month === "Y"
//                                     ? "row--highlight"
//                                     : ""
//                             }
//                             sx={{
//                                 "& .row--highlight": {
//                                     bgcolor: "rgba(255,165,0,0.1)",
//                                     color: "orange",
//                                     "&:hover": { bgcolor: "rgba(0, 128, 0, 0.15)" },
//                                 },
//                                 fontSize: "12px",
//                             }}
//                         /> */}
//                     </Box>

//                 </TabPanel>
//             </TabContext>
//         </Box>
//     );
// }