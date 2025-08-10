// components/StatusIconCell.tsx

import Box from '@mui/material/Box';
export const StatusIconCell = ({ value }: { value: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {value === "Y" ? (
            <img src="/CRUDLogs/applog/img/alert.png" width="20px" height="20px" alt="Alert" />
        ) : (
            <img src="/CRUDLogs/applog/img/success.png" width="20px" height="20px" alt="Success" />
        )}
    </Box>
);


