import { useState, type ChangeEvent } from "react";
import type {
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid-premium";
import type { MUIColor, ReportLog } from "../types/reportLogTypes";

export function useReportLogState() {
  const [colerTodayduc, setColerTodayDuc] = useState<MUIColor>("secondary");
  const [colerHistoryduc, setColerHistoryDuc] = useState<MUIColor>("info");
  const [colerTodaydcc, setColerTodayDcc] = useState<MUIColor>("secondary");
  const [colerHistorydcc, setColerHistoryDcc] = useState<MUIColor>("info");

  const [rowDatas, setRowDatas] = useState<GridRowId[]>([]);
  const [conment, setComment] = useState("");
  const [valueRedio, setValueRedio] = useState("Usual Event");

  const [dataDuc, setDataDUC] = useState<ReportLog[]>([]);
  const [dataDcc, setDataDCC] = useState<ReportLog[]>([]);
  const [value, setValue] = useState("1");
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [] as unknown as GridRowSelectionModel
  );
  const [open, setOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [loadingDataGrid, setLoadingDataGrid] = useState(false);
  const [dayHisDatedcc, setDayHisDatedcc] = useState<number>(1);
  const [dayHisDateduc, setDayHisDateduc] = useState<number>(1);
  const [textSearch, setTextSearch] = useState<string>("");
  const [tapData, setTapData] = useState<string>("DUC");
  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [data, setData] = useState<ReportLog | null>(null);

  const [checkBoxkUsual, setCheckBoxUsual] = useState("Usual Event");
  const [checkBoxkUnusual, setCheckBoxUnusual] = useState("Unusual Event");

  const [id, setId] = useState<string>("");

  const handleChangeRedio = (event: ChangeEvent<HTMLInputElement>) => {
    setValueRedio(event.target.value);
  };

  return {
    colerTodayduc,
    setColerTodayDuc,
    colerTodaydcc,
    setColerTodayDcc,
    colerHistoryduc,
    setColerHistoryDuc,
    colerHistorydcc,
    setColerHistoryDcc,
    rowDatas,
    setRowDatas,
    conment,
    setComment,
    valueRedio,
    setValueRedio,
    handleChangeRedio,
    selectionModel,
    setSelectionModel,
    open,
    setOpen,
    paginationModel,
    setPaginationModel,

    dayHisDatedcc,
    setDayHisDatedcc,
    dayHisDateduc,
    setDayHisDateduc,
    textSearch,
    setTextSearch,
    tapData,
    setTapData,
    loadingExport,
    setLoadingExport,

    setDataDUC,
    setDataDCC,
    dataDuc,
    dataDcc,
    loadingDataGrid,
    setLoadingDataGrid,
    setValue,
    value,
    editingId,
    setEditingId,
    data,
    setData,
    id,
    setId,
    setCheckBoxUnusual,
    setCheckBoxUsual,
    checkBoxkUsual,
    checkBoxkUnusual,
  };
}
