/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useCreateOptionalInvestmentMutation } from "@/redux/service/agent/propertiesApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type OptionalInvestmentHandle = {
  submit: () => Promise<boolean>;
  isSubmitting: boolean;
};

// ✅ ADD PROPS INTERFACE
interface EditOptionalInvestmentProps {
  propertyData?: any;
}

type ApiErrorShape = { message?: string };

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function getErrorMessage(err: unknown) {
  const e = err as FetchBaseQueryError;

  if (e && typeof e === "object" && "data" in e) {
    const data = e.data as ApiErrorShape | string | undefined;
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
  }
  return "Failed to submit optional investment data.";
}

// ✅ FIX: Add props type to forwardRef
const EditOptionalInvestment = forwardRef<OptionalInvestmentHandle, EditOptionalInvestmentProps>(
  function OptionalInvestment({ propertyData }, ref) {
    const [createOptionalInvestment, { isLoading }] =
      useCreateOptionalInvestmentMutation();

    const [propertyId, setPropertyId] = useState("");

    const [historicalRate, setHistoricalRate] = useState("");
    const [holdingPeriod, setHoldingPeriod] = useState("");
    const [sellingCost, setSellingCost] = useState("");

    const [submitError, setSubmitError] = useState<string | null>(null);

    // ✅ DEBUG: Log incoming data
    console.log("🚀 EditOptionalInvestment - propertyData:", propertyData);
    console.log("🚀 optionalInvestmentData:", propertyData?.data?.optionalInvestmentData);

    // ✅ PERFECT: Populate with existing optional investment data (EDIT MODE)
    useEffect(() => {
      if (propertyData?.data) {
        const data = propertyData.data;
        
        // Get property ID from API (not localStorage)
        setPropertyId(data.id || "");
        console.log("✅ Property ID set to:", data.id);

        // Check if optionalInvestmentData exists
        if (data.optionalInvestmentData) {
          const investment = data.optionalInvestmentData;
          
          console.log("✅ Optional Investment data found:", investment);
          
          setHistoricalRate(investment.historicalRate?.toString() || "0");
          console.log("Historical Rate set to:", investment.historicalRate);
          
          setHoldingPeriod(investment.holdingPeriod?.toString() || "0");
          setSellingCost(investment.sellingCost?.toString() || "0");
          
          console.log("✅ All optional investment fields populated successfully!");
        } else {
          console.log("⚠️ No optionalInvestmentData found in property data");
        }
      } else {
        console.log("❌ No property data available yet");
      }
    }, [propertyData?.data]);

    const submit = async () => {
      setSubmitError(null);

      if (!propertyId) {
        setSubmitError("Property ID not found. Please create property first.");
        return false;
      }

      if (!historicalRate.trim()) {
        setSubmitError("Historical Occupancy Rate is required.");
        return false;
      }
      if (!holdingPeriod.trim()) {
        setSubmitError("Holding Period is required.");
        return false;
      }
      if (!sellingCost.trim()) {
        setSubmitError("Selling Costs is required.");
        return false;
      }

      const payload = {
        propertyId,
        historicalRate: toNumber(historicalRate),
        holdingPeriod: toNumber(holdingPeriod),
        sellingCost: toNumber(sellingCost),
      };

      console.log("=== Optional Investment Payload ===");
      console.log(payload);

      try {
        const res = await createOptionalInvestment(payload).unwrap();

        if (res?.success) return true;

        setSubmitError(res?.message || "Failed to submit optional investment data.");
        return false;
      } catch (err: unknown) {
        const msg = getErrorMessage(err);
        console.log("Optional investment submit error:", err);
        setSubmitError(msg);
        return false;
      }
    };

    // ✅ expose functions to parent
    useImperativeHandle(ref, () => ({
      submit,
      isSubmitting: isLoading,
    }));

    return (
      <div className="font-inter">
        {/* Header */}
        <div className="text-center mb-7">
          <h2 className="text-2xl md:text-3xl font-lato font-semibold text-[#223355] mb-2">
            Optional Investment Data
          </h2>
          <p className="text-[#003944] text-sm md:text-[18px] font-medium mb-8">
            Submit optional financial and investment information for deeper insights.
          </p>
        </div>

        {/* Property ID display */}
        {propertyId && (
          <p className="text-sm text-gray-600 mb-4">
            Property ID: <span className="font-medium">{propertyId}</span>
          </p>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Historical Occupancy Rate
              </label>
              <input
                type="number"
                value={historicalRate}
                onChange={(e) => setHistoricalRate(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Selling Costs (€)
              </label>
              <input
                type="number"
                value={sellingCost}
                onChange={(e) => setSellingCost(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Holding Period (years)
              </label>
              <input
                type="number"
                value={holdingPeriod}
                onChange={(e) => setHoldingPeriod(e.target.value)}
                placeholder="Enter year"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            <div className="h-10"></div>
          </div>
        </div>

        {submitError && <p className="mt-4 text-sm text-red-600">{submitError}</p>}
      </div>
    );
  }
);

export default EditOptionalInvestment;