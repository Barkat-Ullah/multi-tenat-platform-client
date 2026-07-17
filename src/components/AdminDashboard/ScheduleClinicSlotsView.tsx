"use client";

import { useMemo, useState } from "react";
import { Building2, RefreshCw } from "lucide-react";
import CreateScheduleView from "@/components/ClinicDashboard/CreateScheduleView";
import { useGetAdminClinicsQuery } from "@/redux/service/admin/cliniciansApi";

const CLINIC_PAGE_LIMIT = 100;

export default function ScheduleClinicSlotsView() {
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const {
    data: clinicsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminClinicsQuery({ page: 1, limit: CLINIC_PAGE_LIMIT });

  const clinics = clinicsResponse?.data || [];
  const selectedClinic = useMemo(
    () => clinics.find((clinic) => clinic.id === selectedClinicId) || null,
    [clinics, selectedClinicId],
  );
  const selectedClinicServiceId = selectedClinic?.services?.[0]?.id;

  return (
    <div className="w-full space-y-5">
      <div className="mx-4 mt-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_4px_25px_rgba(0,0,0,0.015)] md:mx-6 md:mt-6 lg:mx-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#00B2D6]">
              <Building2 size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wide">
                Clinic selection
              </span>
            </div>
            <h1 className="mt-2 font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
              Schedule Clinic Slots
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Select a clinic first, then generate slots for that clinic.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <label htmlFor="clinic-slot-select" className="sr-only">
              Select clinic
            </label>
            <select
              id="clinic-slot-select"
              value={selectedClinicId}
              onChange={(event) => setSelectedClinicId(event.target.value)}
              disabled={isLoading || isError || clinics.length === 0}
              className="min-h-[46px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#0F2E4A] outline-none transition-colors focus:border-[#00B2D6] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">
                {isLoading || isFetching ? "Loading clinics..." : "Select a clinic"}
              </option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.fullName}
                  {clinic.location?.locationName
                    ? ` - ${clinic.location.locationName}`
                    : ""}
                </option>
              ))}
            </select>

            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#00B2D6] px-5 text-sm font-bold text-white transition-colors hover:bg-[#009cb9]"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            )}
          </div>
        </div>

        {!isLoading && !isError && clinics.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm font-semibold text-slate-500">
            No clinics found. Add a clinic before scheduling slots.
          </p>
        )}
      </div>

      <CreateScheduleView
        clinicId={selectedClinicId || undefined}
        clinicName={selectedClinic?.fullName}
        serviceId={selectedClinicServiceId}
        requiresClinicSelection
      />
    </div>
  );
}
