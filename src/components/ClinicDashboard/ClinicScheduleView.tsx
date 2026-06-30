"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Select, Calendar, Popover } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { toast } from "sonner";
import { clinicCalendarAppointments, CalendarAppointmentData } from "@/app/data/ClinicDashboardData";

export default function ClinicScheduleView() {
  const [hospital, setHospital] = useState("Royal Free Hospital");
  const [location, setLocation] = useState("London");
  const [viewMode, setViewMode] = useState("Weekly"); // Default to Weekly matching grid mockup
  const [appointments] = useState<CalendarAppointmentData[]>(clinicCalendarAppointments);

  const timeSlots = ["8:00 AM", "8:30 AM", "9:00 AM", "10:00 AM", "4:30 PM", "5:00 PM"];
  const days: Array<"MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"> = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];

  // Helper to filter appointments in a specific grid cell
  const getAppointmentsForCell = (day: typeof days[number], timeSlot: string) => {
    return appointments.filter((app) => app.day === day && app.timeSlot === timeSlot);
  };

  const handlePillClick = (app: CalendarAppointmentData) => {
    toast.info(`Appointment: ${app.patientName} - ${app.serviceType} (${app.day} ${app.timeSlot})`);
  };

  // Ant Design Calendar custom cell renderer for Monthly view
  const monthCellRender = (current: Dayjs, info: { type: string }) => {
    if (info.type === "date") {
      const dayIndex = current.day();
      const indexToDayMap: Record<number, typeof days[number]> = {
        0: "SUN",
        1: "MON",
        2: "TUE",
        3: "WED",
        4: "THU",
        5: "FRI",
        6: "SAT",
      };
      const dayKey = indexToDayMap[dayIndex];
      const dayApps = appointments.filter((app) => app.day === dayKey);

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
        <Popover
          content={popoverContent}
          trigger="hover"
          placement="bottom"
          overlayClassName="premium-popover"
        >
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
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Calendar
        </h1>

        {/* Dropdown Filters and Create Button */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={hospital}
            onChange={setHospital}
            options={[
              { value: "Royal Free Hospital", label: "Royal Free Hospital" },
              { value: "St Thomas' Hospital", label: "St Thomas' Hospital" },
              { value: "Guy's Hospital", label: "Guy's Hospital" },
            ]}
            className="w-48 h-10 select-premium-calendar"
            classNames={{
              popup: {
                root: "premium-select-popup"
              }
            }}
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
            classNames={{
              popup: {
                root: "premium-select-popup"
              }
            }}
          />

          <Select
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "Daily", label: "Daily" },
              { value: "Weekly", label: "Weekly" },
              { value: "Monthly", label: "Monthly" },
            ]}
            className="w-28 h-10 select-premium-calendar"
            classNames={{
              popup: {
                root: "premium-select-popup"
              }
            }}
          />

          <Link
            href="/dashboard/clinic/create-schedule"
            className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
          >
            Create Schedule
          </Link>
        </div>
      </div>

      {/* Render Daily View Grid */}
      {viewMode === "Daily" && (
        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-left border-r border-slate-100 w-[120px]">
                  TIME
                </th>
                <th className="py-4 px-6 text-xs font-bold text-[#00B2D6] uppercase tracking-wider text-center bg-[#E6FAFF]/60">
                  <div>MON (SELECTED DAY)</div>
                  <div className="text-[10px] text-[#00B2D6] font-bold mt-0.5">TODAY</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => {
                const cellApps = getAppointmentsForCell("MON", timeSlot);
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
                              app.color === "cyan"
                                ? "bg-[#00B2D6] hover:bg-[#009cb9]"
                                : "bg-[#0F2E4A] hover:bg-[#0A2033]"
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

      {/* Render Weekly View Grid (matching mockup grid MON to FRI) */}
      {viewMode === "Weekly" && (
        <div className="overflow-x-auto rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] bg-white">
          <table className="w-full border-collapse min-w-[950px] table-fixed">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-left border-r border-slate-100 w-[100px]">
                  TIME
                </th>
                <th className="py-4 px-4 text-xs font-bold text-[#00B2D6] uppercase tracking-wider text-center border-r border-slate-100 bg-[#E6FAFF] w-[18%]">
                  <div>MON</div>
                  <div className="text-[10px] text-[#00B2D6] font-bold mt-0.5">TODAY</div>
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-[18%]">
                  TUE
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-[18%]">
                  WED
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center border-r border-slate-100 w-[18%]">
                  THU
                </th>
                <th className="py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[18%]">
                  FRI
                </th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-6 px-4 text-xs font-bold text-slate-400 border-r border-slate-100 bg-slate-50/10 align-middle">
                    {timeSlot}
                  </td>
                  {days.slice(0, 5).map((day) => {
                    const cellApps = getAppointmentsForCell(day, timeSlot);
                    const isMon = day === "MON";
                    return (
                      <td
                        key={day}
                        className={`p-2.5 border-r border-slate-100 last:border-r-0 align-top ${
                          isMon ? "bg-[#E6FAFF]/15" : "bg-white"
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

      {/* Render Monthly View using Ant Design's Calendar component */}
      {viewMode === "Monthly" && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-6">
          <Calendar
            cellRender={monthCellRender}
            className="premium-antd-calendar"
          />
        </div>
      )}

      {/* Styled styles overrides for Ant Selects & Calendar to keep premium aesthetic */}
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

        /* Ant Design Calendar Premium Theme Styling */
        .premium-antd-calendar .ant-picker-calendar-header {
          padding-bottom: 16px !important;
          border-bottom: 1px solid #f1f5f9 !important;
          margin-bottom: 16px !important;
        }
        .premium-antd-calendar .ant-picker-calendar-mode-switch {
          display: none !important; /* Hide default mode switcher as we use our dropdown */
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
