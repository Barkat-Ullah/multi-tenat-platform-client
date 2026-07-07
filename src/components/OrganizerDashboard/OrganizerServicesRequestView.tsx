"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetAllServicesQuery,
  useCreateOrganizerRequestMutation,
  useGetMyOrganizerRequestsQuery,
  type OrganizerRequest,
} from "@/redux/service/corporate/corporateDashboardApi";
import { useGetProfileDataQuery } from "@/redux/service/profile/profileApi";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending:
      "bg-amber-50 text-amber-600 border border-amber-200",
    Confirmed:
      "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Cancelled:
      "bg-red-50 text-red-500 border border-red-200",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-500 border border-slate-200";
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold ${cls}`}>
      {status}
    </span>
  );
}

// ── skeleton rows ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-slate-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function OrganizerServicesRequestView() {
  const { data: servicesData, isLoading: isLoadingServices } =
    useGetAllServicesQuery();
  const [createOrganizerRequest, { isLoading: isSubmitting }] =
    useCreateOrganizerRequestMutation();
  const {
    data: myRequestsData,
    isLoading: isLoadingRequests,
    isFetching,
  } = useGetMyOrganizerRequestsQuery();
  const { data: profileResponse } = useGetProfileDataQuery();

  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [numberOfDriver, setNumberOfDriver] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  useEffect(() => {
    if (profileResponse?.data?.email) {
      setEmail(profileResponse.data.email);
    }
  }, [profileResponse]);

  useEffect(() => {
    if (servicesData?.data && servicesData.data.length > 0 && !selectedServiceId) {
      setSelectedServiceId(servicesData.data[0].id);
    }
  }, [servicesData, selectedServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !companyName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !location.trim() ||
      !numberOfDriver.trim() ||
      !selectedServiceId
    ) {
      toast.error("Please fill in all details before submitting.");
      return;
    }

    try {
      const response = await createOrganizerRequest({
        companyName,
        email,
        phone,
        location,
        totalDriver: numberOfDriver,
        serviceId: selectedServiceId,
      }).unwrap();

      if (response?.success) {
        toast.success(`Service request submitted successfully for ${companyName}!`);
        setCompanyName("");
        setEmail(profileResponse?.data?.email ?? "");
        setPhone("");
        setLocation("");
        setNumberOfDriver("");
        if (servicesData?.data && servicesData.data.length > 0) {
          setSelectedServiceId(servicesData.data[0].id);
        } else {
          setSelectedServiceId("");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to submit service request.");
    }
  };

  const requests: OrganizerRequest[] = myRequestsData?.data ?? [];
  const total = myRequestsData?.meta?.total ?? 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-10 w-full">

      {/* ── Section: Submit Form ─────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight mb-6">
          Service Request
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-4xl text-xs sm:text-sm text-[#0F2E4A] font-sans"
        >
          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="ABC Logistics Ltd"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example2345@gmail.com"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0161 123 4567"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
            />
          </div>

          {/* Number of Drivers & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5">
                Number Of Driver
              </label>
              <input
                type="text"
                value={numberOfDriver}
                onChange={(e) => setNumberOfDriver(e.target.value)}
                placeholder="20"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5">
                Services Name
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00B2D6] text-xs sm:text-sm font-semibold text-[#0F2E4A] select-arrow"
              >
                {isLoadingServices ? (
                  <option value="">Loading services...</option>
                ) : (
                  servicesData?.data?.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 border-none outline-none cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Section: My Requests ──────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
            My Requests
          </h2>
          {!isLoadingRequests && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {total} {total === 1 ? "request" : "requests"}
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
          <table className="min-w-full text-xs sm:text-sm text-[#0F2E4A]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Clinic
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Drivers
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingRequests || isFetching ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-400 font-semibold text-sm"
                  >
                    No service requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Company */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-bold text-[#0F2E4A]">{req.companyName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{req.email}</p>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      {req.service?.title ?? "—"}
                    </td>

                    {/* Clinic */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {req.clinic ? (
                        <div>
                          <p className="font-semibold">{req.clinic.fullName}</p>
                          <p className="text-[11px] text-slate-400">{req.clinic.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Not assigned</span>
                      )}
                    </td>

                    {/* Drivers */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-bold text-[#00B2D6]">
                        {req.drivers.length}
                      </span>
                      <span className="text-slate-400 font-semibold"> / {req.totalDriver}</span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-medium">
                      {formatDate(req.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
