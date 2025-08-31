import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Saved_Reports from "@/features/SavedReports/pages/Saved_Reports";
import ReportLogPage from "@/features/reportLog/pages/ReportLogPage";
import ErrorPermissionPage from "@/features/permession/ErrorPermissionPage";
// import LoginPage from "@/features/auth/page/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ReportLogPages from "@/features/report-log/pages/ReportLogPage";
import ReportLogByIdPage from "@/features/report-log/pages/ReportLogByIdPage";
import ReportLogByIdPages from "@/features/reportLog/pages/ReportLogByIdPage";
import UpdateOnEmailPage from "@/features/save-onemail/page/SaveOnemailpage";
import UsersPermissionPage from "@/features/mageusers/page/UsersPermissionPage";
import type { User } from "@/layouts/userType";
import sharedUsers from "@/shared/hooks/sharedUsers";
import DataGridCheckboxSelection from "@/features/reportLog/pages/testdatagridPage";
import ReportCheckAll from "@/features/reportLog/pages/ReportCheckAll";

const AppRouter = () => {
  const userDataString = localStorage.getItem("user");
  const resultData: User | null = userDataString
    ? JSON.parse(userDataString)
    : null;
  const { sessionUser, loading } = sharedUsers(resultData?.emp_no as string)
  if (loading) {
    return <div>Loading routes...</div>;
  }
  return (
    <Routes>
      <Route path="/ErrorPermissionPage" element={<ErrorPermissionPage />} />
      <Route path="/updateDateOnEmail/:plant?/:app_log?/:datetime?" element={<UpdateOnEmailPage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/reportlog" element={<ReportLogPage />} />
        <Route path="/report-testdatagrid" element={<DataGridCheckboxSelection />} />
        <Route path="/report-log" element={<ReportLogPages />} />
        <Route path="/report-chackall" element={<ReportCheckAll />} />
        <Route path="/report-log/:id?/:tap?" element={<ReportLogByIdPage />} />
        <Route path="/reportlog/:id?/:tap?" element={<ReportLogByIdPages />} />
        <Route path="/saved_report" element={<Saved_Reports />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {sessionUser?.status?.toLowerCase() === "admin" && (
          <Route path="/userpermission" element={<UsersPermissionPage />} />
        )}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
      <Route path="*" element={<Navigate to="/ErrorPermissionPage" replace />}
      />
    </Routes>
  );
};

export default AppRouter;
