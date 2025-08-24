import axiosInstance from "./axiosInstance";

const GetUserlogin = (emp_no: string) =>
  axiosInstance.get(`/UserPermission/byEmp/${emp_no}`);

export default GetUserlogin;
