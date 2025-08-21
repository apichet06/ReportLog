import type { User } from "@/layouts/userType";

const userDataString = localStorage.getItem("user");
export const resultData: User | null = userDataString
  ? JSON.parse(userDataString)
  : null;
