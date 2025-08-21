
import { useEffect, useMemo, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ApprovedSaveOnemailService from "../service/service";
import { useParams } from "react-router-dom";
import type { User } from "@/layouts/userType";
export default function UpdateOnEmailPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Updating...");

    const resultData: User | null = useMemo(() => {
        const userDataString = localStorage.getItem("user");
        return userDataString ? JSON.parse(userDataString) : null;
    }, []);
    const { plant, app_log, datetime } = useParams<{ plant: string, app_log: string, datetime: string }>();
    const closeTab = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
    };
    useEffect(() => {
        const updateData = async () => {
            if (!plant || !app_log || !datetime) {
                setMessage("Invalid or missing parameters.");
                setLoading(false);
                return;
            }
            const empNo = resultData?.emp_no;
            if (!empNo) {
                setMessage("User not found or employee number is missing.");
                setLoading(false);
                return;
            }
            try {
                // The service expects an object with an `admin_confirm` property.
                const approvalData = { admin_confirm: empNo };
                await ApprovedSaveOnemailService(plant, app_log, datetime, approvalData);
                setMessage("Update completed! This window will close shortly.");

                // รอให้ user เห็นข้อความสักนิด
                setTimeout(() => {
                    window.open("", "_self");  // เปลี่ยน context
                    window.close();            // แล้วปิด
                }, 1500);
            } catch (error) {
                console.error(error);
                setMessage("Update failed!");
                setLoading(false);
                setTimeout(() => {
                    window.open("", "_self");  // เปลี่ยน context
                    window.close();            // แล้วปิด
                }, 1500);
            }
        };

        updateData();
    }, [plant, app_log, datetime, resultData]);
    const handleOpenUpdate = () => {
        window.open("http://localhost:5173/CRUDLogs/applog/updateDateOnEmail/PLANT123/APP456/2025-08-22", "_blank");
    };

    return (
        <Container sx={{ textAlign: "center", mt: 5 }}>
            {loading ? (
                <>
                    <CircularProgress />
                    <Typography variant="h6" mt={2}>
                        {message}
                    </Typography>
                </>
            ) : (
                <Typography variant="h6" color="error">
                    {message}
                    <button onClick={handleOpenUpdate}>Close Tab</button>
                </Typography>
            )}
        </Container>
    );
}