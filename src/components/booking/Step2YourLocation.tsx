"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Calendar,
  Car,
  ArrowRight,
  RefreshCw,
  Navigation,
  Loader2,
  X,
} from "lucide-react";
import type { BookingServiceClinic } from "@/redux/service/user/userBookingFlowApi";

const BookingMap = dynamic(() => import("./BookingMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[350px] items-center justify-center rounded-2xl bg-slate-100 text-slate-400 md:h-[500px]">
      Loading interactive map...
    </div>
  ),
});

export type BookingClinicDisplay = BookingServiceClinic & {
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number | null;
  distanceStr: string;
  earliestDate: string;
  parkingStr: string;
};

interface Step2YourLocationProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedClinicId: string | null;
  setSelectedClinicId: (id: string | null) => void;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  clinics: BookingClinicDisplay[];
  hasUserLocation: boolean;
  isLocating: boolean;
  locationError: string | null;
  isLoading: boolean;
  isError: boolean;
  onUseMyLocation: () => void;
  onResetLocation: () => void;
  onRetry: () => void;
  onBookClinic: (clinicId: string) => void;
}

const ClinicsSkeleton = () => (
  <div className="space-y-2.5" role="status" aria-label="Loading clinics">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex animate-pulse flex-col gap-3 rounded-2xl border border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="h-4 w-2/3 rounded bg-slate-100" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-7 rounded bg-slate-100" />
            <div className="h-7 rounded bg-slate-100" />
            <div className="h-7 rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-full bg-slate-100" />
      </div>
    ))}
    <span className="sr-only">Loading clinics...</span>
  </div>
);

export default function Step2YourLocation({
  searchQuery,
  setSearchQuery,
  selectedClinicId,
  setSelectedClinicId,
  visibleCount,
  setVisibleCount,
  clinics,
  hasUserLocation,
  isLocating,
  locationError,
  isLoading,
  isError,
  onUseMyLocation,
  onResetLocation,
  onRetry,
  onBookClinic,
}: Step2YourLocationProps) {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-3xl">
        Your Location
      </h2>

      <div className="mb-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full flex-1 shadow-sm">
            <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Enter Town"
              className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm font-semibold text-[#0F2E4A] placeholder-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 sm:text-base"
            />
          </div>

          <button
            type="button"
            onClick={onUseMyLocation}
            disabled={isLocating || isLoading}
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E6F8FC] px-5 py-3.5 text-sm font-extrabold text-[#00B2D6] transition-colors hover:bg-[#D5F3FA] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLocating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            <span>{isLocating ? "Locating..." : "Use My Location"}</span>
          </button>
        </div>

        {hasUserLocation && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <span>Showing nearest clinics first</span>
            <button
              type="button"
              onClick={onResetLocation}
              className="rounded-full p-0.5 text-emerald-600 hover:bg-emerald-100"
              aria-label="Reset current location sorting"
              title="Reset current location sorting"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {locationError && (
          <p className="mt-2 text-xs font-bold text-red-500">{locationError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="h-[400px] lg:col-span-4 lg:h-[540px]">
          {isLoading ? (
            <div className="h-full animate-pulse rounded-2xl bg-slate-100" />
          ) : (
            <BookingMap
              clinics={clinics}
              selectedClinicId={selectedClinicId}
              onSelectClinic={(id) => setSelectedClinicId(id)}
            />
          )}
        </div>

        <div className="flex h-[400px] flex-col lg:col-span-8 lg:h-[540px]">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:p-4">
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto overflow-x-hidden pr-1 lg:overflow-visible lg:pr-0">
              {isLoading ? (
                <ClinicsSkeleton />
              ) : isError ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MapPin className="mb-3 h-10 w-10 text-red-200" />
                  <h4 className="text-sm font-extrabold text-[#0F2E4A] sm:text-base">Failed to load clinics</h4>
                  <p className="mt-1 text-xs font-medium text-[#55697A]">
                    Please try again to see clinics for this service.
                  </p>
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#0092B3]"
                  >
                    <RefreshCw size={14} />
                    Retry
                  </button>
                </div>
              ) : clinics.length === 0 ? (
                <div className="py-10 text-center">
                  <MapPin className="mx-auto mb-2 h-10 w-10 text-slate-300" />
                  <h4 className="text-sm font-extrabold text-[#0F2E4A] sm:text-base">No clinics found</h4>
                  <p className="mt-1 text-xs font-medium text-[#55697A]">
                    Try another town or postcode search.
                  </p>
                </div>
              ) : (
                clinics.slice(0, visibleCount).map((clinic, index) => {
                  const isSelected = selectedClinicId === clinic.id;
                  return (
                    <div
                      key={clinic.id}
                      onClick={() => onBookClinic(clinic.id)}
                      className={`flex cursor-pointer flex-col justify-between gap-2 rounded-xl py-2 transition-all duration-200 sm:flex-row sm:items-center ${
                        index === 0 ? "pt-0" : ""
                      } ${isSelected ? "bg-[#E6FAFF]/10 px-2" : "px-2 hover:bg-slate-50/50"}`}
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00B2D6]">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />
                          <span>{clinic.status || "Available"}</span>
                        </div>

                        <h4 className="line-clamp-1 pr-2 text-sm font-extrabold leading-tight text-[#0F2E4A]">
                          {clinic.fullName}
                        </h4>

                        <p className="line-clamp-1 text-[11px] font-semibold text-slate-500">
                          {clinic.address}
                        </p>

                        <div className="grid grid-cols-3 gap-2 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="shrink-0 text-[#A3B3C2]" />
                            <div className="flex min-w-0 flex-col">
                              <span className="text-[9px] font-semibold leading-tight text-slate-400">Distance</span>
                              <span className="truncate text-[11px] font-extrabold leading-tight text-[#0F2E4A]">{clinic.distanceStr}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="shrink-0 text-[#A3B3C2]" />
                            <div className="flex min-w-0 flex-col">
                              <span className="text-[9px] font-semibold leading-tight text-slate-400">Earliest Appointment</span>
                              <span className="truncate text-[11px] font-extrabold leading-tight text-[#0F2E4A]">{clinic.earliestDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Car size={13} className="shrink-0 text-[#A3B3C2]" />
                            <div className="flex min-w-0 flex-col">
                              <span className="text-[9px] font-semibold leading-tight text-slate-400">Car Parking</span>
                              <span className="truncate text-[11px] font-extrabold leading-tight text-[#0F2E4A]">{clinic.parkingStr}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onBookClinic(clinic.id);
                        }}
                        className="flex shrink-0 items-center justify-between gap-2 rounded-full bg-[#00B2D6] py-1.5 pl-4 pr-1.5 font-poppins text-xs font-extrabold text-white shadow-md shadow-[#00B2D6]/10 transition-all duration-300 hover:scale-[1.02] hover:bg-[#0092B3]"
                      >
                        <span>Book Now</span>
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#00B2D6]">
                          <ArrowRight size={12} strokeWidth={3} />
                        </div>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {clinics.length > visibleCount && !isLoading && !isError && (
              <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="text-xs font-extrabold text-[#00B2D6] transition-all hover:text-[#0092B3] hover:underline sm:text-sm"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
