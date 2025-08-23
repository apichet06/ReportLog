import axiosInstance from "./axiosInstance";

const GetUserlogin = (emp_no: string) =>
  axiosInstance.get(`/Authen/byEmp/${emp_no}`);

export default GetUserlogin;
