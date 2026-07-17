"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  type ClinicAvailability,
  type ClinicTimeSlot,
  useCreateClinicScheduleMutation,
  useGetClinicAvailabilityByMonthQuery,
  useGetClinicTimeSlotsQuery,
} from "@/redux/service/clinic/clinicScheduleApi";
import {
  useGetBookingSlotsQuery,
  useLazyGetBookingSlotsQuery,
} from "@/redux/service/user/userBookingFlowApi";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const TimeSlotsSkeleton = () => (
  <div
    className="space-y-3.5"
    role="status"
    aria-label="Loading time slots"
  >
    {Array.from({ length: 7 }, (_, index) => (
      <div
        key={index}
        className="flex h-[58px] animate-pulse items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-5"
      >
        <div className="space-y-2">
          <div
            className={`h-2.5 rounded-full bg-slate-200 ${
              index % 3 === 0
                ? "w-36"
                : index % 3 === 1
                  ? "w-40"
                  : "w-32"
            }`}
          />
          <div className="h-1.5 w-16 rounded-full bg-slate-100" />
        </div>
        <div className="h-5 w-14 rounded-lg bg-slate-200" />
      </div>
    ))}
    <span className="sr-only">Loading time slots...</span>
  </div>
);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;

  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };

  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown) => (typeof value === "string" ? value : undefined);
const asNumber = (value: unknown) => (typeof value === "number" ? value : undefined);
const asBoolean = (value: unknown) => (typeof value === "boolean" ? value : undefined);

const normalizeTimeSlot = (
  value: UnknownRecord,
  parent?: UnknownRecord,
): ClinicTimeSlot | null => {
  const startTime = asString(value.startTime);
  const endTime = asString(value.endTime);
  const date =
    asString(value.date) ||
    asString(value.slotDate) ||
    asString(parent?.date) ||
    asString(parent?.slotDate);

  if (!startTime || !endTime) return null;

  return {
    id:
      asString(value.id) ||
      `${date || "slot"}-${startTime}-${endTime}`,
    availabilityId:
      asString(value.availabilityId) ||
      asString(parent?.availabilityId) ||
      asString(parent?.id),
    clinicId: asString(value.clinicId) || asString(parent?.clinicId),
    date,
    duration: asNumber(value.duration),
    startTime,
    endTime,
    capacity: asNumber(value.capacity),
    booked: asNumber(value.booked),
    isBooked: asBoolean(value.isBooked),
    availabilityIsActive:
      asBoolean(value.availabilityIsActive) ?? asBoolean(parent?.isActive),
    status: asString(value.status) || "Active",
  };
};

const collectTimeSlots = (
  value: unknown,
  parent?: UnknownRecord,
): ClinicTimeSlot[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectTimeSlots(item, parent));
  }

  if (!isRecord(value)) return [];

  const normalizedSlot = normalizeTimeSlot(value, parent);
  if (normalizedSlot) return [normalizedSlot];

  const nestedParent =
    "slotDate" in value || "date" in value || "clinicId" in value || "isActive" in value
      ? value
      : parent;

  return ["timeSlots", "slots", "data", "items", "result"].flatMap((key) =>
    collectTimeSlots(value[key], nestedParent),
  );
};

const getAvailabilities = (
  response?: unknown,
): ClinicAvailability[] => {
  if (!isRecord(response)) return [];

  const data = response.data;
  if (!Array.isArray(data)) return [];

  return data.filter(
    (item): item is ClinicAvailability => "slotDate" in item,
  );
};

const getTimeSlots = (response?: unknown): ClinicTimeSlot[] =>
  collectTimeSlots(response);

const timeToMinutes = (time: string) => {
  const [clock, meridiem] = time.trim().split(/\s+/);
  const [rawHours, minutes] = clock.split(":").map(Number);
  let hours = rawHours;

  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;

  return hours * 60 + minutes;
};

const minutesToTime = (value: number) =>
  `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;

const buildGeneratedSlots = ({
  clinicId,
  date,
  startTime,
  endTime,
}: {
  clinicId?: string;
  date: string;
  startTime: string;
  endTime: string;
}): ClinicTimeSlot[] => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const duration = 30;

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return [];

  const slots: ClinicTimeSlot[] = [];
  for (let current = start; current < end; current += duration) {
    const next = Math.min(current + duration, end);
    const slotStart = minutesToTime(current);
    const slotEnd = minutesToTime(next);

    slots.push({
      id: `created-${clinicId || "clinic"}-${date}-${slotStart}-${slotEnd}`,
      clinicId,
      date,
      startTime: slotStart,
      endTime: slotEnd,
      duration: next - current,
      booked: 0,
      isBooked: false,
      availabilityIsActive: true,
      status: "Active",
    });
  }

  return slots;
};

interface CreateScheduleViewProps {
  clinicId?: string;
  clinicName?: string;
  serviceId?: string;
  requiresClinicSelection?: boolean;
}

export default function CreateScheduleView({
  clinicId,
  clinicName,
  serviceId,
  requiresClinicSelection = false,
}: CreateScheduleViewProps) {
  const today = dayjs().startOf("day");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(() =>
    dayjs().startOf("day"),
  );
  const [visibleMonth, setVisibleMonth] = useState<Dayjs>(() =>
    dayjs().startOf("month"),
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [createdSlots, setCreatedSlots] = useState<ClinicTimeSlot[]>([]);
  const [monthDateSlots, setMonthDateSlots] = useState<ClinicTimeSlot[]>([]);
  const [isFetchingMonthDateSlots, setIsFetchingMonthDateSlots] = useState(false);

  const month = visibleMonth.format("YYYY-MM");
  const shouldSkipScheduleQueries = requiresClinicSelection && !clinicId;
  const {
    data: availabilityResponse,
    isFetching: isFetchingAvailability,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
  } = useGetClinicAvailabilityByMonthQuery(
    { month, clinicId },
    { skip: shouldSkipScheduleQueries },
  );
  const {
    data: timeSlotResponse,
    isLoading: isLoadingSlots,
    isFetching: isFetchingSlots,
    isError: isTimeSlotError,
    refetch: refetchTimeSlots,
  } = useGetClinicTimeSlotsQuery(
    clinicId ? { clinicId } : undefined,
    { skip: shouldSkipScheduleQueries },
  );
  const selectedDateParam = selectedDate.format("YYYY-MM-DD");
  const {
    data: bookingSlotsResponse,
    isFetching: isFetchingBookingSlots,
  } = useGetBookingSlotsQuery(
    {
      serviceId: serviceId || "",
      clinicId: clinicId || "",
      date: selectedDateParam,
    },
    {
      skip: !serviceId || !clinicId || shouldSkipScheduleQueries,
    },
  );
  const [createClinicSchedule, { isLoading: isCreatingSchedule }] =
    useCreateClinicScheduleMutation();
  const [loadBookingSlotsForDate] = useLazyGetBookingSlotsQuery();

  useEffect(() => {
    setCreatedSlots([]);
    setMonthDateSlots([]);
  }, [clinicId]);

  useEffect(() => {
    if (!clinicId || !serviceId || shouldSkipScheduleQueries) {
      setMonthDateSlots([]);
      return;
    }

    let isCancelled = false;
    const dates = Array.from({ length: visibleMonth.daysInMonth() }, (_, index) =>
      visibleMonth.date(index + 1).format("YYYY-MM-DD"),
    );

    setIsFetchingMonthDateSlots(true);

    Promise.all(
      dates.map(async (date) => {
        try {
          const response = await loadBookingSlotsForDate(
            { serviceId, clinicId, date },
            true,
          ).unwrap();

          return response.data.slots.map((slot) => ({
            ...slot,
            clinicId,
            date: response.data.date || date,
          }));
        } catch {
          return [];
        }
      }),
    )
      .then((slotsByDate) => {
        if (!isCancelled) {
          setMonthDateSlots(slotsByDate.flat());
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsFetchingMonthDateSlots(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [
    clinicId,
    loadBookingSlotsForDate,
    serviceId,
    shouldSkipScheduleQueries,
    visibleMonth,
  ]);

  const monthSlots = useMemo(
    () => {
      const fetchedSlots = getTimeSlots(timeSlotResponse);
      const dateSpecificSlots =
        bookingSlotsResponse?.data?.slots.map((slot) => ({
          ...slot,
          clinicId,
          date: bookingSlotsResponse.data.date || selectedDateParam,
        })) || [];
      const slotMap = new Map<string, ClinicTimeSlot>();

      [
        ...fetchedSlots,
        ...monthDateSlots,
        ...dateSpecificSlots,
        ...createdSlots,
      ].forEach((slot) => {
        const key = slot.id || `${slot.date}-${slot.startTime}-${slot.endTime}`;
        slotMap.set(key, slot);
      });

      return Array.from(slotMap.values());
    },
    [
      bookingSlotsResponse,
      clinicId,
      createdSlots,
      monthDateSlots,
      selectedDateParam,
      timeSlotResponse,
    ],
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
  const selectedDateIsPast = selectedDate.isBefore(today, "day");
  const isCurrentMonth = visibleMonth.isSame(today, "month");
  const selectedDateHasCreatedSlots = createdSlots.some(
    (slot) => slot.date && dayjs(slot.date).isSame(selectedDate, "day"),
  );
  const selectedDateHasSchedule =
    Boolean(selectedAvailability) ||
    selectedMonthAvailability?.isActive === true ||
    selectedDateHasCreatedSlots;
  const isScheduleDataLoading =
    isLoadingSlots ||
    isFetchingSlots ||
    isFetchingAvailability ||
    isFetchingMonthDateSlots ||
    isFetchingBookingSlots;
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
    if (nextMonth.isBefore(today.startOf("month"), "month")) return;

    setVisibleMonth(nextMonth);
    setSelectedDate(nextMonth.isSame(today, "month") ? today : nextMonth);
  };

  const handleGenerateSlots = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedDateIsPast) {
      toast.error("Schedules cannot be created for past dates.");
      return;
    }

    if (requiresClinicSelection && !clinicId) {
      toast.error("Please select a clinic before creating slots.");
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
      const slotDate = selectedDate.format("YYYY-MM-DD");
      const response = await createClinicSchedule({
        ...(clinicId ? { clinicId } : {}),
        slotDate,
        startTime,
        endTime,
      }).unwrap();
      const responseSlots = getTimeSlots(response);
      const nextSlots =
        responseSlots.length > 0
          ? responseSlots
          : buildGeneratedSlots({
              clinicId,
              date: slotDate,
              startTime,
              endTime,
            });

      setCreatedSlots((currentSlots) => {
        const slotMap = new Map<string, ClinicTimeSlot>();
        [...currentSlots, ...nextSlots].forEach((slot) => {
          const key = slot.id || `${slot.date}-${slot.startTime}-${slot.endTime}`;
          slotMap.set(key, slot);
        });
        return Array.from(slotMap.values());
      });
      void refetchTimeSlots();
      void refetchAvailability();
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
      {clinicName && (
        <p className="-mt-4 text-sm font-semibold text-slate-500">
          Creating slots for <span className="text-[#0F2E4A]">{clinicName}</span>
        </p>
      )}

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
                  disabled={isCurrentMonth}
                  aria-label="Previous month"
                  title="Previous month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6] disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-300"
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
                  const isPast = date.isBefore(today, "day");
                  const dayAvailability = monthAvailability.find(
                    (item) => item.date === date.format("YYYY-MM-DD"),
                  );
                  const hasSlotsForDate = monthSlots.some(
                    (slot) => slot.date && dayjs(slot.date).isSame(date, "day"),
                  );
                  const isAvailable =
                    dayAvailability?.isActive === true || hasSlotsForDate;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      disabled={isPast}
                      aria-label={
                        isPast
                          ? `${date.format("DD MMMM YYYY")} unavailable`
                          : date.format("DD MMMM YYYY")
                      }
                      className={`relative flex h-10 w-full items-center justify-center rounded-xl border text-xs font-bold transition-colors sm:h-11 sm:text-sm ${
                        isPast
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                          : isSelected
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
                  shouldSkipScheduleQueries ||
                  isScheduleDataLoading ||
                  isScheduleDataUnavailable ||
                  selectedDateIsPast ||
                  selectedDateHasSchedule
                }
                className="rounded-full bg-[#00B2D6] px-7 py-3 text-xs font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 transition-colors hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {isCreatingSchedule
                  ? "Generating..."
                  : shouldSkipScheduleQueries
                    ? "Select Clinic"
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
              <TimeSlotsSkeleton />
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
