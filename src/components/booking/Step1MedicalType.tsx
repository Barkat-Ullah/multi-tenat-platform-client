"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ClipboardList, RefreshCw } from "lucide-react";
import type { BookingService } from "@/redux/service/user/userBookingFlowApi";

interface Step1MedicalTypeProps {
  services: BookingService[];
  selectedServiceId: string | null;
  isLoading: boolean;
  isError: boolean;
  setSelectedServiceId: (id: string | null) => void;
  onRetry: () => void;
}

const ServicesSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading medical types">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex animate-pulse flex-row items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-slate-100 sm:h-24 sm:w-24" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-slate-100" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-7 w-24 rounded-full bg-slate-100" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading medical types...</span>
  </div>
);

export default function Step1MedicalType({
  services,
  selectedServiceId,
  isLoading,
  isError,
  setSelectedServiceId,
  onRetry,
}: Step1MedicalTypeProps) {
  return (
    <div className="w-full">
      <div className="mb-10 text-center md:mb-14">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] md:text-5xl">
          Select Your Medical Type
        </h1>
        <p className="mt-3 text-sm font-medium text-[#55697A] md:text-base">
          Professional driver medicals approved by DVLA. Fast, convenient, and compliant.
        </p>
      </div>

      {isLoading ? (
        <ServicesSkeleton />
      ) : isError ? (
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-10 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-red-200" />
          <h3 className="text-lg font-extrabold text-[#0F2E4A]">Failed to load medical types</h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Please try again to see available medical services.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0092B3]"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <ClipboardList className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-extrabold text-[#0F2E4A]">No medical services found</h3>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Medical services are not available right now.
          </p>
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`group flex cursor-pointer flex-row items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                  isSelected
                    ? "border-[#00B2D6] bg-[#E6FAFF]/30 shadow-md shadow-[#00B2D6]/5 ring-1 ring-[#00B2D6]"
                    : "border-slate-200/80 bg-white hover:border-[#00B2D6]/30 hover:shadow-sm"
                }`}
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-[#E6FAFF] sm:h-24 sm:w-24">
                  {service.files ? (
                    <Image
                      src={service.files}
                      alt={service.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-extrabold text-[#00B2D6]">
                      Medical
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <h3 className="w-full break-words text-sm font-extrabold leading-tight text-[#0F2E4A] transition-colors group-hover:text-[#00B2D6] sm:text-base">
                    {service.title}
                  </h3>
                  <p className="mb-3.5 mt-1 w-full truncate text-xs font-semibold text-[#55697A]">
                    {service.description || "Medical assessment service"}
                  </p>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedServiceId(service.id);
                    }}
                    className={`inline-flex items-center justify-between rounded-full py-0.5 pl-3.5 pr-1 text-xs font-bold transition-all duration-300 ${
                      isSelected
                        ? "bg-[#00B2D6] text-white hover:bg-[#0092B3]"
                        : "bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#00B2D6] hover:text-white"
                    }`}
                  >
                    <span className="mr-2 font-poppins">Book Now</span>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#00B2D6]">
                      <ArrowRight size={10} strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
