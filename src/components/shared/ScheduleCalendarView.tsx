"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Popover, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export interface ScheduleCalendarAppointmentData {
  id: string;
  patientName: string;
  serviceType: string;
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  timeSlot: string;
  color: "cyan" | "navy";
}

type CalendarDay = ScheduleCalendarAppointmentData["day"];
type ScheduledAppointment = ScheduleCalendarAppointmentData & { date: string };
type ViewMode = "Daily" | "Weekly" | "Monthly";

interface ScheduleCalendarViewProps {
  appointments: ScheduleCalendarAppointmentData[];
  title?: string;
  showFilters?: boolean;
  createScheduleHref?: string;
  createScheduleLabel?: string;
}

const days: CalendarDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const dayOffsets: Record<CalendarDay, number> = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6,
};

const timeSlots = ["8:00 AM", "8:30 AM", "9:00 AM", "10:00 AM", "4:30 PM", "5:00 PM"];
const startOfWeek = (date: Dayjs) => date.startOf("day").subtract((date.day() + 6) % 7, "day");

export default function ScheduleCalendarView({
  appointments: appointmentData,
  title = "Calendar",
  showFilters = true,
  createScheduleHref,
  createScheduleLabel = "Create Schedule",
}: ScheduleCalendarViewProps) {
  const [hospital, setHospital] = useState("Royal Free Hospital");
  const [location, setLocation] = useState("London");
  const [viewMode, setViewMode] = useState<ViewMode>("Weekly");
  const [selectedDate, setSelectedDate] = useState(() => dayjs().startOf("day"));
  const [appointments] = useState<ScheduledAppointment[]>(() => {
    const currentWeekStart = startOfWeek(dayjs());

    return appointmentData.map((appointment) => ({
      ...appointment,
      date: currentWeekStart.add(dayOffsets[appointment.day], "day").format("YYYY-MM-DD"),
    }));
  });

  const selectedWeek = days.map((_, index) => startOfWeek(selectedDate).add(index, "day"));

  const getAppointmentsForCell = (date: Dayjs, timeSlot: string) => {
    return appointments.filter(
      (appointment) => appointment.date === date.format("YYYY-MM-DD") && appointment.timeSlot === timeSlot,
    );
  };

  const handlePillClick = (app: ScheduledAppointment) => {
    toast.info(
      `Appointment: ${app.patientName} - ${app.serviceType} (${dayjs(app.date).format("ddd, DD MMM")} ${app.timeSlot})`,
    );
  };

  const navigateCalendar = (direction: -1 | 1) => {
    const unit = viewMode === "Daily" ? "day" : viewMode === "Weekly" ? "week" : "month";
    setSelectedDate((current) => current.add(direction, unit));
  };

  const periodLabel =
    viewMode === "Daily"
      ? selectedDate.format("dddd, DD MMMM YYYY")
      : viewMode === "Weekly"
        ? `${selectedWeek[0].format("DD MMM")} - ${selectedWeek[6].format("DD MMM YYYY")}`
        : selectedDate.format("MMMM YYYY");

  const monthCellRender = (current: Dayjs, info: { type: string }) => {
    if (info.type !== "date") return null;

    const dayApps = appointments.filter((appointment) => appointment.date === current.format("YYYY-MM-DD"));
    if (dayApps.length === 0) return null;

    const popoverContent = (
      <div className="space-y-2 p-1 min-w-[200px] font-sans">
        <p className="font-extrabold text-[#0F2E4A] text-xs border-b border-slate-100 pb-1.5 mb-2 font-poppins">
          Appointments for {current.format("DD MMMM YYYY")}
        </p>
        <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
          {dayApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handlePillClick(app)}
              className={`flex items-center justify-between gap-3 p-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50 transition-all border ${
                app.color === "cyan" ? "border-cyan-50 text-[#00B2D6]" : "border-slate-100 text-[#0F2E4A]"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    app.color === "cyan" ? "bg-[#00B2D6]" : "bg-[#0F2E4A]"
                  }`}
                />
                <span className="truncate">{app.patientName}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 shrink-0">{app.timeSlot}</span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <Popover content={popoverContent} trigger="hover" placement="bottom" overlayClassName="premium-popover">
        <div className="flex flex-wrap items-center gap-1 mt-2 justify-center py-1 cursor-pointer">
          {dayApps.map((app) => (
            <span
              key={app.id}
              className={`w-2 h-2 rounded-full transition-transform hover:scale-125 ${
                app.color === "cyan" ? "bg-[#00B2D6]" : "bg-[#0F2E4A]"
              }`}
            />
          ))}
        </div>
      </Popover>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">{title}</h1>

        <div className="flex flex-wrap items-center gap-3">
          {showFilters && (
            <>
              <Select
                value={hospital}
                onChange={setHospital}
                options={[
                  { value: "Royal Free Hospital", label: "Royal Free Hospital" },
                  { value: "St Thomas' Hospital", label: "St Thomas' Hospital" },
                  { value: "Guy's Hospital", label: "Guy's Hospital" },
                ]}
                className="w-48 h-10 select-premium-calendar"
                classNames={{ popup: { root: "premium-select-popup" } }}
              />

              <Select
                value={location}
                onChange={setLocation}
                options={[
                  { value: "London", label: "London" },
                  { value: "Manchester", label: "Manchester" },
                  { value: "Leeds", label: "Leeds" },
                  { value: "Birmingham", label: "Birmingham" },
                ]}
                className="w-32 h-10 select-premium-calendar"
                classNames={{ popup: { root: "premium-select-popup" } }}
              />
            </>
          )}

          <Select
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "Daily", label: "Daily" },
              { value: "Weekly", label: "Weekly" },
              { value: "Monthly", label: "Monthly" },
            ]}
            className="w-28 h-10 select-premium-calendar"
            classNames={{ popup: { root: "premium-select-popup" } }}
          />

          {createScheduleHref && (
            <Link
              href={createScheduleHref}
              className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
            >
              {createScheduleLabel}
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-100 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateCalendar(-1)}
            aria-label={`Previous ${viewMode.toLowerCase()}`}
            title={`Previous ${viewMode.toLowerCase()}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(dayjs().startOf("day"))}
            className="h-9 rounded-lg border border-slate-200 px-4 text-xs font-bold text-[#0F2E4A] transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => navigateCalendar(1)}
            aria-label={`Next ${viewMode.toLowerCase()}`}
            title={`Next ${viewMode.toLowerCase()}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="text-sm font-extrabold text-[#0F2E4A] sm:text-base">{periodLabel}</p>
      </div>

      {viewMode === "Daily" && (
        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-left border-r border-slate-100 w-[120px]">
                  TIME
                </th>
                <th
                  className={`py-4 px-6 text-xs font-bold uppercase tracking-wider text-center ${
                    selectedDate.isSame(dayjs(), "day") ? "bg-[#E6FAFF]/60 text-[#00B2D6]" : "text-slate-500"
                  }`}
                >
                  <div>{selectedDate.format("ddd, DD MMM")}</div>
                  {selectedDate.isSame(dayjs(), "day") && (
                    <div className="text-[10px] text-[#00B2D6] font-bold mt-0.5">TODAY</div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => {
                const cellApps = getAppointmentsForCell(selectedDate, timeSlot);
                return (
                  <tr key={timeSlot} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-6 px-6 text-xs font-bold text-slate-400 border-r border-slate-100 bg-slate-50/10 align-middle">
                      {timeSlot}
                    </td>
                    <td className="p-4 bg-[#E6FAFF]/10 align-top">
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 min-h-[45px] items-center">
                        {cellApps.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => handlePillClick(app)}
                            className={`rounded-lg px-4 py-2 text-xs font-bold tracking-wide text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99] shadow-sm select-none ${
                              app.color === "cyan" ? "bg-[#00B2D6] hover:bg-[#009cb9]" : "bg-[#0F2E4A] hover:bg-[#0A2033]"
                            }`}
                          >
                            {app.patientName} - {app.serviceType}
                          </div>
                        ))}
                        {cellApps.length === 0 && (
                          <span className="text-xs font-semibold text-slate-300">No appointments scheduled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "Weekly" && (
        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] bg-white">
          <table className="w-full border-collapse min-w-[1200px] table-fixed">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-left border-r border-slate-100 w-[100px]">
                  TIME
                </th>
                {selectedWeek.map((date) => {
                  const isToday = date.isSame(dayjs(), "day");
                  return (
                    <th
                      key={date.format("YYYY-MM-DD")}
                      className={`py-4 px-3 text-xs font-bold uppercase tracking-wider text-center border-r border-slate-100 last:border-r-0 ${
                        isToday ? "bg-[#E6FAFF] text-[#00B2D6]" : "text-slate-500"
                      }`}
                    >
                      <div>{date.format("ddd")}</div>
                      <div className="mt-0.5 text-[10px]">{date.format("DD MMM")}</div>
                      {isToday && <div className="mt-0.5 text-[10px] text-[#00B2D6]">TODAY</div>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-6 px-4 text-xs font-bold text-slate-400 border-r border-slate-100 bg-slate-50/10 align-middle">
                    {timeSlot}
                  </td>
                  {selectedWeek.map((date) => {
                    const cellApps = getAppointmentsForCell(date, timeSlot);
                    const isToday = date.isSame(dayjs(), "day");
                    return (
                      <td
                        key={date.format("YYYY-MM-DD")}
                        className={`p-2.5 border-r border-slate-100 last:border-r-0 align-top ${
                          isToday ? "bg-[#E6FAFF]/15" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col gap-1.5 min-h-[60px] justify-center">
                          {cellApps.map((app) => (
                            <div
                              key={app.id}
                              onClick={() => handlePillClick(app)}
                              className={`rounded-lg px-2 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-wide text-center text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99] shadow-sm select-none truncate ${
                                app.color === "cyan"
                                  ? "bg-[#00B2D6] hover:bg-[#009cb9] shadow-cyan-50/30"
                                  : "bg-[#0F2E4A] hover:bg-[#0A2033] shadow-slate-200/50"
                              }`}
                              title={`${app.patientName} - ${app.serviceType}`}
                            >
                              {app.patientName}-{app.serviceType}
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "Monthly" && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-6">
          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date.startOf("day"))}
            onSelect={(date) => setSelectedDate(date.startOf("day"))}
            cellRender={monthCellRender}
            className="premium-antd-calendar"
          />
        </div>
      )}

      <style jsx global>{`
        .select-premium-calendar .ant-select-selector {
          border-radius: 12px !important;
          border-color: #cbd5e1 !important;
          font-weight: 600 !important;
          color: #0f2e4a !important;
          font-family: inherit !important;
        }
        .select-premium-calendar .ant-select-selector:hover {
          border-color: #00b2d6 !important;
        }
        .select-premium-calendar.ant-select-focused .ant-select-selector {
          border-color: #00b2d6 !important;
          box-shadow: 0 0 0 2px rgba(0, 178, 214, 0.1) !important;
        }
        .premium-select-popup .ant-select-item {
          font-weight: 600 !important;
          font-family: inherit !important;
        }
        .premium-antd-calendar .ant-picker-calendar-header {
          padding-bottom: 16px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          margin-bottom: 16px !important;
        }
        .premium-antd-calendar .ant-picker-calendar-mode-switch {
          display: none !important;
        }
        .premium-antd-calendar .ant-picker-calendar-date {
          border-top: 2px solid #f8fafc !important;
          margin: 2px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }
        .premium-antd-calendar .ant-picker-calendar-date:hover {
          background-color: #f8fafc !important;
        }
        .premium-antd-calendar .ant-picker-calendar-date-today {
          border-top-color: #00b2d6 !important;
          background-color: rgba(0, 178, 214, 0.05) !important;
        }
        .premium-antd-calendar .ant-picker-calendar-date-value {
          font-weight: 700 !important;
          color: #0f2e4a !important;
        }
      `}</style>
    </div>
  );
}
