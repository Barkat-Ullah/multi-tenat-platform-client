import OrginizerLayout from "@/components/shared/layout/orginizer-dashboard-layout/OrginizerLayout";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: LayoutProps) => {
  return <OrginizerLayout>{children}</OrginizerLayout>;
};

export default layout;
