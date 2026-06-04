/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import { useCreateFinancialInfoMutation } from "@/redux/service/agent/propertiesApi";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { appAlert } from "@/utils/appAlert";

// helper: convert input -> number safely
const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function EditFinancialInfo({ propertyData }: any) {
  const [createFinancialInfo, { isLoading }] = useCreateFinancialInfoMutation();

  const [propertyId, setPropertyId] = useState("");

  // controlled fields (all are numbers in backend)
  const [askingPrice, setAskingPrice] = useState("");
  const [managementFee, setManagementFee] = useState("");
  const [propertyTax, setPropertyTax] = useState("");
  const [grossAnnualRent, setGrossAnnualRent] = useState("");
  const [netAnnualIncome, setNetAnnualIncome] = useState("");
  const [perSqmCommercial, setPerSqmCommercial] = useState("");
  const [perSqmRentYield, setPerSqmRentYield] = useState("");
  const [grossYield, setGrossYield] = useState("");
  const [netYield, setNetYield] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  // ✅ DEBUG: Log incoming data
  console.log("🚀 EditFinancialInfo - propertyData:", propertyData);
  console.log("🚀 financialInfos:", propertyData?.data?.financialInfos);

  // ✅ PERFECT: Populate with existing financial data (EDIT MODE)
  useEffect(() => {
    if (propertyData?.data) {
      const data = propertyData.data;
      
      // Get property ID from API (not localStorage)
      setPropertyId(data.id || "");
      console.log("✅ Property ID set to:", data.id);

      // Check if financialInfos exists
      if (data.financialInfos) {
        const financial = data.financialInfos;
        
        console.log("✅ Financial data found:", financial);
        
        setAskingPrice(financial.askingPrice?.toString() || "0");
        console.log("Asking Price set to:", financial.askingPrice);
        
        setManagementFee(financial.managementFee?.toString() || "0");
        setPropertyTax(financial.propertyTax?.toString() || "0");
        setGrossAnnualRent(financial.grossAnnualRent?.toString() || "0");
        setNetAnnualIncome(financial.netAnnualIncome?.toString() || "0");
        setPerSqmCommercial(financial.perSqmCommercial?.toString() || "0");
        setPerSqmRentYield(financial.perSqmRentYield?.toString() || "0");
        setGrossYield(financial.grossYield?.toString() || "0");
        setNetYield(financial.netYield?.toString() || "0");
        
        console.log("✅ All financial fields populated successfully!");
      } else {
        console.log("⚠️ No financialInfos found in property data");
      }
    } else {
      console.log("❌ No property data available yet");
    }
  }, [propertyData?.data]); // ✅ Use nested property as dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!propertyId) {
      setSubmitError("Property ID not found. Please create property first.");
      return;
    }

    // ✅ Build payload exactly like Postman expects
    const payload = {
      propertyId,
      askingPrice: toNumber(askingPrice),
      managementFee: toNumber(managementFee),
      propertyTax: toNumber(propertyTax),
      grossAnnualRent: toNumber(grossAnnualRent),
      netAnnualIncome: toNumber(netAnnualIncome),
      perSqmCommercial: toNumber(perSqmCommercial),
      perSqmRentYield: toNumber(perSqmRentYield),
      grossYield: toNumber(grossYield),
      netYield: toNumber(netYield),
    };

    // ✅ debug
    console.log("=== Financial payload ===", payload);

    try {
      const res = await createFinancialInfo(payload).unwrap();

      if (res?.success) {
        appAlert.fire({
          title: "Success!",
          text: res.message || "Financial info submitted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        appAlert.fire({
          title: "Error!",
          text: res?.message || "Failed to submit financial info.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err: unknown) {
      console.log("Financial submit error:", err);

      let errorMessage = "Failed to submit financial info.";

      if (typeof err === "object" && err !== null) {
        if ("data" in err) {
          const fetchError = err as FetchBaseQueryError & {
            data?: { message?: string };
          };
          errorMessage = fetchError.data?.message || errorMessage;
        } else if ("message" in err) {
          const serializedError = err as SerializedError;
          errorMessage = serializedError.message || errorMessage;
        }
      }

      appAlert.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
      });

      setSubmitError(errorMessage);
    }
  };

  return (
    <div className="font-inter">
      {/* Header */}
      <div className="text-center mb-7">
        <h2 className="text-2xl md:text-3xl font-lato font-semibold text-[#223355] mb-2">
          Financial Info
        </h2>
        <p className="text-[#003944] text-sm md:text-[18px] font-medium mb-8">
          Provide the property&apos;s financial details and records.
        </p>
      </div>

      {/* Property ID display */}
      {propertyId && (
        <p className="text-sm text-gray-600 mb-4">
          Property ID: <span className="font-medium">{propertyId}</span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Asking Price */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Asking Price (€)
              </label>
              <input
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Property Taxes */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Property Taxes (IMU, TASI, etc.)
              </label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Net Annual Income */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Net Annual Income
              </label>
              <input
                type="number"
                value={netAnnualIncome}
                onChange={(e) => setNetAnnualIncome(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* €/sqm Rent Yield */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                €/sqm Rent Yield
              </label>
              <input
                type="number"
                value={perSqmRentYield}
                onChange={(e) => setPerSqmRentYield(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Net Yield % */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Net Yield %
              </label>
              <input
                type="number"
                value={netYield}
                onChange={(e) => setNetYield(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Management Fees */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Management Fees (€ per month)
              </label>
              <input
                type="number"
                value={managementFee}
                onChange={(e) => setManagementFee(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Gross Annual Rent */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Gross Annual Rent
              </label>
              <input
                type="number"
                value={grossAnnualRent}
                onChange={(e) => setGrossAnnualRent(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* €/sqm Commercial */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                €/sqm Commercial
              </label>
              <input
                type="number"
                value={perSqmCommercial}
                onChange={(e) => setPerSqmCommercial(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Gross Yield % */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Gross Yield %
              </label>
              <input
                type="number"
                value={grossYield}
                onChange={(e) => setGrossYield(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Empty space */}
            <div className="h-10"></div>
          </div>
        </div>

        {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="p-4 bg-[#004E60] text-white rounded-lg text-sm md:text-[18px] font-medium transition-colors disabled:opacity-60"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}