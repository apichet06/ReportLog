import Grid from '@mui/material/Grid';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    type ChartData as ChartJsData,
    type ChartDataset,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie, Bar } from 'react-chartjs-2';
import { useEffect, useState, useCallback, } from 'react';
import Container from '@mui/material/Container';
import _Chart from '../service/reportService';
import type { CartBarData, ChartData } from '../Types/ChartType';
import { initialChartBarData, initialChartData, optionBar, options } from '../components/utils';
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
import { colors } from '../components/utils';
// import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';


const DashboardPage = () => {
    const [chartData, setChartData] = useState<ChartJsData<'pie'>>(initialChartData);
    const [chartBar, setChartBar] = useState<ChartJsData<'bar'>>(initialChartBarData);
    const [data, setData] = useState(0);
    const [Year, setYear] = useState(new Date().getFullYear().toString());


    const currentYear = new Date().getFullYear();
    const startYear = 2025;
    const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const handleChange = (event: SelectChangeEvent) => {
        setYear(event.target.value);
    };




    const handleChart = useCallback(async () => {
        try {

            const response = await _Chart.ChartService(Year);
            const apiData = response.data.result;
            setData(apiData.length)
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
    }, [Year]);

    // const handleChartBar = useCallback(async () => {
    //     try {
    //         const response = await _Chart.ChartBarService();
    //         const apiDatabar: CartBarData[] = response.data.result;

    //         if (apiDatabar && apiDatabar.length > 0) {
    //             // ดึง labels จาก name โดยไม่ซ้ำ
    //             const labels = Array.from(new Set(apiDatabar.map(item => item.name)));

    //             // dataset DCC
    //             const dccData = labels.map(label => {
    //                 const found = apiDatabar.find(item => item.name === label && item.app_log === "DCC");
    //                 return found ? found.countData : 0;
    //             });

    //             // dataset DUC
    //             const ducData = labels.map(label => {
    //                 const found = apiDatabar.find(item => item.name === label && item.app_log === "DUC");
    //                 return found ? found.countData : 0;
    //             });

    //             setChartBar({
    //                 labels,
    //                 datasets: [
    //                     {
    //                         label: 'DCC',
    //                         data: dccData,
    //                         backgroundColor: 'rgba(75, 192, 192, 1)',
    //                         borderColor: 'rgba(75, 192, 192, 2)',
    //                         borderWidth: 1,
    //                     },
    //                     {
    //                         label: 'DUC',
    //                         data: ducData,
    //                         backgroundColor: 'rgba(54, 162, 235, 1)',
    //                         borderColor: 'rgba(54, 162, 235, 2)',
    //                         borderWidth: 1,
    //                     }
    //                 ]
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Failed to fetch chart data:", err);
    //     }
    // }, []);


    const handleChartBar = useCallback(async () => {
        try {
            const response = await _Chart.ChartBarService(Year);
            const apiDatabar: CartBarData[] = response.data.result;

            if (!apiDatabar?.length) return;


            const monthsOrdered = Array.from(new Set(apiDatabar.map(i => i.month)))
                .sort((a, b) => a - b);

            const labels = monthsOrdered.map(m => {
                const found = apiDatabar.find(i => i.month === m && i.name);
                return found?.name ?? '';
            });


            const logTypes = Array.from(
                new Set(
                    apiDatabar
                        .map(i => i.app_log)
                        .filter((v): v is string => v != null)
                )
            );

            // --- สร้าง datasets สำหรับแต่ละ logType (เติม 0 ถ้าไม่มีข้อมูลในเดือนนั้น) ---
            const datasets: ChartDataset<'bar', (number | [number, number] | null)[]>[] = logTypes.map((log, index) => {
                const data = monthsOrdered.map(m => {
                    const found = apiDatabar.find(item => item.month === m && item.app_log === log);
                    return found ? found.countData : 0;
                });

                return {
                    label: log,
                    data,
                    backgroundColor: colors[index % colors.length].bg,
                    borderColor: colors[index % colors.length].border,
                    borderWidth: 1
                };
            });

            setChartBar({
                labels,
                datasets
            });
        } catch (err) {
            console.error('Failed to fetch chart data:', err);
        }
    }, [Year]);


    useEffect(() => {
        handleChartBar();
        handleChart();
    }, [handleChart, handleChartBar]);

    return (
        <>
            <Container maxWidth={false}>

                <Grid container spacing={2} justifyContent="center">
                    <Grid size={{ xs: 12, md: 12, lg: 12, xl: 12 }}>
                        <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={Year}
                            onChange={handleChange}
                            label="Year"
                        >
                            {yearOptions.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        {/* <Box sx={{ height: { md: 500 }, position: 'relative' }}> */}
                        {data !== 0 &&
                            <Pie data={chartData} options={options} />}
                        {/* </Box> */}
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {/* <Box sx={{ height: { md: 500 } }}> */}
                        <Bar data={chartBar} options={optionBar} />
                        {/* </Box> */}
                    </Grid>
                </Grid>
                <hr />
            </Container>
        </>
    );
};

export default DashboardPage;
