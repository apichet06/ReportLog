
import { DataGridPremium, type GridRowId, type GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { useCallback, useEffect, useMemo, useState } from 'react';
import reportLogService from '../service/reportlogService';
import datetime from '@/shared/utils/handleDatetime';
import type { ReportLog } from '../types/reportlog';
import { getColumnsDCC } from '../constants/reportLogDccColumns';
import sharedUsers from '@/shared/hooks/sharedUsers';
import type { User } from '@/layouts/userType';


export default function ControlledSelectionGrid() {
    const userDataString = localStorage.getItem("user");
    const resultData: User | null = userDataString
        ? JSON.parse(userDataString)
        : null;
    const { sessionUser } = sharedUsers(resultData?.emp_no as string)

    const [row, setRow] = useState<ReportLog[]>([]);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
    const { startDate, endDate } = datetime.buildDateParamsSearch(2);
    const fetchData = useCallback(async () => {

        const data = await reportLogService.GetReportLogService({
            tapData: "DUC",
            startDate,
            endDate,
            checkBoxUsual: "Usual event",
            checkBoxUnusual: "Unusual event",
            plant: '1001',
        }
        );
        setRow(data.data.result);
    }, [endDate, startDate]);



    const selectedIds = useMemo<GridRowId[]>(() => {
        if (Array.isArray(rowSelectionModel)) {
            return rowSelectionModel;
        }
        if (rowSelectionModel.type === 'exclude') {
            const allRowIds = new Set(row.map((r) => r.id));
            return Array.from(allRowIds);
        }

        if (rowSelectionModel.type === 'include') {
            return Array.from(rowSelectionModel.ids);
        }
        return [];
    }, [row, rowSelectionModel]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    console.log(selectedIds);


    // useEffect(() => {
    //     console.log('Derived selected IDs:', selectedIds);
    // }, [rowSelectionModel, selectedIds]);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const dccColumns = useMemo(
        () => getColumnsDCC(sessionUser.is_review),
        [sessionUser.is_review]
    );
    return (
        <div style={{ width: '100%' }}>
            <DataGridPremium
                rows={row}
                columns={dccColumns}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(model) =>
                    setPaginationModel(model)
                }
                rowSelectionModel={rowSelectionModel}
                pagination
                pageSizeOptions={[5, 10, 20, 40, 60, 80, 100]}
            />
        </div>
    );
}
