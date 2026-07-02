"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { Dropdown } from "antd";
import Pagination from "./Pagination";
import AddClinicianModal from "./AddClinicianModal";
import ClinicianDetailsModal from "./ClinicianDetailsModal";
import { toast } from "sonner";
import {
  AdminClinic,
  CreateAdminClinicRequest,
  useCreateAdminClinicMutation,
  useGetAdminClinicsQuery,
} from "@/redux/service/admin/cliniciansApi";
import { useGetAdminLocationsQuery } from "@/redux/service/admin/locationsApi";
import { useGetAdminServicesQuery } from "@/redux/service/admin/servicesApi";

const PAGE_LIMIT = 10;

const CliniciansTableSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <tr key={index} className="border-b border-slate-100 last:border-b-0">
        {Array.from({ length: 6 }).map((__, cellIndex) => (
          <td key={cellIndex} className="px-6 py-4">
            <div className="h-4 w-full max-w-[150px] animate-pulse rounded bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

const formatServices = (clinician: AdminClinic) =>
  clinician.services?.map((service) => service.title).join(", ") || "N/A";

const normalizeStatus = (status: string) =>
  status.toUpperCase() === "ACTIVE" ? "Active" : "Inactive";

export default function CliniciansView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinician, setSelectedClinician] = useState<AdminClinic | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminClinicsQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
    ...(searchTerm.trim() ? { searchTerm: searchTerm.trim() } : {}),
  });
  const {
    data: locationsData,
    isLoading: isLocationsLoading,
    isFetching: isLocationsFetching,
  } = useGetAdminLocationsQuery({ page: 1, limit: 100 });
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    isFetching: isServicesFetching,
  } = useGetAdminServicesQuery({ page: 1, limit: 100 });
  const [createClinic, { isLoading: isCreating }] = useCreateAdminClinicMutation();

  const clinicians = data?.data || [];
  const locations = locationsData?.data || [];
  const services = servicesData?.data || [];
  const isOptionsLoading =
    isLocationsLoading ||
    isLocationsFetching ||
    isServicesLoading ||
    isServicesFetching;

  const filteredClinicians = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clinicians;

    return clinicians.filter((clinician) =>
      [
        clinician.fullName,
        clinician.email,
        clinician.phoneNumber,
        clinician.status,
        clinician.clinicGmcNumber,
        clinician.location?.locationName,
        formatServices(clinician),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [clinicians, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((data?.meta.total || 0) / PAGE_LIMIT));
  }, [data?.meta.total]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSaveClinician = async (payload: CreateAdminClinicRequest) => {
    try {
      const response = await createClinic(payload).unwrap();
      toast.success(response.message || "Successfully added new clinician!");
      setCurrentPage(1);
      return true;
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to add clinician.";
      toast.error(message);
      return false;
    }
  };

  const handleViewClinician = (clinician: AdminClinic) => {
    setSelectedClinician(clinician);
    setIsDetailsOpen(true);
  };

  const getActionMenuItems = (clinician: AdminClinic) => [
    {
      key: "view",
      label: <span className="block px-2 font-sans font-semibold text-slate-700">View</span>,
      onClick: () => handleViewClinician(clinician),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          Clinicians
        </h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 transition-all hover:bg-[#009cb9] active:scale-[0.98] sm:text-sm"
        >
          <span>Add Clinician</span>
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search clinician"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-poppins text-lg font-bold text-[#0F2E4A] sm:text-xl">
          Clinicians
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="border-b-2 border-[#00B2D6] text-left">
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Clinician
                </th>
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Email
                </th>
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Locations
                </th>
                <th className="px-6 py-4 font-sans text-sm font-bold text-[#0F2E4A]">
                  Speciality
                </th>
                <th className="px-6 py-4 text-center font-sans text-sm font-bold text-[#0F2E4A]">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-sans text-sm font-bold text-[#0F2E4A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                <CliniciansTableSkeleton />
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-sm font-semibold text-red-500">
                      Failed to load clinicians.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredClinicians.length > 0 ? (
                filteredClinicians.map((clinician) => {
                  const status = normalizeStatus(clinician.status);

                  return (
                    <tr
                      key={clinician.id}
                      className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {clinician.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {clinician.email}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                        {clinician.location?.locationName || "N/A"}
                      </td>
                      <td className="max-w-[220px] truncate px-6 py-4 text-sm font-semibold text-slate-500">
                        {formatServices(clinician)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide ${
                          status === "Active"
                            ? "bg-[#E6FDF5] text-[#10B981]"
                            : "bg-[#FFF8E6] text-[#F59E0B]"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Dropdown
                          menu={{ items: getActionMenuItems(clinician) }}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <button
                            type="button"
                            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] transition-all hover:scale-105 hover:bg-[#D0F3FC] active:scale-95"
                            aria-label="More actions"
                          >
                            <MoreVertical size={16} className="stroke-[2.5]" />
                          </button>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center font-semibold text-slate-500">
                    No clinicians found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && !isFetching && !isError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <AddClinicianModal
        isOpen={isModalOpen}
        isSaving={isCreating}
        locations={locations}
        services={services}
        isOptionsLoading={isOptionsLoading}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClinician}
      />

      <ClinicianDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        clinician={selectedClinician}
      />
    </div>
  );
}
