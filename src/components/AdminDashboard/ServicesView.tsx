"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Plus, Trash2, X } from "lucide-react";
import AddServiceModal from "./AddServiceModal";
import { toast } from "sonner";
import {
  AdminService,
  useCreateAdminServiceMutation,
  useDeleteAdminServiceMutation,
  useGetAdminServicesQuery,
} from "@/redux/service/admin/servicesApi";

const ServiceCardSkeleton = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center gap-4 rounded-[24px] border border-slate-100/80 bg-white p-4 shadow-[0_4px_25px_rgba(0,0,0,0.012)] sm:p-5"
      >
        <div className="h-[72px] w-[95px] shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:h-[82px] sm:w-[110px]" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </>
);

const ServiceCard = ({
  service,
  isDeleting,
  onDelete,
}: {
  service: AdminService;
  isDeleting: boolean;
  onDelete: (service: AdminService) => void;
}) => (
  <div className="group relative flex items-center gap-4 rounded-[24px] border border-slate-100/80 bg-white p-4 pr-12 shadow-[0_4px_25px_rgba(0,0,0,0.012)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-5 sm:pr-12">
    <button
      type="button"
      onClick={() => onDelete(service)}
      disabled={isDeleting}
      aria-label={`Delete ${service.title}`}
      title="Delete"
      className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFEBEB] text-[#FF4D4F] transition-all hover:bg-[#FFD6D6] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 size={15} />
    </button>

    <div className="relative h-[72px] w-[95px] shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-[82px] sm:w-[110px]">
      {service.files ? (
        <Image
          src={service.files}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 95px, 110px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#E6FAFF] text-xs font-bold text-[#00B2D6]">
          Service
        </div>
      )}
    </div>

    <div className="min-w-0">
      <h3 className="font-poppins truncate text-sm font-bold text-[#0F2E4A] sm:text-[15px]">
        {service.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 font-sans text-xs font-medium text-slate-400">
        {service.description || "N/A"}
      </p>
    </div>
  </div>
);

const DeleteServiceModal = ({
  service,
  isDeleting,
  onClose,
  onConfirm,
}: {
  service: AdminService | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!service) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [service]);

  if (!service) return null;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close delete service dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[420px] rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
              Delete Service
            </h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
              Are you sure you want to delete {service.title}?
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close delete service dialog"
            title="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-full bg-[#FF4D4F] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#E33F41] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default function ServicesView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<AdminService | null>(null);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAdminServicesQuery({ page: 1, limit: 100 });
  const [createService, { isLoading: isCreating }] = useCreateAdminServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteAdminServiceMutation();

  const services = data?.data || [];
  const isBusy = isLoading || isFetching;

  const handleSaveService = async (payload: {
    title: string;
    description: string;
    file: File;
  }) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        title: payload.title,
        description: payload.description,
      }),
    );
    formData.append("files", payload.file);

    try {
      const response = await createService(formData).unwrap();
      toast.success(response.message || `Successfully added service "${payload.title}"!`);
      return true;
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to add service.";
      toast.error(message);
      return false;
    }
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await deleteService(serviceToDelete.id).unwrap();
      toast.success(response.message || `Successfully deleted "${serviceToDelete.title}".`);
      setServiceToDelete(null);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to delete service.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          All Services
        </h1>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 transition-all hover:bg-[#009cb9] active:scale-[0.98] sm:text-sm"
        >
          <span>Add Service</span>
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-red-100 bg-white p-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          <p className="text-sm font-semibold text-red-500">
            Failed to load services.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {isBusy ? (
            <ServiceCardSkeleton />
          ) : services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isDeleting={isDeleting && serviceToDelete?.id === service.id}
                onDelete={setServiceToDelete}
              />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-100 bg-white p-12 text-center text-sm font-semibold text-slate-500 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
              No services found.
            </div>
          )}
        </div>
      )}

      <AddServiceModal
        isOpen={isModalOpen}
        isSaving={isCreating}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
      />

      <DeleteServiceModal
        service={serviceToDelete}
        isDeleting={isDeleting}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
      />
    </div>
  );
}
