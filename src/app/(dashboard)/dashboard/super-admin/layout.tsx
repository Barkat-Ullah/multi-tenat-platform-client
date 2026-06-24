import SuperAdminDashboardLayout from "@/components/shared/layout/super-admin-dashboard-layout/SuperAdminLayout";
import React from "react";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: SuperAdminLayoutProps) => {
  return <SuperAdminDashboardLayout>{children}</SuperAdminDashboardLayout>;
};

export default layout;
