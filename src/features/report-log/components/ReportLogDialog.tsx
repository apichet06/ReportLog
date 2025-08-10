import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import type { ChangeEvent } from 'react';


interface Props {
    open: boolean;
    valueRedio: string;
    comment: string;
    onClose: () => void;
    onSubmit: () => void;
    onRadioChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
            <DialogTitle>Confirm Event Log</DialogTitle>
            <DialogContent dividers>
                <FormControl>
                    <FormLabel>Confirm Event</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={valueRedio}
                        onChange={onRadioChange}
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
                    variant="outlined"
                    color="warning"
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='success' size='small' onClick={onSubmit} autoFocus>Save</Button>
                <Button onClick={onClose} size='small' >Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
