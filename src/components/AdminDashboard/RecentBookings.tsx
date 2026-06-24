"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link";
import { recentBookingsData } from "@/app/data/AdminDashboardData";

export default function RecentBookings() {
  return (
    <Card
      variant="borderless"
      className="shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-100 rounded-3xl"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900 font-poppins">
          Recent Bookings
        </h2>
        <Link
          href="/dashboard/admin/all-booking"
          className="text-xs font-bold text-[#00B2D6] hover:underline"
        >
          View All Bookings
        </Link>
      </div>

      <div className="space-y-4">
        {recentBookingsData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E6FAFF] text-[#00B2D6] font-bold text-sm flex items-center justify-center">
                {item.avatarText}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F2E4A] leading-tight">
                  {item.name}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {item.service} - {item.time}
                </p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
