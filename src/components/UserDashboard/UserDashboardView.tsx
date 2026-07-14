"use client";

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Users,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
} from "lucide-react";
import {
  DriverAnalyticsAppointment,
  useGetDriverAnalyticsQuery,
} from "@/redux/service/user/userDashboardApi";

const formatAppointmentDate = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatAppointmentTime = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalizeStatus = (status: string) => status.trim().toUpperCase();

const getAppointmentType = (status: string) => {
  const normalized = normalizeStatus(status);
  if (normalized === "COMPLETED") return "Completed Appointment";
  if (normalized === "CANCELLED" || normalized === "CANCELED") {
    return "Cancelled Appointment";
  }
  return "Upcoming Appointment";
};

const getStatusBadgeClassName = (status: string) => {
  const normalized = normalizeStatus(status);

  if (normalized === "CONFIRMED") {
    return "bg-[#E8F8F5] text-[#10B981] border-[#A3E4D7]/30";
  }

  if (normalized === "COMPLETED") {
    return "bg-[#E6FAFF] text-[#00B2D6] border-[#B2ECF7]/50";
  }

  if (normalized === "CANCELLED" || normalized === "CANCELED") {
    return "bg-red-50 text-red-600 border-red-100";
  }

  return "bg-[#FEF9E7] text-[#D9A700] border-[#F9E79F]/30";
};

const SummaryCardSkeleton = () => (
  <div className="h-[130px] rounded-[24px] border border-slate-100/90 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
    <div className="flex items-center gap-3.5">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
      <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
    </div>
    <div className="mt-9 h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
  </div>
);

const AppointmentCardSkeleton = () => (
  <div className="space-y-4 rounded-[24px] border border-slate-100/90 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] sm:p-8">
    <div className="space-y-2">
      <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
      <div className="h-4 w-48 animate-pulse rounded-full bg-slate-100" />
    </div>

    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2.5">
          <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-slate-100" />
          <div
            className="h-3 animate-pulse rounded-full bg-slate-100"
            style={{ width: `${70 - index * 9}%` }}
          />
        </div>
      ))}
    </div>

    <div className="pt-2">
      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
    </div>
  </div>
);

const UserDashboardSkeleton = () => (
  <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
      Dashboard
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <SummaryCardSkeleton key={index} />
      ))}
    </div>

    <div className="space-y-5">
      <div className="h-7 w-48 animate-pulse rounded-full bg-slate-100" />
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, index) => (
          <AppointmentCardSkeleton key={index} />
        ))}
      </div>
    </div>
  </div>
);

export default function UserDashboardView() {
  const { data, isLoading, isFetching, isError, refetch } = useGetDriverAnalyticsQuery();
  const overview = data?.data?.overview;
  const appointments = data?.data?.appointments || [];
  const isBusy = isLoading || isFetching;

  if (isBusy) return <UserDashboardSkeleton />;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
      {/* Dashboard Heading */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
        Dashboard
      </h1>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Appointment */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF8FC] flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[#00B2D6]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Total Appointment
            </span>
            
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            {overview?.totalAppointment ?? 0}
          </span>
        </div>

        {/* Today Appointment */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F2EFFF] flex items-center justify-center shrink-0">
              <CalendarDays className="h-5 w-5 text-[#7B62FF]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Today Appointment
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            {overview?.todayAppointment ?? 0}
          </span>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Completed
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            {overview?.completed ?? 0}
          </span>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-[24px] border border-slate-100/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between h-[130px] transition-all hover:scale-[1.01]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] font-poppins leading-tight">
              Pending
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pl-1">
            {overview?.pending ?? 0}
          </span>
        </div>
      </div>

      {/* Appointments List Section */}
      <div className="space-y-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          My Appointments
        </h2>

        {isError ? (
          <div className="rounded-[24px] border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-600">
              Failed to load appointments.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-full bg-[#00B2D6] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0092B0]"
            >
              Try Again
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-[24px] border border-slate-100 bg-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <p className="text-sm font-semibold text-slate-500">
              You do not have any appointments yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((apt: DriverAnalyticsAppointment) => (
            <div
              key={apt.id}
              className="bg-white rounded-[24px] border border-slate-100/90 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {getAppointmentType(apt.status)}
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
                  {apt.serviceTitle}
                </h3>
              </div>

              {/* Detail Items */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Calendar className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">
                    {formatAppointmentDate(apt.scheduledAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Clock className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">
                    {formatAppointmentTime(apt.scheduledAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <MapPin className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.location}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Stethoscope className="h-4.5 w-4.5 text-[#00B2D6] shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold">{apt.clinicName}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider sm:text-xs ${getStatusBadgeClassName(
                    apt.status,
                  )}`}
                >
                  {formatStatus(apt.status)}
                </span>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
