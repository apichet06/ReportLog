import { Grid, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelPresentation from "@mui/icons-material/CancelPresentation";

interface Props {
    textSearch: string;
    onSearchChange: (value: string) => void;
    onSearchClick: () => void;
    onClearClick: () => void;
}

export default function ReportLogToolbar({
    textSearch,
    onSearchChange,
    onSearchClick,
    onClearClick,
}: Props) {
    return (
        <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 10 }}>
                <TextField
                    label="Search ALL"
                    type="search"
                    size="small"
                    value={textSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 1 }}>
                <Button fullWidth variant="contained" onClick={onSearchClick}>
                    <SearchIcon />
                </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 1 }}>
                <Button fullWidth variant="contained" color="error" onClick={onClearClick}>
                    <CancelPresentation />
                </Button>
            </Grid>
        </Grid>
    );
}
