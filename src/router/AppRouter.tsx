import { Routes, Route, Navigate } from "react-router-dom";
// import MailPage from '@/features/mail/pages/MailPage';
import MainLayout from "@/layouts/MainLayout";
import Saved_Reports from "@/features/SavedReports/pages/Saved_Reports";
import ReportLogPage from "@/features/reportLog/pages/ReportLogPage";

const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/reportlog" replace />} />
        <Route path="/reportlog" element={<ReportLogPage />} />
        <Route path="/saved_report" element={<Saved_Reports />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRouter;
