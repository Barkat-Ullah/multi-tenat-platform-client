import UserLayout from "@/components/shared/layout/user-dashboard-layout/UserLayout";
import React from "react";
interface AdminLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: AdminLayoutProps) => {
  return <UserLayout>{children}</UserLayout>;
};

export default layout;
