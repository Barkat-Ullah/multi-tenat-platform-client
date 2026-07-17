"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useGetProfileDataQuery } from "@/redux/service/profile/profileApi";
import {
  type DriverBooking,
  useCreateDriverBookingMutation,
  useGetBookingServiceDetailsQuery,
  useGetBookingServicesQuery,
  useGetBookingSlotsQuery,
} from "@/redux/service/user/userBookingFlowApi";
import { useGetCouncilNearestLocationsQuery } from "@/redux/service/locations/locationsApi";

import Step1MedicalType from "@/components/booking/Step1MedicalType";
import Step2YourLocation, {
  type BookingClinicDisplay,
} from "@/components/booking/Step2YourLocation";
import Step3SelectTimeSlot from "@/components/booking/Step3SelectTimeSlot";
import Step4YourDetails from "@/components/booking/Step4YourDetails";
import Step5Success from "@/components/booking/Step5Success";
import {
  clearBookingResume,
  getBookingDraft,
  saveBookingDraft,
} from "@/utils/bookingResume";

const DEFAULT_BOOKING_PRICE = 49.99;
const BOOKING_ALLOWED_ROLES = new Set(["USER", "ADMIN", "SUPERADMIN"]);

const canCompleteBooking = (role?: string | null) =>
  Boolean(role && BOOKING_ALLOWED_ROLES.has(role));

const getTypeSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const normalizeTypeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const getLocationId = (value: unknown) => {
  if (typeof value !== "object" || value === null) return null;

  const location = value as {
    id?: unknown;
    locationId?: unknown;
    location?: { id?: unknown } | null;
  };

  if (typeof location.id === "string") return location.id;
  if (typeof location.locationId === "string") return location.locationId;
  if (typeof location.location?.id === "string") return location.location.id;

  return null;
};

const getCouncilNearestLocations = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "object" || value === null) return [];

  const response = value as {
    locations?: unknown;
    nearestLocations?: unknown;
    clinics?: unknown;
    data?: unknown;
  };

  if (Array.isArray(response.locations)) return response.locations;
  if (Array.isArray(response.nearestLocations)) return response.nearestLocations;
  if (Array.isArray(response.clinics)) return response.clinics;
  if (Array.isArray(response.data)) return response.data;

  return [];
};

const formatDateParam = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isBeforeToday = (date: Date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value < startOfToday();
};

const parseSlotStartToIso = (date: Date, startTime: string) => {
  const match = startTime.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  const scheduled = new Date(date);

  if (!match) {
    scheduled.setHours(0, 0, 0, 0);
    return scheduled.toISOString();
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  scheduled.setHours(hours, minutes, 0, 0);
  return scheduled.toISOString();
};

const getDistanceInMiles = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const earthRadiusMiles = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
};

const normalizeClinicCoordinatesForCouncil = (
  lat: number,
  lng: number,
  councilCoords: { councilLat: number; councilLng: number } | null,
) => {
  if (!lat || !lng) return { lat, lng };

  // Some backend location rows arrive with west-UK longitudes as positive values.
  // Leaflet is correct with [lat, lng]; this only fixes clearly impossible UK eastings.
  if (lat >= 49 && lat <= 61 && lng > 1.8 && lng <= 8) {
    return { lat, lng: -lng };
  }

  if (!councilCoords) return { lat, lng };

  const currentDistance = getDistanceInMiles(
    councilCoords.councilLat,
    councilCoords.councilLng,
    lat,
    lng,
  );
  const mirroredLng = -lng;
  const mirroredDistance = getDistanceInMiles(
    councilCoords.councilLat,
    councilCoords.councilLng,
    lat,
    mirroredLng,
  );

  const looksMirroredAcrossGreenwich =
    councilCoords.councilLng < 0 &&
    lng > 0 &&
    Math.abs(councilCoords.councilLat - lat) < 1.5 &&
    currentDistance > 50 &&
    mirroredDistance + 50 < currentDistance;

  if (looksMirroredAcrossGreenwich) {
    return { lat, lng: mirroredLng };
  }

  return { lat, lng };
};

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FCFDFE]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#00B2D6]" />
        </div>
      }
    >
      <BookingFlowCoordinator />
    </Suspense>
  );
}

function BookingFlowCoordinator() {
  const searchParams = useSearchParams();
  const { accessToken, user: authUser } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [paymentMethod, setPaymentMethod] = useState<"Stripe" | "Paypal">("Stripe");
  const [createdBooking, setCreatedBooking] = useState<DriverBooking | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [councilCoords, setCouncilCoords] = useState<{ councilLat: number; councilLng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [resumeDraftLoaded, setResumeDraftLoaded] = useState(false);
  const [isResumingBooking, setIsResumingBooking] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const {
    data: servicesResponse,
    isLoading: isServicesLoading,
    isFetching: isServicesFetching,
    isError: isServicesError,
    refetch: refetchServices,
  } = useGetBookingServicesQuery({ page: 1, limit: 100 });

  const services = servicesResponse?.data || [];
  const selectedService = services.find((service) => service.id === selectedServiceId) || null;

  const {
    data: serviceDetailsResponse,
    isLoading: isServiceDetailsLoading,
    isFetching: isServiceDetailsFetching,
    isError: isServiceDetailsError,
    refetch: refetchServiceDetails,
  } = useGetBookingServiceDetailsQuery(selectedServiceId || "", {
    skip: !selectedServiceId,
  });

  const { data: councilNearestResponse } = useGetCouncilNearestLocationsQuery(
    councilCoords || { councilLat: 0, councilLng: 0 },
    { skip: !councilCoords || step < 2 },
  );

  const {
    data: slotsResponse,
    isLoading: isSlotsLoading,
    isFetching: isSlotsFetching,
    isError: isSlotsError,
    refetch: refetchSlots,
  } = useGetBookingSlotsQuery(
    {
      serviceId: selectedServiceId || "",
      clinicId: selectedClinicId || "",
      date: formatDateParam(selectedDate),
    },
    {
      skip: !selectedServiceId || !selectedClinicId || step !== 3,
    },
  );

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching,
  } = useGetProfileDataQuery(undefined, {
    skip: !accessToken || step < 4,
  });

  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateDriverBookingMutation();

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (!typeParam || selectedServiceId || services.length === 0) return;

    const normalizedTypeParam = typeParam.toLowerCase();
    const compactTypeParam = normalizeTypeText(typeParam);
    const matched = services.find((service) => {
      const slug = getTypeSlug(service.title);
      const compactTitle = normalizeTypeText(service.title);
      return (
        slug === normalizedTypeParam ||
        slug.includes(normalizedTypeParam) ||
        compactTitle.includes(compactTypeParam) ||
        compactTypeParam.includes(compactTitle)
      );
    });

    if (matched) {
      setSelectedServiceId(matched.id);
      setStep(2);
    }
  }, [searchParams, selectedServiceId, services]);

  useEffect(() => {
    const councilLatParam = searchParams.get("councilLat");
    const councilLngParam = searchParams.get("councilLng");

    if (!councilLatParam || !councilLngParam) return;

    const councilLat = Number(councilLatParam);
    const councilLng = Number(councilLngParam);

    if (!Number.isFinite(councilLat) || !Number.isFinite(councilLng)) return;

    setCouncilCoords({ councilLat, councilLng });
    setUserCoords({ lat: councilLat, lng: councilLng });
    setVisibleCount((count) => Math.max(count, 5));
  }, [searchParams]);

  const councilLocationOrder = useMemo(() => {
    const order = new Map<string, number>();
    if (!councilCoords) return order;

    getCouncilNearestLocations(councilNearestResponse?.data).forEach((location, index) => {
      const locationId = getLocationId(location);
      if (locationId) {
        order.set(locationId, index);
      }
    });
    return order;
  }, [councilCoords, councilNearestResponse?.data]);

  const clinics = useMemo<BookingClinicDisplay[]>(() => {
    const query = searchQuery.toLowerCase().trim();
    const serviceClinics = serviceDetailsResponse?.data?.clinics || [];

    const mappedClinics = serviceClinics
      .filter((clinic) => {
        const locationName = clinic.location?.locationName || "";
        if (!query) return true;
        return (
          clinic.fullName.toLowerCase().includes(query) ||
          locationName.toLowerCase().includes(query) ||
          (clinic.email || "").toLowerCase().includes(query)
        );
      })
      .map((clinic) => {
        const locationName = clinic.location?.locationName || "N/A";
        const rawLat = clinic.location?.lat ?? 0;
        const rawLng = clinic.location?.lng ?? 0;
        const { lat, lng } = normalizeClinicCoordinatesForCouncil(
          rawLat,
          rawLng,
          councilCoords,
        );
        const distance =
          userCoords && lat && lng
            ? getDistanceInMiles(userCoords.lat, userCoords.lng, lat, lng)
            : null;

        return {
          ...clinic,
          name: clinic.fullName,
          address: locationName,
          lat,
          lng,
          distance,
          distanceStr: distance === null ? "N/A" : `${distance.toFixed(1)} mi`,
          earliestDate: "Select date",
          parkingStr: clinic.isParking ? "Yes" : "No",
        };
      });

    if (councilLocationOrder.size > 0) {
      mappedClinics.sort((a, b) => {
        const firstOrder = a.location?.id ? councilLocationOrder.get(a.location.id) : undefined;
        const secondOrder = b.location?.id ? councilLocationOrder.get(b.location.id) : undefined;

        if (firstOrder !== undefined && secondOrder !== undefined) {
          return (
            firstOrder - secondOrder ||
            (a.distance ?? Number.MAX_VALUE) - (b.distance ?? Number.MAX_VALUE)
          );
        }

        if (firstOrder !== undefined) return -1;
        if (secondOrder !== undefined) return 1;

        return (a.distance ?? Number.MAX_VALUE) - (b.distance ?? Number.MAX_VALUE);
      });
    } else if (userCoords) {
      mappedClinics.sort((a, b) => (a.distance ?? Number.MAX_VALUE) - (b.distance ?? Number.MAX_VALUE));
    }

    return mappedClinics;
  }, [councilCoords, councilLocationOrder, searchQuery, serviceDetailsResponse?.data?.clinics, userCoords]);

  const selectedClinic =
    clinics.find((clinic) => clinic.id === selectedClinicId) || null;
  const slots = slotsResponse?.data?.slots || [];
  const availableSlots = useMemo(
    () =>
      slots.filter(
        (slot) =>
          !slot.isBooked &&
          slot.status.toLowerCase() === "active" &&
          slot.booked < slot.capacity,
      ),
    [slots],
  );
  const selectedSlot =
    availableSlots.find((slot) => slot.id === selectedSlotId) || null;

  useEffect(() => {
    if (
      selectedSlotId &&
      slotsResponse &&
      !isSlotsLoading &&
      !isSlotsFetching &&
      !availableSlots.some((slot) => slot.id === selectedSlotId)
    ) {
      setSelectedSlotId(null);
    }
  }, [
    availableSlots,
    isSlotsFetching,
    isSlotsLoading,
    selectedSlotId,
    slotsResponse,
  ]);

  useEffect(() => {
    if (
      resumeDraftLoaded ||
      searchParams.get("resume") !== "1" ||
      !accessToken ||
      !authUser
    ) {
      return;
    }

    setResumeDraftLoaded(true);

    if (!canCompleteBooking(authUser.role)) {
      clearBookingResume();
      toast.error("Only drivers, admins, and super admins can complete a medical booking.");
      return;
    }

    const draft = getBookingDraft();
    if (!draft) {
      toast.error("Your saved booking could not be restored.");
      return;
    }

    const restoredDate = new Date(`${draft.date}T00:00:00`);
    if (Number.isNaN(restoredDate.getTime())) {
      clearBookingResume();
      toast.error("Your saved booking date is invalid.");
      return;
    }

    setSelectedServiceId(draft.serviceId);
    setSelectedClinicId(draft.clinicId);
    const safeDate = isBeforeToday(restoredDate) ? startOfToday() : restoredDate;
    setSelectedDate(safeDate);
    setCalendarMonth(
      new Date(safeDate.getFullYear(), safeDate.getMonth(), 1),
    );
    setSelectedSlotId(isBeforeToday(restoredDate) ? null : draft.slotId);
    setStep(3);
    setIsResumingBooking(true);
  }, [
    accessToken,
    authUser,
    resumeDraftLoaded,
    searchParams,
  ]);

  useEffect(() => {
    if (
      !isResumingBooking ||
      !slotsResponse ||
      isSlotsLoading ||
      isSlotsFetching
    ) {
      return;
    }

    if (selectedSlot) {
      clearBookingResume();
      setIsResumingBooking(false);
      setStep(4);
      toast.success("Your booking selections have been restored.");
      return;
    }

    clearBookingResume();
    setIsResumingBooking(false);
    setSelectedSlotId(null);
    toast.error(
      "Your previously selected time slot is no longer available. Please choose another slot.",
    );
  }, [
    isResumingBooking,
    isSlotsFetching,
    isSlotsLoading,
    selectedSlot,
    slotsResponse,
  ]);

  useEffect(() => {
    if (!showAuthPrompt) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearBookingResume();
        setShowAuthPrompt(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showAuthPrompt]);

  const handleSelectService = (id: string | null) => {
    setSelectedServiceId(id);
    setSelectedClinicId(null);
    setSelectedSlotId(null);
    setSearchQuery("");
    setVisibleCount(3);
    if (id) {
      setStep(2);
    }
  };

  const handleBookClinic = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setSelectedSlotId(null);
    setStep(3);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCouncilCoords(null);
        setVisibleCount((count) => Math.max(count, 5));
        setIsLocating(false);
        toast.success("Showing nearest clinics around your current location.");
      },
      () => {
        setLocationError("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleResetLocation = () => {
    setUserCoords(null);
    setCouncilCoords(null);
    setLocationError(null);
  };

  const handleContinueToDetails = (slotId = selectedSlotId) => {
    if (!slotId) {
      toast.error("Please select a time slot to continue.");
      return;
    }

    if (!accessToken || !authUser) {
      if (!selectedServiceId || !selectedClinicId) {
        toast.error("Please complete your booking selections.");
        return;
      }

      try {
        saveBookingDraft({
          serviceId: selectedServiceId,
          clinicId: selectedClinicId,
          date: formatDateParam(selectedDate),
          slotId,
        });
      } catch {
        toast.error("Unable to save your booking selections.");
        return;
      }

      setShowAuthPrompt(true);
      return;
    }

    if (!canCompleteBooking(authUser.role)) {
      toast.error("Only drivers, admins, and super admins can complete a medical booking.");
      return;
    }

    setStep(4);
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    handleContinueToDetails(slotId);
  };

  const handleSubmitBooking = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!accessToken || !authUser) {
      toast.error("Please log in before booking.");
      window.location.href = "/login?booking=1";
      return;
    }

    if (!canCompleteBooking(authUser.role)) {
      toast.error("Only drivers, admins, and super admins can complete a medical booking.");
      return;
    }

    if (!selectedServiceId || !selectedClinicId || !selectedSlot) {
      toast.error("Please complete service, clinic, and slot selection.");
      return;
    }

    try {
      const response = await createBooking({
        clinicId: selectedClinicId,
        serviceId: selectedServiceId,
        timeSlotId: selectedSlot.id,
        scheduledAt: parseSlotStartToIso(selectedDate, selectedSlot.startTime),
        paymentType: paymentMethod,
        price: DEFAULT_BOOKING_PRICE,
      }).unwrap();

      setCreatedBooking(response.data.booking);
      toast.success(response.message || "Booking created successfully.");

      if (response.data.paymentUrl) {
        try {
          sessionStorage.setItem(
            "latestBooking",
            JSON.stringify({
              booking: response.data.booking,
              payment: response.data.payment,
            }),
          );
        } catch {
          // Ignore storage failures and continue to payment.
        }
        window.location.href = response.data.paymentUrl;
        return;
      }

      setStep(5);
    } catch (error) {
      const message =
        (error as { data?: { message?: string }; message?: string })?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to create booking.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFDFE] px-4 py-12 poppins sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Step1MedicalType
                services={services}
                selectedServiceId={selectedServiceId}
                isLoading={isServicesLoading || isServicesFetching}
                isError={isServicesError}
                setSelectedServiceId={handleSelectService}
                onRetry={refetchServices}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Step2YourLocation
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedClinicId={selectedClinicId}
                setSelectedClinicId={setSelectedClinicId}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                clinics={clinics}
                hasUserLocation={Boolean(userCoords)}
                isLocating={isLocating}
                locationError={locationError}
                isLoading={isServiceDetailsLoading || isServiceDetailsFetching}
                isError={isServiceDetailsError}
                onUseMyLocation={handleUseMyLocation}
                onResetLocation={handleResetLocation}
                onRetry={refetchServiceDetails}
                onBookClinic={handleBookClinic}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Step3SelectTimeSlot
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedSlotId={selectedSlotId}
                setSelectedSlotId={setSelectedSlotId}
                slots={availableSlots}
                isAvailable={
                  Boolean(slotsResponse?.data?.isAvailable) &&
                  availableSlots.length > 0
                }
                isLoading={isSlotsLoading || isSlotsFetching}
                isError={isSlotsError}
                calendarMonth={calendarMonth}
                setCalendarMonth={setCalendarMonth}
                onBack={() => setStep(2)}
                onSelectSlot={handleSelectSlot}
                onRetry={refetchSlots}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step4YourDetails
                selectedService={selectedService}
                selectedClinic={selectedClinic}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                profile={profileResponse?.data || null}
                isProfileLoading={isProfileLoading || isProfileFetching}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                price={DEFAULT_BOOKING_PRICE}
                isSubmitting={isCreatingBooking}
                onBack={() => setStep(3)}
                onSubmit={handleSubmitBooking}
              />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Step5Success booking={createdBooking} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showAuthPrompt && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-auth-title"
        >
          <button
            type="button"
            aria-label="Close authentication prompt"
            className="absolute inset-0 bg-[#0F2E4A]/45 backdrop-blur-[2px]"
            onClick={() => {
              clearBookingResume();
              setShowAuthPrompt(false);
            }}
          />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-[0_24px_70px_rgba(15,46,74,0.2)] sm:p-9">
            <button
              type="button"
              onClick={() => {
                clearBookingResume();
                setShowAuthPrompt(false);
              }}
              aria-label="Close"
              title="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#0F2E4A]"
            >
              <X size={17} />
            </button>

            <h2
              id="booking-auth-title"
              className="pr-8 text-2xl font-extrabold text-[#0F2E4A]"
            >
              Continue Your Booking
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm font-semibold leading-relaxed text-[#55697A]">
              Log in to continue with your selected appointment, or create a Driver account.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/login?booking=1"
                className="rounded-full bg-[#00B2D6] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0092B3]"
              >
                Log In
              </Link>
              <Link
                href="/register?booking=1"
                className="rounded-full border border-[#00B2D6] px-6 py-3.5 text-sm font-bold text-[#00B2D6] transition-colors hover:bg-[#E6FAFF]"
              >
                Register as Driver
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
