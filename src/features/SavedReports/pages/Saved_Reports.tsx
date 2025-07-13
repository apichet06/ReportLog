import { Container, Grid, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { ReportSaveLog } from "../types/reportsavelog";

export default function Saved_Reports() {


    const columns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 70, align: 'center', headerAlign: 'center',
        },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
            renderCell: (params) => {
                const age = params.value as number;             // 👈 ยืนยันว่าเป็น number
                return (
                    <span style={{ color: age > 35 ? 'red' : 'inherit' }}>
                        {age}
                    </span>
                );
            },
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (_value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
    ];

    const rows: ReportSaveLog[] = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 35 },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const paginationModel = { page: 0, pageSize: 5 };


    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid size={{ xs: 12, sm: 12, md: 11, lg: 12, xl: 11 }}  >
                    <h2>Saved DCC & DUC Reports</h2>
                    <Paper sx={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            getRowClassName={(params) =>
                                params.row.age > 35 ? 'row--highlight' : ''
                            }
                            sx={{
                                // ถ้าต้องการให้ "ทั้งแถว" สีเขียว (พื้นหลัง + ตัวอักษร)
                                '& .row--highlight': {
                                    bgcolor: 'rgba(255,165,0,0.1)',  // พื้นหลังเขียวอ่อน (ปรับได้)
                                    color: 'green',                   // สีตัวอักษร
                                    '&:hover': { bgcolor: 'rgba(0, 128, 0, 0.15)' }, // hover color
                                },
                            }}
                        />
                    </Paper>


                </Grid>

            </Grid>
        </Container>
    )
}
