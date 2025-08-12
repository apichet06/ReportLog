import { Card, CardContent, Typography, Grid, Divider, Paper, Button, Box } from "@mui/material";
import ReportLogDialog from "../components/ReportLogDialog";

import type { User } from "@/layouts/userType";
import { useReportLog } from "../hooks";
import SaveIcon from "@mui/icons-material/Save";
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import { useNavigate, useParams } from "react-router-dom";

import datetime from "@/shared/utils/handleDatetime";
import { useReportLogState } from "../hooks/useReportLogState";
import { useLoadingDateById } from "../hooks/useLoadingDateById";
import { useEffect } from "react";


export default function ReportLogByIdPage() {

    const { id, tap } = useParams<{ id: string, tap: string }>();
    const state = useReportLogState();
    const navigatoin = useNavigate();

    const userDataString = localStorage.getItem("user");
    const resultData: User | null = userDataString ? JSON.parse(userDataString) : null;


    const {
        open, setOpen,
        conment, setComment,
        valueRedio, handleChangeRedio,
        handlePopup, handleDialogSubmit,
    } = useReportLog(resultData);

    useEffect(() => {
        if (id) {
            state.setId(id);
        }
    }, [id, state]);

    useLoadingDateById(id || "", state);



    const color = state.data?.admin_confirm_event === "Usual Event" ? "green" : "red";
    const colorevent = state.data?.event_type === "Usual Event" ? "green" : "red";

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
                                <Typography variant="body1">{state.data?.group_name}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    USERNAME
                                </Typography>
                                <Typography variant="body1">{state.data?.username?.trim()}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    ACTION
                                </Typography>
                                <Typography variant="body1">{state.data?.action}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    ACTION DATE/TIME
                                </Typography>
                                <Typography variant="body1">
                                    <>
                                        {state.data?.action_date_time
                                            ? datetime.DateTimeLongTH(new Date(state.data.action_date_time))
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
                                    {state.data?.detail}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    BU
                                </Typography>
                                <Typography variant="body1">{state.data?.bu || "-"}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    POSITION
                                </Typography>
                                <Typography variant="body1">{state.data?.position || "-"}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    EVENT TYPE
                                </Typography>
                                <Typography variant="body1" color={colorevent}>{state.data?.event_type}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    UNAUTHORIZED
                                </Typography>
                                <Typography variant="body1">{state.data?.unauthorized}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    DOWNLOAD &gt; 10 FILES/DAY
                                </Typography>
                                <Typography variant="body1">{state.data?.download_more_10_files_day}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    EMPLOYEE RESIGNING WITHIN 1 MONTH
                                </Typography>
                                <Typography variant="body1">{state.data?.employee_resigning_within_one_month}</Typography>
                            </Grid>

                            {tap === 'DCC' ?
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            IS BU DCC
                                        </Typography>
                                        <Typography variant="body1">{state.data?.is_bu_dcc || "-"}</Typography>
                                    </Grid>
                                </> : ""}
                            {state.data?.admin_confirm_date &&
                                <>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            CONFIRMED BY
                                        </Typography>
                                        <Typography variant="body1">{state.data?.admin_confirm}</Typography>
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
                                        }}>{state.data?.admin_confirm_comment}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            CONFIRMED DATE
                                        </Typography>
                                        <Typography variant="body1">
                                            {state.data?.admin_confirm_date
                                                ? datetime.DateTimeLongTH(new Date(state.data.admin_confirm_date))
                                                : "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            CONFIRMED EVENT
                                        </Typography>
                                        <Typography variant="body1" color={color}>{state.data?.admin_confirm_event}</Typography>
                                    </Grid>
                                </>}

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    {!state.data?.admin_confirm_date &&
                                        <>
                                            <Button sx={{ mr: 1 }}
                                                variant="contained"
                                                color="success"
                                                onClick={handlePopup}
                                                startIcon={<SaveIcon />}
                                            >Save</Button>
                                        </>
                                    }
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => navigatoin("/report-log")}
                                        startIcon={<TurnLeftIcon />}
                                    >
                                        Back
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
                onSubmit={() => handleDialogSubmit(id?.toString() ?? "")}
                onRadioChange={handleChangeRedio}
                onCommentChange={setComment}
            />
        </>
    );
}
