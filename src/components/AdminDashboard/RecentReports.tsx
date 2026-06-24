"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { recentReportsData } from "@/app/data/AdminDashboardData";

export default function RecentReports() {
  return (
    <Card
      variant="borderless"
      className="shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 rounded-3xl"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900 font-poppins">
          Recent Reports
        </h2>
        <Link
          href="/dashboard/admin/reports"
          className="text-xs font-bold text-[#00B2D6] hover:underline"
        >
          View All Reports
        </Link>
      </div>

      <div className="space-y-4">
        {recentReportsData.map((report, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-[#00B2D6]">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F2E4A] leading-tight">
                  {report.title}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {report.date}
                </p>
              </div>
            </div>
            <button
              className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-[#00B2D6] transition-colors"
              aria-label="Download report"
            >
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
