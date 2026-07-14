"use client";

import React, { useMemo } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import type { BookingSlot } from "@/redux/service/user/userBookingFlowApi";

interface Step3SelectTimeSlotProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedSlotId: string | null;
  setSelectedSlotId: (slotId: string | null) => void;
  slots: BookingSlot[];
  isAvailable: boolean;
  isLoading: boolean;
  isError: boolean;
  calendarMonth: Date;
  setCalendarMonth: React.Dispatch<React.SetStateAction<Date>>;
  onBack: () => void;
  onContinue: () => void;
  onRetry: () => void;
}

const SlotSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="status" aria-label="Loading time slots">
    {Array.from({ length: 9 }).map((_, index) => (
      <div key={index} className="h-11 animate-pulse rounded-xl bg-slate-100" />
    ))}
    <span className="sr-only">Loading time slots...</span>
  </div>
);

export default function Step3SelectTimeSlot({
  selectedDate,
  setSelectedDate,
  selectedSlotId,
  setSelectedSlotId,
  slots,
  isAvailable,
  isLoading,
  isError,
  calendarMonth,
  setCalendarMonth,
  onBack,
  onContinue,
  onRetry,
}: Step3SelectTimeSlotProps) {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const isCurrentMonth =
    calendarMonth.getFullYear() === today.getFullYear() &&
    calendarMonth.getMonth() === today.getMonth();

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarData = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDayDate = new Date(year, month, 1);
    const dayOfWeek = firstDayDate.getDay();
    const offset = (dayOfWeek + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return {
      year,
      month,
      days,
      monthName: calendarMonth.toLocaleString("default", { month: "long" }),
    };
  }, [calendarMonth]);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-400 transition-colors hover:text-[#00B2D6] sm:text-sm"
      >
        <ArrowLeft size={16} />
        <span>Back to Location</span>
      </button>

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-4xl">
          Select Time Slot
        </h2>
      </div>

      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="border-r-0 border-slate-100 pr-0 md:border-r md:pr-8">
            <div className="mb-8 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isCurrentMonth}
                className="rounded-full p-2 text-slate-500 transition-all hover:bg-slate-50 hover:text-[#00B2D6] disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-base font-extrabold text-[#0F2E4A]">
                {calendarData.monthName} {calendarData.year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="rounded-full p-2 text-slate-500 transition-all hover:bg-slate-50 hover:text-[#00B2D6]"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-7 gap-y-2 text-center">
              {daysOfWeek.map((day, index) => (
                <span key={`${day}-${index}`} className="text-xs font-bold uppercase text-slate-400">
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-3 text-center">
              {calendarData.days.map((day, index) => {
                if (day === null) return <div key={index} />;

                const dateForDay = new Date(calendarData.year, calendarData.month, day);
                dateForDay.setHours(0, 0, 0, 0);
                const isPastDate = dateForDay < today;
                const isSelected =
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === calendarData.month &&
                  selectedDate.getFullYear() === calendarData.year;

                return (
                  <div key={index} className="flex justify-center">
                    <button
                      type="button"
                      disabled={isPastDate}
                      onClick={() => {
                        if (isPastDate) return;
                        setSelectedDate(new Date(calendarData.year, calendarData.month, day));
                        setSelectedSlotId(null);
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-[#00B2D6] text-white shadow-sm shadow-[#00B2D6]/20"
                          : isPastDate
                            ? "cursor-not-allowed text-slate-300 line-through"
                          : "text-[#0F2E4A] hover:bg-slate-100 hover:text-[#00B2D6]"
                      }`}
                      aria-label={
                        isPastDate
                          ? `${dateForDay.toLocaleDateString()} unavailable`
                          : `${dateForDay.toLocaleDateString()}`
                      }
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-6 px-1 text-base font-extrabold text-[#0F2E4A]">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>

            {isLoading ? (
              <SlotSkeleton />
            ) : isError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-6 text-center">
                <p className="text-sm font-bold text-red-500">Failed to load slots.</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#0092B3]"
                >
                  <RefreshCw size={14} />
                  Retry
                </button>
              </div>
            ) : !isAvailable || slots.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                <p className="text-sm font-bold text-[#0F2E4A]">No slots available</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Please select another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-xl px-4 py-3 text-center text-xs font-bold transition-all sm:text-sm ${
                        isSelected
                          ? "bg-[#00B2D6] text-white shadow-sm shadow-[#00B2D6]/10"
                          : "bg-[#E6FAFF] text-[#0F2E4A] hover:bg-[#00B2D6] hover:text-white"
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={onContinue}
            disabled={!selectedSlotId || isLoading}
            className="w-full max-w-md rounded-full bg-[#00B2D6] py-4 text-base font-bold text-white shadow-md shadow-[#00B2D6]/10 transition-all duration-200 hover:scale-[1.01] hover:bg-[#0092B3] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
