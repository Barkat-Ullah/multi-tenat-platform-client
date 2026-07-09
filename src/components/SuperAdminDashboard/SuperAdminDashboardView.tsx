"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  MapPin,
  PoundSterling,
  Search,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type AdminAnalyticsOverview,
  type AdminAnalyticsTrend,
  type AdminRecentBooking,
  type AdminRecentMedicalRecord,
  type AdminTopService,
  useGetAdminAnalyticsQuery,
} from "@/redux/service/admin/dashboardApi";

const SERVICE_COLORS = ["#00B2D6", "#6366F1", "#F59E0B", "#10B981", "#EF4444"];

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const formatDateTime = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "bg-[#E8F8F5] text-[#10B981]";
    case "CONFIRMED":
      return "bg-[#E6FAFF] text-[#00A5C7]";
    case "CANCELLED":
    case "CANCELED":
      return "bg-red-50 text-red-500";
    default:
      return "bg-amber-50 text-amber-600";
  }
};

const getInitial = (name?: string) => name?.trim().charAt(0).toUpperCase() || "?";

const StatCardSkeleton = () => (
  <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
);

const ListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 4 }, (_, index) => (
      <div
        key={index}
        className="flex animate-pulse items-center justify-between gap-3"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-2.5 w-28 rounded-full bg-slate-200" />
            <div className="h-2 w-36 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="h-5 w-16 rounded-full bg-slate-200" />
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div
    className="relative h-full animate-pulse overflow-hidden rounded-xl"
    role="status"
    aria-label="Loading booking and revenue trends"
  >
    <div className="absolute bottom-7 left-8 right-2 top-2 border-b border-l border-slate-200">
      <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-slate-100" />
      <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-slate-100" />
      <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-slate-100" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          d="M0 82 C8 76, 12 64, 20 68 S32 46, 40 53 S52 28, 60 38 S72 20, 80 32 S92 16, 100 22 L100 100 L0 100 Z"
          fill="#f1f5f9"
        />
        <path
          d="M0 82 C8 76, 12 64, 20 68 S32 46, 40 53 S52 28, 60 38 S72 20, 80 32 S92 16, 100 22"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
    <span className="sr-only">Loading booking and revenue trends...</span>
  </div>
);

const StatCard = ({
  title,
  value,
  icon,
  iconClassName,
  iconBackground,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName: string;
  iconBackground: string;
  isLoading: boolean;
}) => (
  <div className="flex min-h-[140px] flex-col justify-between rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
    <div className="flex items-center justify-between gap-3">
      <span className="font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
        {title}
      </span>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconBackground} ${iconClassName}`}
      >
        {icon}
      </div>
    </div>
    <div className="pt-4 font-poppins text-2xl font-extrabold text-[#0F2E4A] sm:text-3xl">
      {isLoading ? <StatCardSkeleton /> : value}
    </div>
  </div>
);

export default function SuperAdminDashboardView() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isFetching, isError, refetch } =
    useGetAdminAnalyticsQuery("monthly");

  const analytics = data?.data;
  const overview: AdminAnalyticsOverview | undefined = analytics?.overview;
  const isDashboardLoading = isLoading || isFetching;
  const query = searchQuery.trim().toLowerCase();

  const trendData: AdminAnalyticsTrend[] = analytics?.trend || [];
  const recentBookings = useMemo(
    () =>
      (analytics?.recentBookings || []).filter((booking) =>
        [booking.driverName, booking.service, booking.status].some((value) =>
          value?.toLowerCase().includes(query),
        ),
      ),
    [analytics?.recentBookings, query],
  );
  const topServices = useMemo(
    () =>
      (analytics?.topServices || []).filter((service) =>
        service.title.toLowerCase().includes(query),
      ),
    [analytics?.topServices, query],
  );
  const recentReports = useMemo(
    () =>
      (analytics?.recentMedicalRecords || []).filter((report) =>
        [
          report.driverName,
          report.clinicName,
          report.service,
          report.companyName,
          report.result,
        ].some((value) => value?.toLowerCase().includes(query)),
      ),
    [analytics?.recentMedicalRecords, query],
  );

  const chartServices = topServices.map((service, index) => ({
    ...service,
    color: SERVICE_COLORS[index % SERVICE_COLORS.length],
  }));
  const serviceTotal = topServices.reduce(
    (total, service) => total + service.count,
    0,
  );

  return (
    <div className="w-full space-y-8 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Overview
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Bookings"
          value={(overview?.bookings ?? 0).toLocaleString("en-GB")}
          icon={<Calendar size={18} className="stroke-[2.5]" />}
          iconClassName="text-[#00B2D6]"
          iconBackground="bg-[#E6FAFF]"
          isLoading={isDashboardLoading}
        />
        <StatCard
          title="Pending Bookings"
          value={(overview?.pendingBookings ?? 0).toLocaleString("en-GB")}
          icon={<Clock size={18} className="stroke-[2.5]" />}
          iconClassName="text-[#D9A700]"
          iconBackground="bg-[#FEF9E7]"
          isLoading={isDashboardLoading}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(overview?.revenue)}
          icon={<PoundSterling size={18} className="stroke-[2.5]" />}
          iconClassName="text-emerald-600"
          iconBackground="bg-emerald-50"
          isLoading={isDashboardLoading}
        />
        <StatCard
          title="Active Locations"
          value={(overview?.activeLocations ?? 0).toLocaleString("en-GB")}
          icon={<MapPin size={18} className="stroke-[2.5]" />}
          iconClassName="text-[#F39C12]"
          iconBackground="bg-[#FEF5E7]"
          isLoading={isDashboardLoading}
        />
      </div>

      {isError && !isDashboardLoading && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/40 px-6 py-8 text-center">
          <p className="text-sm font-bold text-red-500">
            Failed to load dashboard analytics.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="relative w-full">
        <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Dashboard Records"
          className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/50 py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.005)] transition-all placeholder-slate-400 hover:bg-slate-50 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
        />
      </div>

      <div className="space-y-6 rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-poppins text-lg font-extrabold text-[#0F2E4A] sm:text-xl">
            Booking & Revenue Trends
          </h2>
          <span className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-600">
            Monthly
          </span>
        </div>

        <div className="h-[340px] w-full pt-4">
          {isDashboardLoading ? (
            <ChartSkeleton />
          ) : trendData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
              No trend data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ left: -10, right: 10, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="superAdminBooking" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F2E4A" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#0F2E4A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="superAdminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00B2D6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00B2D6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: "bold" }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: "bold" }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#00B2D6", fontSize: 11, fontWeight: "bold" }} tickFormatter={(val) => `£${val}`} />
                <Tooltip contentStyle={{ border: "0", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }} />
                <Area yAxisId="left" type="monotone" dataKey="bookings" name="Bookings" stroke="#0F2E4A" strokeWidth={3} fillOpacity={1} fill="url(#superAdminBooking)" activeDot={{ r: 6, strokeWidth: 0, fill: "#0F2E4A" }} />
                <Area yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#00B2D6" strokeWidth={3} fillOpacity={1} fill="url(#superAdminRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: "#00B2D6" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentBookingsCard
          bookings={recentBookings}
          isLoading={isDashboardLoading}
        />
        <TopServicesCard
          services={chartServices}
          total={serviceTotal}
          isLoading={isDashboardLoading}
        />
        <RecentReportsCard
          reports={recentReports}
          isLoading={isDashboardLoading}
        />
      </div>
    </div>
  );
}

function RecentBookingsCard({
  bookings,
  isLoading,
}: {
  bookings: AdminRecentBooking[];
  isLoading: boolean;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-poppins text-base font-extrabold text-[#0F2E4A]">
            Recent Bookings
          </h3>
          <Link
            href="/dashboard/super-admin/all-booking"
            className="text-xs font-bold text-[#00B2D6] hover:underline"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <ListSkeleton />
        ) : bookings.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-center text-sm font-semibold text-slate-400">
            No recent bookings.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00B2D6] text-sm font-bold text-white">
                    {getInitial(booking.driverName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#0F2E4A] sm:text-sm">
                      {booking.driverName || "N/A"}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
                      {booking.service || "N/A"} - {formatDateTime(booking.scheduledAt)}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase ${getStatusClassName(booking.status)}`}>
                  {booking.status || "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TopServicesCard({
  services,
  total,
  isLoading,
}: {
  services: (AdminTopService & { color: string })[];
  total: number;
  isLoading: boolean;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-poppins text-base font-extrabold text-[#0F2E4A]">
            Top Services
          </h3>
          <Link
            href="/dashboard/super-admin/services"
            className="text-xs font-bold text-[#00B2D6] hover:underline"
          >
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
                  <Pie
                    data={services}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {services.map((service) => (
                      <Cell key={service.serviceId} fill={service.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-poppins text-2xl font-extrabold leading-none text-[#0F2E4A]">
                  {total.toLocaleString("en-GB")}
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Bookings
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {services.map((service) => (
                <div key={service.serviceId} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: service.color }} />
                    <span className="truncate text-xs font-bold text-slate-500">
                      {service.title || "N/A"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0F2E4A]">
                    {service.count}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RecentReportsCard({
  reports,
  isLoading,
}: {
  reports: AdminRecentMedicalRecord[];
  isLoading: boolean;
}) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-poppins text-base font-extrabold text-[#0F2E4A]">
            Recent Reports
          </h3>
        </div>

        {isLoading ? (
          <ListSkeleton />
        ) : reports.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center text-center text-sm font-semibold text-slate-400">
            No recent medical records.
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E6FAFF] text-[#00B2D6]">
                    <FileText size={18} className="stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#0F2E4A] sm:text-sm">
                      {report.service || "Medical Record"}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
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
                    aria-label={`Download report for ${report.driverName || "driver"}`}
                    title="Download Report"
                    className="shrink-0 text-[#00B2D6] transition-all hover:scale-110 hover:text-[#009cb9] active:scale-95"
                  >
                    <Download size={18} />
                  </a>
                ) : (
                  <span
                    className="shrink-0 cursor-not-allowed text-slate-300"
                    title="No document available"
                  >
                    <Download size={18} />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
