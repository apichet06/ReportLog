import Paper from '@mui/material/Paper';
import { Container, Grid } from '@mui/material';


import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    type ChartOptions
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
    const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
            {
                label: 'Votes',
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Doughnut Chart Example',
            },
        },
    };

    // const hendleSubmit = async () => {

    //     const rawIds =
    //         Array.isArray(selectionModel)
    //             ? selectionModel
    //             : Array.from(selectionModel.ids);

    //     // const numericIds = rawIds.map((id) => Number(id));
    //     const selectedData = rows
    //         .filter((row) => rawIds.includes(row.id))
    //         .map(({ id, firstName, lastName, age }) => ({ id, firstName, lastName, age }));

    //     try {

    //         await ApprovedReportService(selectedData);
    //         // ถ้าสำเร็จ แสดง Snackbar หรือรีเฟรชข้อมูลได้ที่นี่
    //     } catch (err) {
    //         console.error(err);
    //         // จัดการ error (toast/snackbar) ตามเหมาะสม
    //     }
    // }
    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid size={{ xs: 12, sm: 12, md: 11, lg: 12, xl: 11 }}  >
                    <h2>Chart Report Log</h2>
                    <Paper sx={{ height: 400, width: '100%' }}>
                        <Doughnut data={data} options={options} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;
