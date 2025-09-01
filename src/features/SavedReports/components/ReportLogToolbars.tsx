import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from "@mui/icons-material/Search";
import CancelPresentation from "@mui/icons-material/CancelPresentation";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
interface Props {
    textSearch: string;
    onSearchChange: (value: string) => void;
    pendingStart: Dayjs | null;
    setPendingStart: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    pendingEnd: Dayjs | null;
    setPendingEnd: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    twoDaysAgo: Dayjs;
    handleApplyDate: () => void;
    handleClear: () => void;



}

export default function ReportLogToolbar({
    textSearch,
    onSearchChange,
    pendingStart,
    setPendingStart,
    pendingEnd,
    setPendingEnd,
    twoDaysAgo,
    handleApplyDate,
    handleClear,

}: Props) {
    return (
        <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 7, xl: 7 }}>
                <TextField
                    label="Search..."
                    type="search"
                    size="small"
                    value={textSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 10, lg: 5, xl: 5 }}  >

                <>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={2} alignItems="center" justifyContent="flex-end" display="flex">
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}  >
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
                            <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }} >
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
                            <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 2, xl: 2 }}>
                                <Button fullWidth variant="contained" onClick={handleApplyDate} title="Search" aria-label="search">
                                    <SearchIcon />
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 2, xl: 2 }}>
                                <Button fullWidth variant="contained" color="error" onClick={handleClear} title="Clear search" aria-label="clear search">
                                    <CancelPresentation />
                                </Button>
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </>

            </Grid>
        </Grid>
    );
}
