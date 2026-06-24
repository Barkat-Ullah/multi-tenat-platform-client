"use client";

import React, { useMemo } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface Step3SelectTimeSlotProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  calendarMonth: Date;
  setCalendarMonth: React.Dispatch<React.SetStateAction<Date>>;
  onBack: () => void;
  onContinue: () => void;
}

export default function Step3SelectTimeSlot({
  selectedDate,
  setSelectedDate,
  selectedTimeSlot,
  setSelectedTimeSlot,
  calendarMonth,
  setCalendarMonth,
  onBack,
  onContinue
}: Step3SelectTimeSlotProps) {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const timeSlots = [
    "12:50 PM", "01:00 PM", "01:20 PM", "01:30 PM",
    "01:50 PM", "02:20 PM", "02:50 PM", "03:30 PM",
    "04:10 PM", "04:20 PM", "04:40 PM"
  ];

  const handlePrevMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCalendarMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    
    const firstDayDate = new Date(year, month, 1);
    const dayOfWeek = firstDayDate.getDay();
    const offset = (dayOfWeek + 6) % 7;
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    
    return {
      year,
      month,
      days,
      monthName: calendarMonth.toLocaleString("default", { month: "long" })
    };
  }, [calendarMonth]);

  return (
    <div className="w-full">
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-400 hover:text-[#00B2D6] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        <span>Back to Location</span>
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
          Select Time Slot
        </h2>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column - Calendar */}
          <div className="border-r border-slate-100 pr-0 md:pr-8">
            {/* Month Picker Header */}
            <div className="flex items-center justify-between mb-8 px-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-[#00B2D6] transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-extrabold text-base text-[#0F2E4A]">
                {calendarData.monthName} {calendarData.year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-[#00B2D6] transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-y-2 mb-4 text-center">
              {daysOfWeek.map((day, i) => (
                <span key={i} className="text-xs font-bold text-slate-400 uppercase">
                  {day}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-y-3 text-center">
              {calendarData.days.map((day, idx) => {
                if (day === null) {
                  return <div key={idx} />;
                }

                const isSelected = 
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === calendarData.month &&
                  selectedDate.getFullYear() === calendarData.year;

                return (
                  <div key={idx} className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(new Date(calendarData.year, calendarData.month, day))}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#00B2D6] text-white shadow-sm shadow-[#00B2D6]/20"
                          : "text-[#0F2E4A] hover:bg-slate-100 hover:text-[#00B2D6]"
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Time Slots */}
          <div>
            {/* Selected Day Name */}
            <h3 className="font-extrabold text-base text-[#0F2E4A] mb-6 px-1">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </h3>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isSlotSelected = selectedTimeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-center transition-all ${
                      isSlotSelected
                        ? "bg-[#00B2D6] text-white shadow-sm shadow-[#00B2D6]/10"
                        : "bg-[#E6FAFF] text-[#0F2E4A] hover:bg-[#00B2D6] hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Continue Button inside card */}
        <div className="border-t border-slate-100 mt-8 pt-6 flex justify-center">
          <button
            type="button"
            onClick={onContinue}
            className="w-full max-w-md py-4 rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold text-base transition-all duration-200 shadow-md shadow-[#00B2D6]/10 hover:scale-[1.01]"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}
