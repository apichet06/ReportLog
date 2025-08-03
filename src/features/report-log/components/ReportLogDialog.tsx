import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel
} from '@mui/material';

interface Props {
    open: boolean;
    valueRedio: string;
    comment: string;
    onClose: () => void;
    onSubmit: () => void;
    onRadioChange: (val: string) => void;
    onCommentChange: (val: string) => void;
}

export default function ReportLogDialog({
    open,
    valueRedio,
    comment,
    onClose,
    onSubmit,
    onRadioChange,
    onCommentChange,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Form Accept</DialogTitle>
            <DialogContent dividers>
                <FormControl>
                    <FormLabel>Confirm Event</FormLabel>
                    <RadioGroup
                        row
                        value={valueRedio}
                        onChange={(e) => onRadioChange(e.target.value)}
                    >
                        <FormControlLabel value="Usual" control={<Radio />} label="Usual Event" />
                        <FormControlLabel value="Unusual" control={<Radio />} label="Unusual Event" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label="Comment"
                    multiline
                    rows={4}
                    fullWidth
                    variant="filled"
                    color="success"
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit}>Save</Button>
                <Button onClick={onClose} autoFocus>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
