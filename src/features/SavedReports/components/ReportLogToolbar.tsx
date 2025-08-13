import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from "@mui/icons-material/Search";
import CancelPresentation from "@mui/icons-material/CancelPresentation";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
interface Props {
    textSearch: string;
    onSearchChange: (value: string) => void;
    onSearchClick: () => void;
    onClearClick: () => void;
    setCheckBoxUsual: React.Dispatch<React.SetStateAction<string>>;
    setCheckBoxUnusual: React.Dispatch<React.SetStateAction<string>>;
    checkBoxkUsual: string;
    checkBoxkUnusual: string;
}

export default function ReportLogToolbar({
    textSearch,
    onSearchChange,
    onSearchClick,
    onClearClick,
    setCheckBoxUsual,
    setCheckBoxUnusual,
    checkBoxkUsual,
    checkBoxkUnusual,
}: Props) {
    return (
        <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid size={{ xs: 12, sm: 12, md: 10, lg: 7, xl: 7 }}>
                <TextField
                    label="Search..."
                    type="search"
                    size="small"
                    value={textSearch}
                    onChange={(e) => onSearchChange(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
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
            <Grid size={{ xs: 12, sm: 12, md: 1, lg: 1, xl: 1 }}>
                <Button fullWidth variant="contained" onClick={onSearchClick} title="Search" aria-label="search">
                    <SearchIcon />
                </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 1, lg: 1, xl: 1 }}>
                <Button fullWidth variant="contained" color="error" onClick={onClearClick} title="Clear search" aria-label="clear search">
                    <CancelPresentation />
                </Button>
            </Grid>
        </Grid>
    );
}
