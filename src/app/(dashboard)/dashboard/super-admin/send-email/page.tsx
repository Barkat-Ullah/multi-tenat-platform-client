"use client";

import React, { Suspense } from "react";
import SendClientEmailView from "@/components/AdminDashboard/SendClientEmailView";

export default function SuperAdminSendEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 font-semibold text-slate-400">Loading...</div>}>
      <SendClientEmailView />
    </Suspense>
  );
}
