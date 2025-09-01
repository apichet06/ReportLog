import useMediaQuery from '@mui/material/useMediaQuery';
import HistoryTable from "../components/HistoryTable";
import { useHistory } from "../hook/useHistory";
import ReportLogToolbar from '../components/ReportLogToolbar';
import { Box, Container, Grid } from '@mui/material';



export default function History() {
    const { row, setAppliedSearch, SetTextSearch, setDateStart, setDateEnd, setPendingStart, setPendingEnd, pendingStart, pendingEnd, textSearch, twoDaysAgo, loading } = useHistory();

    const handleClear = () => {
        setAppliedSearch("");
        SetTextSearch("");
        setDateStart(null);
        setDateEnd(null);
        setPendingStart(null);
        setPendingEnd(null);
    };
    const handleApplyDate = () => {
        if (pendingStart && pendingEnd) {
            setDateStart(pendingStart);
            setDateEnd(pendingEnd);
        }
        setAppliedSearch(textSearch);
    };

    const isBetween1201And1536 = useMediaQuery("(min-width:1201px) and (max-width:1536px)");
    const isAbove1537 = useMediaQuery("(min-width:1537px)");
    return (
        <>
            <Container
                fixed
                disableGutters
                maxWidth={isAbove1537 ? "xl" : "lg"}
            >
                <Grid container spacing={2} sx={{
                    ...(isAbove1537 ? { marginInline: "-9%" } : {}),
                    ...(isBetween1201And1536
                        ? { marginInline: "-10%" }
                        : {}),
                }}>
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} mt={2} >
                        <Box
                            component="form"
                            sx={{ "& .MuiTextField-root": { width: "100%" } }}
                            noValidate
                            autoComplete="off"
                        >
                            <ReportLogToolbar
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
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} mb={2}>
                        <h2>History Report</h2>
                    </Grid>
                </Grid>
            </Container>

            <HistoryTable
                rows={row}
                loading={loading}
                isBetween1201And1536={isBetween1201And1536}
                isAbove1537={isAbove1537}
            />
        </>
    )
}