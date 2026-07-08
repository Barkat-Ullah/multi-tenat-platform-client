"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Calendar,
  ImageIcon,
  Map,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Pagination from "./Pagination";
import AddLocationModal from "./AddLocationModal";
import {
  type AdminLocation,
  type CreateAdminLocationRequest,
  useCreateAdminLocationMutation,
  useDeleteAdminLocationMutation,
  useGetAdminLocationsQuery,
} from "@/redux/service/admin/locationsApi";

const PAGE_LIMIT = 6;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;
  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

const LocationsSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading locations">
    {Array.from({ length: 6 }, (_, index) => (
      <div key={index} className="min-h-[230px] animate-pulse rounded-3xl border border-slate-100 bg-white p-6">
        <div className="mb-4 h-32 rounded-2xl bg-slate-100" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="h-8 w-8 rounded-full bg-slate-200" />
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-2 w-24 rounded-full bg-slate-100" />
          <div className="h-2.5 w-48 rounded-full bg-slate-200" />
          <div className="h-2.5 w-36 rounded-full bg-slate-100" />
        </div>
        <div className="mt-7 space-y-3 border-t border-slate-100 pt-4">
          <div className="h-2.5 w-28 rounded-full bg-slate-200" />
          <div className="h-2.5 w-32 rounded-full bg-slate-200" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading locations...</span>
  </div>
);

export default function LocationsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<AdminLocation | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setCurrentPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: locationsResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminLocationsQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
    ...(debouncedSearchTerm ? { searchTerm: debouncedSearchTerm } : {}),
  });
  const [createLocation, { isLoading: isCreating }] =
    useCreateAdminLocationMutation();
  const [deleteLocation, { isLoading: isDeleting }] =
    useDeleteAdminLocationMutation();

  const locations = locationsResponse?.data || [];
  const totalPages = Math.max(
    1,
    Math.ceil((locationsResponse?.meta.total || 0) / PAGE_LIMIT),
  );
  const isLocationsLoading = isLoading || isFetching;

  const handleCreateLocation = async (
    payload: CreateAdminLocationRequest,
  ): Promise<boolean> => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        locationName: payload.locationName,
        lat: payload.lat,
        lng: payload.lng,
      }),
    );
    if (payload.image) {
      formData.append("image", payload.image);
    }

    try {
      const response = await createLocation(formData).unwrap();
      toast.success(response.message || "Location created successfully.");
      setCurrentPage(1);
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create location."));
      return false;
    }
  };

  const handleDeleteLocation = async () => {
    if (!locationToDelete) return;

    try {
      const response = await deleteLocation(locationToDelete.id).unwrap();
      toast.success(response.message || "Location deleted successfully.");
      if (locations.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      }
      setLocationToDelete(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete location."));
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          Locations
        </h1>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-sm font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 hover:bg-[#009cb9]"
        >
          <span>Add Location</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white">
            <Plus size={12} className="stroke-[3]" />
          </span>
        </button>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="search"
          placeholder="Search Location"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
        />
      </div>

      {isLocationsLoading ? (
        <LocationsSkeleton />
      ) : isError ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-3xl border border-slate-100 bg-white text-center">
          <p className="text-sm font-bold text-red-500">Failed to load locations.</p>
          <button type="button" onClick={() => refetch()} className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]">Try Again</button>
        </div>
      ) : locations.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 text-center">
          <p className="text-sm font-semibold text-slate-500">
            {debouncedSearchTerm
              ? "No locations match your search."
              : "No locations have been added yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="flex min-h-[300px] flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-shadow hover:shadow-[0_10px_35px_rgba(0,0,0,0.03)]"
            >
              <div>
                <div className="relative mb-4 h-32 overflow-hidden rounded-2xl bg-[#E6FAFF]">
                  {location.image ? (
                    <Image
                      src={location.image}
                      alt={location.locationName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#00B2D6]">
                      <ImageIcon size={28} />
                      <span className="text-xs font-extrabold uppercase tracking-wide">
                        No image
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-poppins text-lg font-bold tracking-tight text-[#0F2E4A]">
                    {location.locationName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLocationToDelete(location)}
                      aria-label={`Delete ${location.locationName}`}
                      title="Delete location"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6]">
                      <Map size={15} />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Coordinates
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                    Latitude: {location.lat}
                  </p>
                  <p className="text-xs font-semibold leading-relaxed text-slate-500">
                    Longitude: {location.lng}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-50 pt-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <Calendar size={14} className="text-[#00B2D6]" />
                  <span>{location.totalBookings} bookings</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <Users size={14} className="text-[#00B2D6]" />
                  <span>{location.totalClinicsAdded} clinics</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLocationsLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <AddLocationModal
        isOpen={isAddModalOpen}
        isSaving={isCreating}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateLocation}
      />

      {locationToDelete &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Cancel location deletion"
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => !isDeleting && setLocationToDelete(null)}
            />
            <div className="relative z-10 w-full max-w-[440px] rounded-[28px] border border-slate-100 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle size={21} />
                </div>
                <button
                  type="button"
                  onClick={() => setLocationToDelete(null)}
                  disabled={isDeleting}
                  aria-label="Cancel location deletion"
                  title="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                  <X size={17} />
                </button>
              </div>
              <h2 className="mt-5 font-poppins text-xl font-extrabold text-[#0F2E4A]">
                Delete Location?
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
                This will remove {locationToDelete.locationName} from active locations.
              </p>
              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLocationToDelete(null)}
                  disabled={isDeleting}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteLocation}
                  disabled={isDeleting}
                  className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
