import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    type ChartOptions,
    type ChartData as ChartJsData,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie, Bar } from 'react-chartjs-2';
import { useEffect, useState, useCallback, } from 'react';
import { getMonthLabels } from '../components/utils';
import Container from '@mui/material/Container';
import _Chart from '../service/reportService';
import type { CartBarData, ChartData } from '../Types/ChartType';
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);


const initialChartBarData: ChartJsData<'bar'> = {
    labels: [],
    datasets: [
        {
            label: 'Dcc',
            data: [], // Sample data for Dcc
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 2)',
            borderWidth: 1,
        },
        {
            label: 'Duc',
            data: [], // Sample data for Duc
            backgroundColor: 'rgba(54, 162, 235, 1)',
            borderColor: 'rgba(54, 162, 235, 2)',
            borderWidth: 1,
        },
    ],
};


const initialChartData: ChartJsData<'pie'> = {
    labels: [],
    datasets: [
        {
            label: 'Count',
            data: [],
            backgroundColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',

            ],
            borderColor: [
                'rgba(75, 192, 192, 2)',
                'rgba(54, 162, 235, 2)',

            ],
            borderWidth: 1,
            hoverOffset: 4,
        },
    ],
};

const DashboardPage = () => {
    const [chartData, setChartData] = useState<ChartJsData<'pie'>>(initialChartData);
    const [chartBar, setChartBar] = useState<ChartJsData<'bar'>>(initialChartBarData);

    const optionBar: ChartOptions<'bar'> = {

        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Last 12 Months Data',
            },
        },
    }

    const options: ChartOptions<'pie'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Report Log Summary',
            },
            datalabels: {
                formatter: (value) => {
                    return value;
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 16,
                },

            },
        },
    };

    const handleChart = useCallback(async () => {
        try {
            const response = await _Chart.ChartService();
            const apiData = response.data.result;

            if (apiData && apiData.length > 0) {
                const labels = apiData.map((item: ChartData) => item.name);
                const dataPoints = apiData.map((item: ChartData) => item.count);

                setChartData((prevData) => ({
                    ...prevData,
                    labels: labels,
                    datasets: [{ ...prevData.datasets[0], data: dataPoints }],
                }));
            }
        } catch (err) {
            console.error("Failed to fetch chart data:", err);

        }
    }, []);

    const handleChartBar = useCallback(async () => {
        try {
            const response = await _Chart.ChartBarService();
            const apiDatabar: CartBarData[] = response.data.result;


            if (apiDatabar && apiDatabar.length > 0) {
                const labels = apiDatabar.map((item: CartBarData) => item.name);
                const dataPoints = apiDatabar.map((item: CartBarData) => item.app_log);
                console.log(dataPoints);


            }
        } catch (err) {
            console.error("Failed to fetch chart data:", err);

        }
    }, []);



    useEffect(() => {
        handleChartBar();
        handleChart();
    }, [handleChart, handleChartBar]);

    return (
        <>
            <Container maxWidth={false}>

                <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                        {/* <Paper sx={{ p: 2 }}> */}
                        <Box sx={{ height: { xs: 400, md: 400 }, position: 'relative' }}>
                            <Pie data={chartData} options={options} />
                        </Box>
                        {/* </Paper> */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* <Paper sx={{ p: 2 }}> */}
                        <Box sx={{ height: { xs: 400, md: 400 }, position: 'relative' }}>
                            <Bar data={chartBar} options={optionBar} />
                        </Box>
                        {/* </Paper> */}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default DashboardPage;
