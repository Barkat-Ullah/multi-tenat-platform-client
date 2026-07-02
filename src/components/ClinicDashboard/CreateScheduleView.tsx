"use client";

import React, { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import {
  type ClinicAvailability,
  type ClinicTimeSlot,
  type ClinicTimeSlotListResponse,
  useCreateClinicScheduleMutation,
  useGetClinicAvailabilityByMonthQuery,
  useGetClinicTimeSlotsQuery,
} from "@/redux/service/clinic/clinicScheduleApi";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };

  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

const getTimeSlots = (response?: ClinicTimeSlotListResponse): ClinicTimeSlot[] => {
  const data = response?.data;
  if (!data) return [];

  if (!Array.isArray(data)) {
    return data.timeSlots || data.slots || [];
  }

  return data.flatMap((item) => {
    if ("slotDate" in item) {
      const availability = item as ClinicAvailability;
      return (availability.timeSlots || []).map((slot) => ({
        ...slot,
        availabilityId: slot.availabilityId || availability.id,
        clinicId: slot.clinicId || availability.clinicId,
        date: slot.date || availability.slotDate,
        availabilityIsActive: availability.isActive,
      }));
    }
    return item as ClinicTimeSlot;
  });
};

const getAvailabilities = (
  response?: ClinicTimeSlotListResponse,
): ClinicAvailability[] => {
  const data = response?.data;
  if (!Array.isArray(data)) return [];

  return data.filter(
    (item): item is ClinicAvailability => "slotDate" in item,
  );
};

const timeToMinutes = (time: string) => {
  const [clock, meridiem] = time.trim().split(/\s+/);
  const [rawHours, minutes] = clock.split(":").map(Number);
  let hours = rawHours;

  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;

  return hours * 60 + minutes;
};

export default function CreateScheduleView() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() =>
    dayjs().startOf("day"),
  );
  const [visibleMonth, setVisibleMonth] = useState<Dayjs>(() =>
    dayjs().startOf("month"),
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");

  const month = visibleMonth.format("YYYY-MM");
  const {
    data: availabilityResponse,
    isFetching: isFetchingAvailability,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
  } = useGetClinicAvailabilityByMonthQuery(month);
  const {
    data: timeSlotResponse,
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
    isError: isTimeSlotError,
    refetch: refetchTimeSlots,
  } = useGetClinicTimeSlotsQuery();
  const [createClinicSchedule, { isLoading: isCreatingSchedule }] =
    useCreateClinicScheduleMutation();

  const monthSlots = useMemo(
    () => getTimeSlots(timeSlotResponse),
    [timeSlotResponse],
  );
  const clinicAvailabilities = useMemo(
    () => getAvailabilities(timeSlotResponse),
    [timeSlotResponse],
  );
  const monthAvailability = availabilityResponse?.data.data || [];
  const selectedAvailability = clinicAvailabilities.find((availability) =>
    dayjs(availability.slotDate).isSame(selectedDate, "day"),
  );
  const selectedMonthAvailability = monthAvailability.find(
    (item) => item.date === selectedDate.format("YYYY-MM-DD"),
  );
  const selectedDateIsPast = selectedDate.isBefore(dayjs().startOf("day"), "day");
  const selectedDateHasSchedule =
    Boolean(selectedAvailability) || selectedMonthAvailability?.isActive === true;
  const isScheduleDataLoading =
    isLoadingSlots || isFetchingSlots || isFetchingAvailability;
  const isScheduleDataUnavailable = isTimeSlotError || isAvailabilityError;
  const selectedDateSlots = useMemo(
    () =>
      monthSlots
        .filter(
          (slot) => slot.date && dayjs(slot.date).isSame(selectedDate, "day"),
        )
        .sort(
          (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
        ),
    [monthSlots, selectedDate],
  );

  const leadingBlankDays = visibleMonth.day();
  const daysInMonth = visibleMonth.daysInMonth();
  const calendarCells = Array.from(
    { length: leadingBlankDays + daysInMonth },
    (_, index) => (index < leadingBlankDays ? null : index - leadingBlankDays + 1),
  );

  const changeMonth = (direction: -1 | 1) => {
    const nextMonth = visibleMonth.add(direction, "month").startOf("month");
    setVisibleMonth(nextMonth);
    setSelectedDate(nextMonth);
  };

  const handleGenerateSlots = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedDateIsPast) {
      toast.error("Schedules cannot be created for past dates.");
      return;
    }

    if (isScheduleDataUnavailable) {
      toast.error("Schedule data is unavailable. Please try again.");
      return;
    }

    if (selectedDateHasSchedule) {
      toast.error("A schedule already exists for this date.");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Start time and end time are required.");
      return;
    }

    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      toast.error("End time must be later than start time.");
      return;
    }

    try {
      const response = await createClinicSchedule({
        slotDate: selectedDate.format("YYYY-MM-DD"),
        startTime,
        endTime,
      }).unwrap();
      toast.success(response.message || "Schedule created successfully.");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create schedule."));
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Create Schedule
      </h1>

      <div className="w-full rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] sm:p-8 md:p-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-poppins text-lg font-extrabold text-[#0F2E4A] sm:text-xl">
                Schedule Management
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                  title="Previous month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6]"
                >
                  <ChevronLeft size={17} />
                </button>
                <div className="flex min-w-[145px] items-center justify-center gap-2 text-slate-600">
                  <CalendarDays size={16} className="text-[#00B2D6]" />
                  <span className="text-xs font-bold">
                    {visibleMonth.format("MMMM YYYY")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                  title="Next month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6]"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-7 text-center">
                {daysOfWeek.map((day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="py-2 text-xs font-bold text-slate-400"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-center sm:gap-2.5">
                {calendarCells.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="h-10 sm:h-11" />;
                  }

                  const date = visibleMonth.date(day);
                  const isSelected = date.isSame(selectedDate, "day");
                  const dayAvailability = monthAvailability.find(
                    (item) => item.date === date.format("YYYY-MM-DD"),
                  );
                  const isAvailable = dayAvailability?.isActive === true;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`relative flex h-10 w-full items-center justify-center rounded-xl border text-xs font-bold transition-colors sm:h-11 sm:text-sm ${
                        isSelected
                          ? "border-[#00B2D6] bg-[#00B2D6] text-white shadow-md shadow-cyan-100"
                          : "border-cyan-100/50 bg-white text-slate-500 hover:border-[#00B2D6]/40"
                      }`}
                    >
                      {day}
                      {isAvailable && (
                        <span
                          className={`absolute bottom-1 h-1 w-1 rounded-full ${
                            isSelected ? "bg-white" : "bg-[#00B2D6]"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              {isFetchingAvailability && (
                <p className="text-center text-xs font-semibold text-slate-400">
                  Updating availability...
                </p>
              )}
              {isAvailabilityError && (
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="font-semibold text-red-500">
                    Failed to load availability.
                  </span>
                  <button
                    type="button"
                    onClick={() => refetchAvailability()}
                    className="font-bold text-[#00B2D6] hover:text-[#009cb9]"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={handleGenerateSlots}
              className="space-y-5 border-t border-slate-100 pt-4"
            >
              <div>
                <h3 className="font-poppins text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                  Available Time
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {selectedDate.format("dddd, DD MMMM YYYY")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="schedule-start-time"
                    className="mb-1.5 block text-xs font-bold text-[#0F2E4A]"
                  >
                    Start Time
                  </label>
                  <input
                    id="schedule-start-time"
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-colors focus:border-[#00B2D6] focus:outline-none sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="schedule-end-time"
                    className="mb-1.5 block text-xs font-bold text-[#0F2E4A]"
                  >
                    End Time
                  </label>
                  <input
                    id="schedule-end-time"
                    type="time"
                    value={endTime}
                    onChange={(event) => setEndTime(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-colors focus:border-[#00B2D6] focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isCreatingSchedule ||
                  isScheduleDataLoading ||
                  isScheduleDataUnavailable ||
                  selectedDateIsPast ||
                  selectedDateHasSchedule
                }
                className="rounded-full bg-[#00B2D6] px-7 py-3 text-xs font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 transition-colors hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {isCreatingSchedule
                  ? "Generating..."
                  : selectedDateIsPast
                    ? "Past Date"
                    : selectedDateHasSchedule
                      ? "Schedule Exists"
                      : "Generate Slot"}
              </button>
            </form>
          </div>

          <div className="w-full space-y-6 lg:border-l lg:border-slate-100 lg:pl-10">
            <div>
              <h2 className="font-poppins text-lg font-extrabold text-[#0F2E4A] sm:text-xl">
                Time Slots
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {selectedDate.format("DD MMMM YYYY")}
              </p>
            </div>

            {isLoadingSlots || isFetchingSlots ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <Spinner />
              </div>
            ) : isTimeSlotError ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm font-bold text-red-500">
                  Failed to load time slots.
                </p>
                <button
                  type="button"
                  onClick={() => refetchTimeSlots()}
                  className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#009cb9]"
                >
                  Try Again
                </button>
              </div>
            ) : selectedDateSlots.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 text-center">
                <p className="text-sm font-semibold text-slate-400">
                  No time slots have been created for this date.
                </p>
              </div>
            ) : (
              <div className="max-h-[520px] space-y-3.5 overflow-y-auto pr-1">
                {selectedDateSlots.map((slot) => {
                  const isAvailabilityInactive =
                    slot.availabilityIsActive === false;
                  const isActive =
                    !isAvailabilityInactive && slot.status === "Active";
                  const isBooked =
                    !isAvailabilityInactive && slot.isBooked === true;
                  const status = isAvailabilityInactive
                    ? "Inactive"
                    : isBooked
                      ? "Booked"
                      : slot.status;

                  return (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4"
                    >
                      <span className="text-xs font-bold text-slate-500 sm:text-sm">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      <span
                        className={`rounded-lg px-3 py-1 text-[10px] font-bold tracking-wider ${
                          isBooked
                            ? "bg-[#00B2D6] text-white"
                            : isActive
                              ? "bg-[#10B981] text-white"
                              : "bg-[#FDE8E8] text-[#E53E3E]"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
