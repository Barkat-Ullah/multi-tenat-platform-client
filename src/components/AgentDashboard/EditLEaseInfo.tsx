"use client";

import { useCreateLeaseInfoMutation } from "@/redux/service/agent/propertiesApi";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { appAlert } from "@/utils/appAlert";

const toNumber = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function EditLeaseInfo({ propertyData }: any) {
  const [createLeaseInfo, { isLoading }] = useCreateLeaseInfoMutation();

  const [propertyId, setPropertyId] = useState("");

  // ✅ Form states
  const [status, setStatus] = useState(""); // active/inactive
  const [duration, setDuration] = useState(""); // "12 months"
  const [type, setType] = useState(""); // PRIVATE/COMPANY/...
  const [rentPerMonth, setRentPerMonth] = useState("");
  const [leaseRenewal, setLeaseRenewal] = useState(""); // Yes/No
  const [leasedArea, setLeasedArea] = useState(""); // string per backend
  const [specialClauses, setSpecialClauses] = useState("");

  const [guaranteeType, setGuaranteeType] = useState(""); // BANK_GUARANTEE ...
  const [guaranteeAmount, setGuaranteeAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  // ✅ DEBUG: Log incoming data
  console.log("🚀 EditLeaseInfo - propertyData:", propertyData);
  console.log("🚀 leaseTenantInfos:", propertyData?.data?.leaseTenantInfos);

  // ✅ PERFECT: Populate with existing lease data (EDIT MODE)
  useEffect(() => {
    if (propertyData?.data) {
      const data = propertyData.data;
      
      // Get property ID from API (not localStorage)
      setPropertyId(data.id || "");
      console.log("✅ Property ID set to:", data.id);

      // Check if leaseTenantInfos exists
      if (data.leaseTenantInfos) {
        const lease = data.leaseTenantInfos;
        
        console.log("✅ Lease data found:", lease);
        
        setStatus(lease.status || "");
        console.log("Status set to:", lease.status);
        
        setDuration(lease.duration || "");
        setType(lease.type || "");
        setRentPerMonth(lease.rentPerMonth?.toString() || "0");
        
        // ✅ Convert boolean to "Yes"/"No" for select
        setLeaseRenewal(lease.leaseRenewal === true ? "Yes" : "No");
        console.log("Lease Renewal set to:", lease.leaseRenewal === true ? "Yes" : "No");
        
        setLeasedArea(lease.leasedArea || "");
        setSpecialClauses(lease.specialClauses || "");
        setGuaranteeType(lease.guaranteeType || "");
        setGuaranteeAmount(lease.guaranteeAmount?.toString() || "0");
        setDepositAmount(lease.depositAmount?.toString() || "0");
        
        console.log("✅ All lease fields populated successfully!");
      } else {
        console.log("⚠️ No leaseTenantInfos found in property data");
      }
    } else {
      console.log("❌ No property data available yet");
    }
  }, [propertyData?.data]); // ✅ Use nested property as dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!propertyId) return setSubmitError("PropertyId missing. Create property first.");
    if (!status.trim()) return setSubmitError("Lease Status is required.");
    if (!duration.trim()) return setSubmitError("Duration is required.");
    if (!type.trim()) return setSubmitError("Tenant Type is required.");
    if (!rentPerMonth.trim()) return setSubmitError("Rent per month is required.");
    if (!leaseRenewal.trim()) return setSubmitError("Lease renewal option is required.");
    if (!leasedArea.trim()) return setSubmitError("Leased area is required.");
    if (!guaranteeType.trim()) return setSubmitError("Guarantee type is required.");
    if (!guaranteeAmount.trim()) return setSubmitError("Guarantee amount is required.");
    if (!depositAmount.trim()) return setSubmitError("Deposit amount is required.");

    const payload = {
      propertyId,
      status: status.trim(),
      duration: duration.trim(),
      type: type.trim(),
      rentPerMonth: toNumber(rentPerMonth),
      leaseRenewal: leaseRenewal === "Yes",
      leasedArea: leasedArea.trim(),
      specialClauses: specialClauses.trim() || undefined,
      guaranteeType: guaranteeType.trim(),
      guaranteeAmount: toNumber(guaranteeAmount),
      depositAmount: toNumber(depositAmount),
    };

    console.log("=== Lease payload ===", payload);

    try {
      const res = await createLeaseInfo(payload).unwrap();

      if (res?.success) {
        appAlert.fire({
          title: "Success!",
          text: res?.message || "Lease info saved successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        appAlert.fire({
          title: "Error!",
          text: res?.message || "Failed to save lease info.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (err: any) {
      console.log("Lease submit error:", err);

      appAlert.fire({
        title: "Error!",
        text: err?.data?.message || "Failed to submit lease info.",
        icon: "error",
        confirmButtonText: "OK",
      });

      setSubmitError("Failed to submit lease info.");
    }
  };

  return (
    <div className="font-inter">
      {/* Header */}
      <div className="text-center mb-7">
        <h2 className="text-2xl md:text-3xl font-lato font-semibold text-[#223355] mb-2">
          Lease & Tenant Info
        </h2>
        <p className="text-[#003944] text-sm md:text-[18px] font-medium mb-8">
          Provide details of the lease agreement and tenant information.
        </p>
      </div>

      {/* Property ID display */}
      {propertyId && (
        <p className="text-sm text-gray-600 mb-4">
          Property ID: <span className="font-medium">{propertyId}</span>
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Lease Status */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Lease Status
              </label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                placeholder="active"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Tenant Type */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Tenant Type (backend: type)
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              >
                <option value="">Select type</option>
                <option value="PRIVATE">PRIVATE</option>
                <option value="COMPANY">COMPANY</option>
                <option value="PUBLIC">PUBLIC</option>
                <option value="AUTHORITY">AUTHORITY</option>
                <option value="CHAIN">CHAIN</option>
                <option value="OTHERS">OTHERS</option>
              </select>
            </div>

            {/* Lease Renewal Option */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Lease Renewal Option
              </label>
              <select
                value={leaseRenewal}
                onChange={(e) => setLeaseRenewal(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Special Clauses */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Special Clauses
              </label>
              <textarea
                value={specialClauses}
                onChange={(e) => setSpecialClauses(e.target.value)}
                placeholder="Write here"
                rows={3}
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Lease Guarantee Type */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Lease Guarantee Type
              </label>
              <select
                value={guaranteeType}
                onChange={(e) => setGuaranteeType(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              >
                <option value="">Select type</option>
                <option value="NONE">NONE</option>
                <option value="BANK_GUARANTEE">Bank Gurantee</option>
                <option value="INSURANCE_BOND">Insurance Bond</option>
                <option value="CORPORATE_GUARANTEE">Corporate Gurantee</option>
                <option value="PERSONAL_GUARANTEE">Personal Guarantee</option>
              </select>
            </div>

            {/* Deposit Amount */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Deposit Amount (€)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="25000"
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contract Duration */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Contract Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="12 months"
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Rent Amount */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Rent Amount (€ / month)
              </label>
              <input
                type="number"
                value={rentPerMonth}
                onChange={(e) => setRentPerMonth(e.target.value)}
                placeholder="20000"
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Leased Area */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Leased Area
              </label>
              <input
                type="text"
                value={leasedArea}
                onChange={(e) => setLeasedArea(e.target.value)}
                placeholder="100 sqft"
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {/* Guarantee Amount */}
            <div>
              <label className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2">
                Guarantee Amount (€)
              </label>
              <input
                type="number"
                value={guaranteeAmount}
                onChange={(e) => setGuaranteeAmount(e.target.value)}
                placeholder="25000"
                className="w-full px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-[8px] border border-[#D4D4D4] bg-[#F8F8F6]"
              />
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full p-4 text-white rounded-lg text-sm md:text-[18px] font-medium transition-colors ${
                isLoading ? "bg-gray-400" : "bg-[#004E60]"
              }`}
            >
              {isLoading ? "Submitting..." : "Submit Lease Info"}
            </button>

            <div className="h-2"></div>
          </div>
        </div>
      </form>
    </div>
  );
}