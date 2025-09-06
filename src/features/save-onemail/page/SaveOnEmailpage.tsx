import { useCallback, useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ApprovedSaveOnemailService from "../service/service";
import { useNavigate, useParams } from "react-router-dom";
import { resultData } from "@/shared/utils/useToken";
import { sendPost } from "@/shared/utils/logout";

export default function UpdateOnEmailPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Updating...");
    const [countdown, setCountdown] = useState(4);
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { plant, app_log, datetime } = useParams<{
        plant: string;
        app_log: string;
        datetime: string;
    }>();

    const handlelogin = useCallback(async () => {

        const token = localStorage.getItem("token");
        if (!token) {
            sendPost()
        }
        return;
    }, [])

    useEffect(() => {
        handlelogin()
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
                const approvalData = { admin_confirm: empNo };
                await ApprovedSaveOnemailService(plant, app_log, datetime, approvalData);

                setMessage("Update completed! Redirecting...");
                setLoading(false);

                // เริ่ม countdown
                timerRef.current = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setCountdown(0); // โชว์ Go!
                            setTimeout(() => navigate("/saved_report"), 1000); // รอ 1 วิแล้ว redirect
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } catch (error) {
                console.error(error);
                setMessage("Update failed!");
                setLoading(false);
            }
        };

        updateData();
    }, [plant, app_log, datetime, navigate, handlelogin]);

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
                <Typography variant="h6" color="primary">
                    {countdown > 0 ? (
                        <p>
                            {message} ({countdown})
                        </p>
                    ) : (
                        ''
                    )}
                </Typography>
            )}
        </Container>
    );
}
