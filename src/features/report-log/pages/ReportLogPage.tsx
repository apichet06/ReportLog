import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import SaveIcon from "@mui/icons-material/Save";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import { useReportLog } from "../hooks";
import { ReportLogTable } from "../components/ReportLogTable";
import type { User } from "@/layouts/userType";
import ReportLogDialog from "../components/ReportLogDialog";
import { columnsDuc } from "../constants/reportLogDucColumns";
import { columnsDCC } from "../constants/reportLogDccColumns";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useReportLogState } from "../hooks/useReportLogState";
import type { SyntheticEvent } from "react";
import ReportLogToolbar from "../components/ReportLogToolbar";


export default function ReportLogPage() {
  const state = useReportLogState();
  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString ? JSON.parse(userDataString) : null;
  const {
    ducData, dccData,
    loadingDataGrid,
    colerTodayduc, colerHistoryduc,
    colerTodaydcc, colerHistorydcc,
    setDayHisDatedcc, setDayHisDateduc,
    setColerTodayDuc, setColerTodayDcc,
    setColerHistoryDuc, setColerHistoryDcc,
    handleClickOpen,
    selectionModel,
    setSelectionModel,
    paginationModel,
    setPaginationModel,
    open, setOpen,
    conment, setComment,
    valueRedio, handleChangeRedio,
    handleSubmit, setTapData,
    loadingExport, textSearch, setTextSearch,
    handleExportExcel, handleSearch, handleClear
  } = useReportLog(resultData);

  const handleChange = (_event: SyntheticEvent, newValue: string) => {
    state.setValue(newValue);
  };


  const isExtraLargeScreen = useMediaQuery('(min-width:1537px)');
  const isBetween1201And1536 = useMediaQuery('(min-width:1201px) and (max-width:1536px)');
  const isAbove1537 = useMediaQuery('(min-width:1537px)');
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
                onSearchChange={setTextSearch}
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
                  <h2>Report Log</h2>
                </Grid>
              </Grid>
              <Grid size={12} >
                <TabContext value={state.value}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary">
                      <Tab
                        label={`DUC Log (${ducData?.length ?? 0})`}
                        value="1"
                        onClick={() => setTapData("DUC")}
                      />
                      <Tab
                        label={`DCC Log (${dccData?.length ?? 0})`}
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
                        <ButtonGroup>
                          <Button variant="contained" color={colerTodayduc} onClick={() => {
                            setDayHisDateduc(1);
                            setColerTodayDuc("secondary");
                            setColerHistoryDuc("primary");
                          }}>
                            Yesterday
                          </Button>
                          <Button variant="contained" color={colerHistoryduc} onClick={() => {
                            setDayHisDateduc(0);
                            setColerTodayDuc("primary");
                            setColerHistoryDuc("secondary");
                          }}>
                            History
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
                        <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save Duc</Button>
                        <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DUC </Button>
                      </Grid>
                    </Grid>
                    <Container disableGutters maxWidth={isExtraLargeScreen ? 'xl' : 'lg'}>
                      <ReportLogTable
                        rows={ducData}
                        columns={columnsDuc}
                        loading={loadingDataGrid}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        isAbove1537={isAbove1537}
                        isBetween1201And1536={isBetween1201And1536}
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
                        <ButtonGroup>
                          <Button variant="contained" color={colerTodaydcc} onClick={() => {
                            setDayHisDatedcc(1);
                            setColerTodayDcc("secondary");
                            setColerHistoryDcc("primary");
                          }}>
                            Yesterday
                          </Button>
                          <Button variant="contained" color={colerHistorydcc} onClick={() => {
                            setDayHisDatedcc(0);
                            setColerTodayDcc("primary");
                            setColerHistoryDcc("secondary");
                          }}>
                            History
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }} mb={3} justifyContent="flex-end" display="flex">
                        <Button variant="contained" color="success" onClick={handleClickOpen} startIcon={<SaveIcon />}> Save DCC</Button>
                        <Button variant="outlined" loading={loadingExport} loadingPosition="start" startIcon={<SystemUpdateAltIcon />} onClick={() => handleExportExcel()} sx={{ ml: 2 }}> Export DCC </Button>
                      </Grid>
                    </Grid>
                    <Container disableGutters maxWidth={isAbove1537 ? 'xl' : 'lg'}>
                      <ReportLogTable
                        rows={dccData}
                        columns={columnsDCC}
                        loading={loadingDataGrid}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        isAbove1537={isAbove1537}
                        isBetween1201And1536={isBetween1201And1536}
                      />
                    </Container>
                  </TabPanel>
                </TabContext>

              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ReportLogDialog
        open={open}
        valueRedio={valueRedio}
        comment={conment}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        onRadioChange={handleChangeRedio}
        onCommentChange={setComment}
      />

    </>
  )
}

