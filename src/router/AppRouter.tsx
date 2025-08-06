import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Saved_Reports from "@/features/SavedReports/pages/Saved_Reports";
import ReportLogPage from "@/features/reportLog/pages/ReportLogPage";
import ErrorPermissionPage from "@/features/permession/ErrorPermissionPage";
import LoginPage from "@/features/auth/page/LoginPage";
import ReportLogPages from "@/features/report-log/pages/ReportLogPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";



const AppRouter = () => {

  return (
    <Routes>
      <Route path="/ErrorPermissionPage" element={<ErrorPermissionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/reportlog" replace />} />
        <Route path="/reportlog" element={<ReportLogPage />} />
        <Route path="/dastbord" element={<DashboardPage />} />
        <Route path="/report-log" element={<ReportLogPages />} />
        <Route path="/saved_report" element={<Saved_Reports />} />
        <Route path="*" element={<Navigate to="/reportlog" />} />
      </Route>
      <Route path="*" element={<Navigate to="/ErrorPermissionPage" replace />}
      />

    </Routes>
  );
};

export default AppRouter;
