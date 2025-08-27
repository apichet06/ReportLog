import * as React from 'react';
import { DataGrid, type GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ControlledSelectionGrid() {
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        maxColumns: 6,
    });

    const apiRef = useGridApiRef();
    const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });

    React.useEffect(() => {
        if (apiRef.current) {
            const selectedRows = apiRef.current.getSelectedRows();
            const selectedIds = Array.from(selectedRows.keys());
            console.log('Selected IDs:', selectedIds);
        }
    }, [apiRef, rowSelectionModel]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                apiRef={apiRef}
                checkboxSelection
                onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                }}
                rowSelectionModel={rowSelectionModel}
                {...data}
            />
        </div>
    );
}
