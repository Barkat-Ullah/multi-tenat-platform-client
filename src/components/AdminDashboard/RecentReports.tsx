"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import type { AdminRecentMedicalRecord } from "@/redux/service/admin/dashboardApi";

interface RecentReportsProps {
  reports: AdminRecentMedicalRecord[];
  isLoading: boolean;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const ReportsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }, (_, index) => (
      <div key={index} className="flex animate-pulse items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-2.5 w-32 rounded-full bg-slate-200" />
            <div className="h-2 w-24 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-200" />
      </div>
    ))}
  </div>
);

export default function RecentReports({ reports, isLoading }: RecentReportsProps) {
  return (
    <Card
      variant="borderless"
      className="h-full rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-poppins text-base font-bold text-gray-900">Recent Reports</h2>
        <Link href="/dashboard/admin/reports" className="text-xs font-bold text-[#00B2D6] hover:underline">
          View All
        </Link>
      </div>

      {isLoading ? (
        <ReportsSkeleton />
      ) : reports.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center text-center text-sm font-semibold text-slate-400">
          No recent medical records.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-[#00B2D6]">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold leading-tight text-[#0F2E4A]">
                    {report.service || "Medical Record"}
                  </h4>
                  <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-400">
                    {report.driverName || "N/A"} - {formatDate(report.createdAt)}
                  </p>
                </div>
              </div>
              {report.files ? (
                <a
                  href={report.files}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  aria-label={`Download report for ${report.driverName}`}
                  title="Download report"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#00B2D6] transition-colors hover:bg-slate-50"
                >
                  <Download size={16} />
                </a>
              ) : (
                <span className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full text-slate-300" title="No document available">
                  <Download size={16} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
