import { useCallback, useEffect, useState } from "react";
import type { Histotys } from "../types/historyType";
import history from "../service/historyService";
import dayjs, { Dayjs } from "dayjs";

export const useHistory = () => {
  const [row, setRow] = useState<Histotys[]>([]);
  const [textSearch, SetTextSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<string>("");
  const twoDaysAgo = dayjs().subtract(0, "day");
  const [pendingStart, setPendingStart] = useState<Dayjs | null>(null);
  const [pendingEnd, setPendingEnd] = useState<Dayjs | null>(null);
  const [dateStart, setDateStart] = useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const users = await history.GetSaveHistoryService({
        Search: appliedSearch,
        startDate: dateStart ? dateStart.format("YYYY-MM-DD") : "",
        endDate: dateEnd ? dateEnd.format("YYYY-MM-DD") : "",
      });

      const newData = users.map((item: Histotys, index: number) => ({
        ...item,
        no: index + 1,
      }));
      setRow(newData);
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, dateEnd, dateStart]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    row,
    fetchData,
    textSearch,
    SetTextSearch,
    appliedSearch,
    setAppliedSearch,
    twoDaysAgo,
    pendingStart,
    setPendingStart,
    pendingEnd,
    setPendingEnd,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    loading,
  };
};
