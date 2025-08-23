
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ApprovedSaveOnemailService from "../service/service";
import { useParams } from "react-router-dom";
import { resultData } from "@/shared/utils/useToken";

export default function UpdateOnEmailPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Updating...");


    const { plant, app_log, datetime } = useParams<{ plant: string, app_log: string, datetime: string }>();
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
                window.close();
                setLoading(false);

            } catch (error) {
                console.error(error);
                setMessage("Update failed!");
                setLoading(false);
            }
        };

        updateData();
    }, [plant, app_log, datetime, resultData]);


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
                </Typography>
            )}
        </Container>
    );
}