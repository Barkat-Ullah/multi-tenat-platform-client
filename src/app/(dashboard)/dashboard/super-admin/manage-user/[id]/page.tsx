"use client";

import React from "react";
import { useParams } from "next/navigation";
import UserDetailsView from "@/components/AdminDashboard/UserDetailsView";

export default function SuperAdminUserDetailsPage() {
  const params = useParams();
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  return (
    <UserDetailsView
      userId={userId}
      backLink="/dashboard/super-admin/manage-user"
      sendEmailPath={`/dashboard/super-admin/send-email?userId=${userId}`}
    />
  );
}
