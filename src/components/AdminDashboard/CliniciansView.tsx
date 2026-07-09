"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Search, Plus, MoreVertical, X } from "lucide-react";
import { Dropdown } from "antd";
import Pagination from "./Pagination";
import AddClinicianModal from "./AddClinicianModal";
import ClinicianDetailsModal from "./ClinicianDetailsModal";
import { toast } from "sonner";
import {
  AdminClinic,
  CreateAdminClinicRequest,
  useCreateAdminClinicMutation,
  useDeleteAdminClinicMutation,
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
  const [clinicianToDelete, setClinicianToDelete] = useState<AdminClinic | null>(null);
  const [deletingClinicianId, setDeletingClinicianId] = useState<string | null>(null);

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
  const [deleteClinic] = useDeleteAdminClinicMutation();

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

  useEffect(() => {
    if (!clinicianToDelete || deletingClinicianId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setClinicianToDelete(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [clinicianToDelete, deletingClinicianId]);

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

  const handleDeleteClinician = async (clinician: AdminClinic) => {
    setDeletingClinicianId(clinician.id);
    try {
      const response = await deleteClinic(clinician.id).unwrap();
      toast.success(response.message || "Clinician deleted successfully.");
      setClinicianToDelete(null);

      if (selectedClinician?.id === clinician.id) {
        setSelectedClinician(null);
        setIsDetailsOpen(false);
      }

      if (clinicians.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete clinician.";
      toast.error(message);
    } finally {
      setDeletingClinicianId(null);
    }
  };

  const getActionMenuItems = (clinician: AdminClinic) => [
    {
      key: "view",
      label: <span className="block px-2 font-sans font-semibold text-slate-700">View</span>,
      onClick: () => handleViewClinician(clinician),
    },
    {
      key: "delete",
      disabled: deletingClinicianId === clinician.id,
      label: (
        <span className="block px-2 font-sans font-semibold text-red-600">
          {deletingClinicianId === clinician.id ? "Deleting..." : "Delete"}
        </span>
      ),
      onClick: () => setClinicianToDelete(clinician),
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

      {clinicianToDelete && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-clinician-title"
        >
          <button
            type="button"
            aria-label="Close delete confirmation"
            className="absolute inset-0 bg-[#0F2E4A]/45 backdrop-blur-[2px]"
            onClick={() => {
              if (!deletingClinicianId) setClinicianToDelete(null);
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-[0_24px_70px_rgba(15,46,74,0.2)] sm:p-8">
            <button
              type="button"
              onClick={() => setClinicianToDelete(null)}
              disabled={Boolean(deletingClinicianId)}
              aria-label="Close"
              title="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-[#0F2E4A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />
            </button>

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={28} />
            </div>
            <h2
              id="delete-clinician-title"
              className="text-xl font-extrabold text-[#0F2E4A] sm:text-2xl"
            >
              Delete Clinician?
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
              {clinicianToDelete.fullName} will be removed from the clinician list.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setClinicianToDelete(null)}
                disabled={Boolean(deletingClinicianId)}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-[#0F2E4A] transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClinician(clinicianToDelete)}
                disabled={Boolean(deletingClinicianId)}
                className="rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingClinicianId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
