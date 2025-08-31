import type { User } from "@/layouts/userType";
import { useCallback, useEffect, useState } from "react";
import GetUserlogin from "../utils/serviceUser";

const defaultUser: User = {
    id: 0,
    emp_no: "",
    emp_email: "",
    username: "",
    firstname: "",
    lastname: "",
    is_accept: false,
    is_active: false,
    is_review: false,
    is_export: false,
    plant: "",
    plant_Id: 0,
    plant_Name: "",
    app_Id: "",
    status: "",
    created_by: null,
    created_date: null,
    updated_by: null,
    updated_date: null,
};
export default function useSharedUsers(emp_no: string) {
    const [sessionUser, setSessonUser] = useState<User>(defaultUser);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        try {
            const user = await GetUserlogin(emp_no);
            if (user.status === 200 && user.data.result.length > 0) {
                setSessonUser(user.data.result[0]);
            } else {
                setSessonUser(defaultUser);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setSessonUser(defaultUser);
        } finally {
            setLoading(false);
        }
    }, [emp_no]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return { sessionUser, loading };
}
