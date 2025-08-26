import { useState, useEffect, useCallback } from "react";
import type {
  AppName,
  BuPlant,
  UsersPermission,
} from "../types/UsersPermission";
import userService from "../services/userservice";

export const useUsersPermission = () => {
  const [data, setData] = useState<UsersPermission[]>([]);
  const [appName, setAppName] = useState<AppName[]>([]);
  const [buPlant, setBuPlant] = useState<BuPlant[]>([]);

  // ฟังก์ชัน fetch ข้อมูล
  const fetchData = useCallback(async () => {
    // setLoading(true);
    try {
      const users = await userService.getUsersPermission();
       const newData = users.map(
                (item: UsersPermission, index: number) => ({
                  ...item,
                  no: index + 1,
                })
              );
      setData(newData);
      const apps = await userService.getAppname();
      setAppName(apps);
      const plants = await userService.getbuPlant();
      setBuPlant(plants);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, appName, buPlant, fetchData };
};
