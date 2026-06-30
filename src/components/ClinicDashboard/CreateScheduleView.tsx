"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { clinicTimeSlotsData, ClinicTimeSlot } from "@/app/data/ClinicDashboardData";
import { toast } from "sonner";

export default function CreateScheduleView() {
  const [selectedDay, setSelectedDay] = useState<number>(4);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [timeSlots, setTimeSlots] = useState<ClinicTimeSlot[]>(clinicTimeSlotsData);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  
  // We can render days 1 to 30 for scheduling calendar mockup representation
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleGenerateSlots = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Slots successfully generated from ${startTime} to ${endTime}!`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Create Schedule
        </h1>
      </div>

      {/* Main card box container */}
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 md:p-10 shadow-[0_4px_25px_rgba(0,0,0,0.015)] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Schedule Management & Calendar */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] font-poppins">
                Schedule Management
              </h2>
              {/* Date Indicator Selector */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full text-slate-600 cursor-pointer hover:bg-slate-50 transition-all select-none">
                <Calendar size={15} className="text-[#00B2D6]" />
                <span className="text-xs font-bold font-sans">January 06</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Calendar Grid Representation */}
            <div className="space-y-4">
              {/* Days Header */}
              <div className="grid grid-cols-7 text-center">
                {daysOfWeek.map((day, idx) => (
                  <span key={idx} className="text-xs font-bold text-slate-400 font-sans py-2">
                    {day}
                  </span>
                ))}
              </div>

              {/* Month Days Numbers Grid */}
              <div className="grid grid-cols-7 gap-2.5 text-center">
                {calendarDays.map((day) => {
                  const isSelected = day === selectedDay;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all border outline-none cursor-pointer select-none ${
                        isSelected
                          ? "bg-[#00B2D6] text-white border-[#00B2D6] shadow-md shadow-cyan-100"
                          : "bg-white text-slate-500 border-cyan-100/50 hover:border-[#00B2D6]/40"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available Time Form Section */}
            <form onSubmit={handleGenerateSlots} className="space-y-5 pt-4 border-t border-slate-100">
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins">
                Available Time
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="10:00"
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] font-semibold transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="18:00"
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
                >
                  Generate Slot
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Time Slot Display Panel */}
          <div className="space-y-6 lg:border-l lg:border-slate-100 lg:pl-10 w-full">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2E4A] font-poppins">
              Time Slot
            </h2>

            {/* List of generated timeslot rows */}
            <div className="space-y-3.5">
              {timeSlots.map((slot) => {
                let badgeClass = "";
                if (slot.status === "Active") {
                  badgeClass = "bg-[#10B981] text-white";
                } else if (slot.status === "Booked") {
                  badgeClass = "bg-[#00B2D6] text-white";
                } else {
                  badgeClass = "bg-[#FDE8E8] text-[#E53E3E]";
                }

                return (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between px-5 py-4 border border-slate-200 rounded-2xl hover:shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow bg-white"
                  >
                    <span className="text-xs sm:text-sm text-slate-500 font-bold font-sans">
                      {slot.timeRange}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider select-none ${badgeClass}`}
                    >
                      {slot.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Pagination Control Section */}
            <div className="flex items-center justify-end gap-2 pt-6">
              <button
                type="button"
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all outline-none cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-[#00B2D6] text-white flex items-center justify-center font-bold text-xs sm:text-sm border border-[#00B2D6] shadow-sm cursor-pointer"
              >
                1
              </button>
              
              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer"
              >
                2
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer"
              >
                3
              </button>

              <button
                type="button"
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all outline-none cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
