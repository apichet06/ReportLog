import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ReportLogDialog from "../components/ReportLogDialog";

import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from '@mui/icons-material/Clear';
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import Swal from "sweetalert2";
import datetime from "@/shared/utils/handleDatetime";
import type { ReportLog } from '../types/reportlog';
import reportLogService from '../service/reportlogService';

import type { User } from '@/layouts/userType';
import sharedUsers from '@/shared/hooks/sharedUsers';

export default function ReportLogByIdPage() {


    const userDataString = localStorage.getItem("user");
    const resultData: User | null = userDataString
        ? JSON.parse(userDataString)
        : null;
    const { sessionUser } = sharedUsers(resultData?.emp_no as string)


    const { id, tap } = useParams<{ id: string, tap: string }>();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [data, setData] = useState<ReportLog | null>(null);
    // const navigatoin = useNavigate();
    const [open, setOpen] = useState(false);
    const [conment, setComment] = useState<string>("");

    const [valueRedio, setValueRedio] = useState('Usual Event');
    const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
        setValueRedio((event.target as HTMLInputElement).value);
    };

    const close = () => {
        window.close();
    }

    const handlePopup = () => {
        setOpen(true);
    };


    const LoadingData = useCallback(async () => {
        try {
            const res = await reportLogService.GetReportLogById(Number(id));

            if (res.data?.result.length > 0) {
                setData(res.data?.result[0])
                setEditingId(res.data?.result[0].id)
            }
        } catch (error) {
            console.log(error);
        }
    }, [id])


    const handleDialogSubmit = async () => {
        if (editingId === null) {
            console.error("Submit clicked, but no ID is being edited.");
            Swal.fire("Error", "No item was selected for editing.", "error");
            return;
        }

        const email = sessionUser?.emp_email ?? "";
        try {
            Swal.fire({
                title: `Are you sure?`,
                html: `<b>Action:</b> ${valueRedio}<br/><b>Comment:</b> ${conment || '<i>No comment</i>'}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Save it!",
            }).then(async (result) => {
                if (result.isConfirmed) {

                    const dataToSubmit = {
                        Admin_confirm: email,
                        Admin_confirm_comment: conment,
                        Admin_confirm_event: valueRedio,
                    };
                    await reportLogService.ApprovedReportLogByIDService(editingId, dataToSubmit);


                    Swal.fire({
                        title: "Success!",
                        icon: "success",
                    });
                    setEditingId(null); // ปิด Dialog และรีเซ็ต state
                    setOpen(false)
                    LoadingData();
                }
            });

        } catch (err) {
            console.error(err);
        }
    };




    useEffect(() => {
        LoadingData();
    }, [LoadingData,]);

    const color = data?.admin_confirm_event === "Usual Event" ? "green" : "red";
    const colorevent = data?.event_type === "Usual Event" ? "green" : "red";

    return (
        <>

            <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
                <Card sx={{ maxWidth: 1000, margin: "auto", borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Report Log Detail
                            {/* (ID: {data?.id}) */}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    GROUP NAME
                                </Typography>
                                <Typography variant="body1">{data?.group_name}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    USERNAME
                                </Typography>
                                <Typography variant="body1">{data?.username?.trim()}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    BU
                                </Typography>
                                <Typography variant="body1">{data?.bu || "-"}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    POSITION
                                </Typography>
                                <Typography variant="body1">{data?.position || "-"}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    ACTION
                                </Typography>
                                <Typography variant="body1">{data?.action}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    ACTION DATE/TIME
                                </Typography>
                                <Typography variant="body1">
                                    <>
                                        {data?.action_date_time
                                            ? datetime.DateTimeLongTH(new Date(data.action_date_time))
                                            : "-"}
                                    </>
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    DETAIL
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        wordBreak: "break-word",
                                        backgroundColor: "#fafafa",
                                        p: 1,
                                        borderRadius: 1,
                                    }}
                                >
                                    {data?.detail}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    EVENT TYPE
                                </Typography>
                                <Typography variant="body1" color={colorevent}>{data?.event_type}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    RESINGNED DATE
                                </Typography>
                                <Typography variant="body1">{data?.resigned_date || "-"}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    DAY AFTER ACTION
                                </Typography>
                                <Typography variant="body1" >{data?.days_after_action || "-"}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    UNAUTHORIZED
                                </Typography>
                                <Typography variant="body1">
                                    {data?.unauthorized == 'Y' ?
                                        <>
                                            <img src="/CRUDLogs/applog/img/alert.png" width="20px" height="20px" alt="Alert" />
                                        </>
                                        :
                                        <>
                                            <img src="/CRUDLogs/applog/img/success.png" width="20px" height="20px" alt="Success" />
                                        </>
                                    }
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    DOWNLOAD &gt; 10 FILES/DAY
                                </Typography>
                                <Typography variant="body1">
                                    {data?.download_more_10_files_day == 'Y' ?
                                        <>
                                            <img src="/CRUDLogs/applog/img/alert.png" width="20px" height="20px" alt="Alert" />
                                        </>
                                        :
                                        <>
                                            <img src="/CRUDLogs/applog/img/success.png" width="20px" height="20px" alt="Success" />
                                        </>
                                    }
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    EMPLOYEE RESIGNING WITHIN 1 MONTH
                                </Typography>
                                <Typography variant="body1">
                                    {data?.employee_resigning_within_one_month == 'Y' ?
                                        <>
                                            <img src="/CRUDLogs/applog/img/alert.png" width="20px" height="20px" alt="Alert" />
                                        </>
                                        :
                                        <>
                                            <img src="/CRUDLogs/applog/img/success.png" width="20px" height="20px" alt="Success" />
                                        </>
                                    }
                                </Typography>
                            </Grid>

                            {tap === 'DCC' ?
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            IS BU DCC
                                        </Typography>
                                        <Typography variant="body1">
                                            {data?.is_bu_dcc == 'Y' ?
                                                <>
                                                    <img src="/CRUDLogs/applog/img/alert.png" width="20px" height="20px" alt="Alert" />
                                                </>
                                                :
                                                <>
                                                    <img src="/CRUDLogs/applog/img/success.png" width="20px" height="20px" alt="Success" />
                                                </>
                                            }
                                        </Typography>
                                    </Grid>
                                </> : ""}
                            {data?.admin_confirm_date &&
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            CONFIRMED BY
                                        </Typography>
                                        <Typography variant="body1">{data?.admin_confirm}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            CONFIRMED DATE
                                        </Typography>
                                        <Typography variant="body1">
                                            {data?.admin_confirm_date
                                                ? datetime.DateTimeLongTH(new Date(data.admin_confirm_date))
                                                : "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 12 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            COMMENT
                                        </Typography>
                                        <Typography variant="body1" sx={{
                                            wordBreak: "break-word",
                                            backgroundColor: "#fafafa",
                                            p: 1,
                                            borderRadius: 1,
                                        }}>{data?.admin_confirm_comment}</Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            CONFIRMED EVENT
                                        </Typography>
                                        <Typography variant="body1" color={color}>{data?.admin_confirm_event}</Typography>
                                    </Grid>
                                </>}

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    {!data?.admin_confirm_date &&
                                        <>
                                            {sessionUser.is_accept && (
                                                <Button sx={{ mr: 1 }}
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handlePopup}
                                                    startIcon={<SaveIcon />}
                                                >Save</Button>
                                            )}
                                        </>
                                    }
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={close}
                                        startIcon={<ClearIcon />}
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Paper>
            <ReportLogDialog
                open={open}
                valueRedio={valueRedio}
                comment={conment}
                onClose={() => setOpen(false)}
                onSubmit={handleDialogSubmit}
                onRadioChange={handleChangeRedio}
                onCommentChange={setComment}
            />
        </>
    );
}
