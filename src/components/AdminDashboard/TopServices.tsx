"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { AdminTopService } from "@/redux/service/admin/dashboardApi";

interface TopServicesProps {
  services: AdminTopService[];
  isLoading: boolean;
}

const COLORS = ["#00B2D6", "#F59E0B", "#6366F1", "#10B981", "#EF4444"];

export default function TopServices({ services, isLoading }: TopServicesProps) {
  const chartData = services.map((service, index) => ({
    ...service,
    color: COLORS[index % COLORS.length],
  }));
  const totalBookings = services.reduce((total, service) => total + service.count, 0);

  return (
    <Card
      variant="borderless"
      className="h-full rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
      styles={{ body: { padding: "24px" } }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-poppins text-base font-bold text-gray-900">Top Services</h2>
        <Link href="/dashboard/admin/services" className="text-xs font-bold text-[#00B2D6] hover:underline">
          View All
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="mx-auto my-5 h-36 w-36 rounded-full border-[24px] border-slate-100" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex justify-between">
                <div className="h-2.5 w-28 rounded-full bg-slate-200" />
                <div className="h-2.5 w-8 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="flex min-h-[260px] items-center justify-center text-center text-sm font-semibold text-slate-400">
          No service usage data.
        </div>
      ) : (
        <>
          <div className="relative flex h-[180px] w-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="count">
                  {chartData.map((entry) => (
                    <Cell key={entry.serviceId} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold leading-none text-gray-950">{totalBookings}</span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Bookings</span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {chartData.map((service) => (
              <div key={service.serviceId} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: service.color }} />
                  <span className="truncate font-semibold text-[#0F2E4A]">{service.title}</span>
                </div>
                <span className="font-bold text-gray-900">{service.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
