"use client";

import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { ProfileData } from "@/redux/service/profile/profileApi";
import type {
  BookingService,
  BookingSlot,
} from "@/redux/service/user/userBookingFlowApi";
import type { BookingClinicDisplay } from "./Step2YourLocation";

interface Step4YourDetailsProps {
  selectedService: BookingService | null;
  selectedClinic: BookingClinicDisplay | null;
  selectedDate: Date;
  selectedSlot: BookingSlot | null;
  profile: ProfileData | null;
  isProfileLoading: boolean;
  paymentMethod: "Stripe" | "Paypal";
  setPaymentMethod: (method: "Stripe" | "Paypal") => void;
  price: number;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

const DetailField = ({
  label,
  value,
  isLoading,
}: {
  label: string;
  value?: string | null;
  isLoading?: boolean;
}) => (
  <div>
    <label className="mb-2 block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
      {label}
    </label>
    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-[#0F2E4A]">
      {isLoading ? (
        <span className="block h-5 w-40 animate-pulse rounded bg-slate-200" />
      ) : (
        value || "N/A"
      )}
    </div>
  </div>
);

export default function Step4YourDetails({
  selectedService,
  selectedClinic,
  selectedDate,
  selectedSlot,
  profile,
  isProfileLoading,
  paymentMethod,
  setPaymentMethod,
  price,
  isSubmitting,
  onBack,
  onSubmit,
}: Step4YourDetailsProps) {
  return (
    <div className="mx-auto max-w-3xl pt-4 font-poppins">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-400 transition-colors hover:text-[#00B2D6] sm:text-sm"
      >
        <ArrowLeft size={16} />
        <span>Back to Time Slot</span>
      </button>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-6 text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
            Clinic Information
          </h3>

          <div className="space-y-5">
            <div>
              <span className="block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                Medical Type
              </span>
              <p className="mt-1 text-sm font-medium text-[#55697A] sm:text-base">
                {selectedService?.title || "N/A"}
              </p>
            </div>

            <div>
              <span className="block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                Clinic
              </span>
              <p className="mt-1 text-sm font-medium text-[#55697A] sm:text-base">
                {selectedClinic?.fullName || "N/A"}
              </p>
            </div>

            <div>
              <span className="block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                Location
              </span>
              <p className="mt-1 text-sm font-medium text-[#55697A] sm:text-base">
                {selectedClinic?.address || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <span className="block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                  Date
                </span>
                <p className="mt-1 text-sm font-medium text-[#55697A] sm:text-base">
                  {selectedDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                  Time
                </span>
                <p className="mt-1 text-sm font-medium text-[#55697A] sm:text-base">
                  {selectedSlot
                    ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
            Your Details
          </h3>

          <DetailField
            label="Name"
            value={profile?.fullName || profile?.profile?.name}
            isLoading={isProfileLoading}
          />
          <DetailField
            label="Email"
            value={profile?.email}
            isLoading={isProfileLoading}
          />
          <DetailField
            label="Date of birth"
            value={profile?.dob || "N/A"}
            isLoading={isProfileLoading}
          />
          <DetailField
            label="Phone Number"
            value={profile?.phoneNumber || profile?.profile?.phone}
            isLoading={isProfileLoading}
          />

          <div className="pt-2">
            <label className="mb-4 block text-sm font-extrabold text-[#0F2E4A] sm:text-base">
              Select Payment Method
            </label>
            <div className="flex flex-row items-center gap-8">
              <label className="flex cursor-pointer select-none items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Stripe"}
                  onChange={() => setPaymentMethod("Stripe")}
                  className="sr-only"
                />
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  paymentMethod === "Stripe" ? "border-[#00B2D6]" : "border-slate-300"
                }`}>
                  {paymentMethod === "Stripe" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00B2D6]" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 items-center justify-center rounded-[6px] bg-black px-2.5 py-1 font-sans text-[10px] font-extrabold lowercase tracking-normal text-white">
                    stripe
                  </div>
                  <span className="text-sm font-extrabold text-[#0F2E4A] sm:text-base">Stripe</span>
                </div>
              </label>

              <label className="flex disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer select-none items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "Paypal"}
                  onChange={() => setPaymentMethod("Paypal")}
                  className="sr-only"
                />
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  paymentMethod === "Paypal" ? "border-[#00B2D6]" : "border-slate-300"
                }`}>
                  {paymentMethod === "Paypal" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#00B2D6]" />
                  )}
                </div>
                <span className="text-sm font-extrabold text-[#0F2E4A] sm:text-base">Paypal</span>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isProfileLoading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#00B2D6] py-4 text-base font-bold text-white shadow-md shadow-[#00B2D6]/10 transition-all duration-200 hover:scale-[1.01] hover:bg-[#0092B3] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          Continue £{price.toFixed(2)}
        </button>
      </form>
    </div>
  );
}
