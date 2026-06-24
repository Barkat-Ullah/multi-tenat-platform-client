"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface Step4YourDetailsProps {
  selectedType: string | null;
  selectedClinic: any;
  selectedDate: Date;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  paymentMethod: "stripe" | "paypal";
  setPaymentMethod: (method: "stripe" | "paypal") => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Step4YourDetails({
  selectedType,
  selectedClinic,
  selectedDate,
  formData,
  handleInputChange,
  paymentMethod,
  setPaymentMethod,
  onBack,
  onSubmit
}: Step4YourDetailsProps) {
  return (
    <div className="max-w-3xl mx-auto font-poppins pt-4">
      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-400 hover:text-[#00B2D6] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        <span>Back to Time Slot</span>
      </button>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Card 1: Clinic Information */}
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h3 className="font-extrabold text-xl sm:text-2xl text-[#0F2E4A] mb-6">
            Clinic Information
          </h3>

          <div className="space-y-5">
            {/* Medical Type */}
            <div>
              <span className="block text-sm sm:text-base font-extrabold text-[#0F2E4A]">
                Medical Type
              </span>
              <p className="text-[#55697A] text-sm sm:text-base mt-1 font-medium">
                {selectedType || "HGV Bus Medicals"}
              </p>
            </div>

            {/* Address */}
            <div>
              <span className="block text-sm sm:text-base font-extrabold text-[#0F2E4A]">
                Address
              </span>
              <p className="text-[#55697A] text-sm sm:text-base mt-1 font-medium">
                {selectedClinic?.address || "Whitechapel, London"}
              </p>
            </div>

            {/* Location */}
            <div>
              <span className="block text-sm sm:text-base font-extrabold text-[#0F2E4A]">
                Location
              </span>
              <p className="text-[#55697A] text-sm sm:text-base mt-1 font-medium">
                {selectedClinic?.name || "Location"}
              </p>
            </div>

            {/* Date */}
            <div>
              <span className="block text-sm sm:text-base font-extrabold text-[#0F2E4A]">
                Date
              </span>
              <p className="text-[#55697A] text-sm sm:text-base mt-1 font-medium">
                {selectedDate.getDate()} {selectedDate.toLocaleString("default", { month: "long" })}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Your Details */}
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-extrabold text-xl sm:text-2xl text-[#0F2E4A]">
            Your Details
          </h3>

          {/* Name */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-[#0F2E4A] mb-2">
              Enter Your Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 focus:border-[#00B2D6] font-semibold text-sm transition-all text-[#0F2E4A] placeholder-slate-400 bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-[#0F2E4A] mb-2">
              Enter Your Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Your email"
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 focus:border-[#00B2D6] font-semibold text-sm transition-all text-[#0F2E4A] placeholder-slate-400 bg-white"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-[#0F2E4A] mb-2">
              Date of birth
            </label>
            <input
              type="text"
              name="dob"
              required
              value={formData.dob}
              onChange={handleInputChange}
              placeholder="Date of birth"
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 focus:border-[#00B2D6] font-semibold text-sm transition-all text-[#0F2E4A] placeholder-slate-400 bg-white"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-[#0F2E4A] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 focus:border-[#00B2D6] font-semibold text-sm transition-all text-[#0F2E4A] placeholder-slate-400 bg-white"
            />
          </div>

          {/* Post Code */}
          <div>
            <label className="block text-sm sm:text-base font-extrabold text-[#0F2E4A] mb-2">
              Post Code
            </label>
            <input
              type="text"
              name="postcode"
              required
              value={formData.postcode}
              onChange={handleInputChange}
              placeholder="Enter Your Post Code"
              className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B2D6]/40 focus:border-[#00B2D6] font-semibold text-sm transition-all text-[#0F2E4A] placeholder-slate-400 bg-white"
            />
          </div>

          {/* Select Payment Method */}
          <div className="pt-2">
            <label className="block text-sm sm:text-base font-extrabold text-[#0F2E4A] mb-4">
              Select Payment Method
            </label>
            <div className="flex flex-row items-center gap-8">
              {/* Stripe Option */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "stripe" ? "border-[#00B2D6]" : "border-slate-300"
                }`}>
                  {paymentMethod === "stripe" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                  )}
                </div>
                {/* Stripe Badge */}
                <div className="flex items-center gap-2">
                  <div className="bg-black text-white px-2.5 py-1 rounded-[6px] font-sans font-extrabold text-[10px] lowercase tracking-normal h-5 flex items-center justify-center shrink-0 select-none">
                    stripe
                  </div>
                  <span className="text-sm sm:text-base font-extrabold text-[#0F2E4A]">Stripe</span>
                </div>
              </label>

              {/* Paypal Option */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  paymentMethod === "paypal" ? "border-[#00B2D6]" : "border-slate-300"
                }`}>
                  {paymentMethod === "paypal" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00B2D6]" />
                  )}
                </div>
                {/* Paypal Logo */}
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M7 21h3.5c.8 0 1.5-.5 1.7-1.3l2.3-9.7c.1-.4-.2-.8-.6-.8H10.5L7 21z" fill="#003087"/>
                    <path d="M10.5 9.2h3.5c.8 0 1.5-.5 1.7-1.3l2.3-9.7c.1-.4-.2-.8-.6-.8H14L10.5 9.2z" fill="#0079C1" opacity="0.6"/>
                    <path d="M9 17.5h3.5c.8 0 1.5-.5 1.7-1.3l1.8-7.8c-2.3 0-4.3 1-5 3.5l-2 5.6z" fill="#0079C1"/>
                  </svg>
                  <span className="text-sm sm:text-base font-extrabold text-[#0F2E4A]">Paypal</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-[#00B2D6] hover:bg-[#0092B3] text-white font-bold text-base transition-all duration-200 shadow-md shadow-[#00B2D6]/10 hover:scale-[1.01]"
        >
          Continue £75.00
        </button>
      </form>
    </div>
  );
}
