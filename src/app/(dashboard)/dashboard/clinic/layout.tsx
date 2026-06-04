import ClinicLayout from "@/components/shared/layout/clinic-dashboard-layout/ClinicLayout";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return <ClinicLayout>{children}</ClinicLayout>;
};

export default layout;
