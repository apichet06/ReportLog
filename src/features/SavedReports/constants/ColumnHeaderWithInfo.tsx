// components/ColumnHeaderWithInfo.tsx
import React from "react";
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import InfoIcon from "@mui/icons-material/Info";
import { columnDescriptionsEN } from "../types/reportLogColumnDescriptions";

interface Props {
    field: string;
    label: string;

}

export default function ColumnHeaderWithInfo({ field, label }: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {label}
            <IconButton size="small" onClick={handleClick}>
                <InfoIcon fontSize="inherit" />
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Typography sx={{ p: 2, maxWidth: 250 }}>
                    {columnDescriptionsEN[field] ?? "No description available"}
                </Typography>
            </Popover>
        </div>
    );
}
