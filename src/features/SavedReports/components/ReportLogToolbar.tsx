import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

interface Props {
    textSearch: string;
    onSearchChange: (value: string) => void;


}

export default function ReportLogToolbar({
    textSearch,
    onSearchChange,

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

        </Grid>
    );
}
