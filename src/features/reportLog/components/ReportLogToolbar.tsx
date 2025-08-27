import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import SearchIcon from "@mui/icons-material/Search";
// import CancelPresentation from "@mui/icons-material/CancelPresentation";



// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
interface Props {
    textSearch: string;
    onSearchChange: (value: string) => void;
    // onSearchClick: () => void;
    // onClearClick: () => void;

    // setDateStart: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    // setDatetEnd: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    dateStart: Dayjs | null;
    dateEnd: Dayjs | null;
}

export default function ReportLogToolbar({
    textSearch,
    onSearchChange,
    // onSearchClick,
    // onClearClick,
    // setDateStart,
    // setDatetEnd,
    // dateStart,
    // dateEnd,
}: Props) {
    return (
        <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                <TextField
                    label="Search..."
                    type="search"
                    size="small"
                    value={textSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                    fullWidth
                />
            </Grid>


            {/* <Grid size={{ xs: 12, sm: 12, md: 1.5, lg: 1, xl: 1 }}>
                <Button fullWidth variant="contained" onClick={onSearchClick} title="Search" aria-label="search">
                    <SearchIcon />
                </Button>
            </Grid> */}

        </Grid>
    );
}
