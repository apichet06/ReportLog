import type { User } from "@/layouts/userType";
import { useCallback, useEffect, useState } from "react";
import GetUserlogin from "../utils/serviceUser";
// import { resultData } from "../utils/useToken";


export default function sharedUsers(emp_no: string) {
    const [sessionUser, setSessonUser] = useState<User>({} as User);

    const fetchUserData = useCallback(async () => {
        // const emp_no = resultData?.emp_no;
        try {
            const user = await GetUserlogin(emp_no as string);

            if (user.status == 200) setSessonUser(user.data.result[0]);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }, [emp_no]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return { sessionUser }
}
