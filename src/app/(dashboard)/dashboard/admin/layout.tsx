import SuperAdminLayout from "@/components/shared/layout/admin-dashboard-layout/AdminLayout";
import React from "react";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
};

export default layout;
