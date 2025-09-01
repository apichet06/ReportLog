import { useCallback, useEffect, useState } from "react";
import type { Histotys } from "../types/historyType";
import history from "../service/historyService";

export const useHistory = () => {
  const [row, setRow] = useState<Histotys[]>([]);

  const fetchData = useCallback(async () => {
    // setLoading(true);
    try {
      const users = await history.GetSaveHistoryService();
      const newData = users.map((item: Histotys, index: number) => ({
        ...item,
        no: index + 1,
      }));
      setRow(newData);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { row, fetchData };
};
