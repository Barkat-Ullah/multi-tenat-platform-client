"use client";

import React, { useEffect, useRef, useState } from "react";
import { Minus, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import AddFaqModal from "./AddFaqModal";
import {
  type AdminFaq,
  type AdminFaqMutationRequest,
  useCreateAdminFaqMutation,
  useGetAdminFaqsQuery,
  useUpdateAdminFaqMutation,
} from "@/redux/service/admin/faqApi";

const FaqListSkeleton = () => (
  <div className="space-y-4" role="status" aria-label="Loading FAQs">
    {Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className="flex min-h-[68px] animate-pulse items-center justify-between gap-4 rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5"
      >
        <div
          className={`h-4 rounded-full bg-slate-200 ${
            index % 2 === 0 ? "w-2/3" : "w-1/2"
          }`}
        />
        <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200" />
      </div>
    ))}
    <span className="sr-only">Loading FAQs...</span>
  </div>
);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;
  const apiError = error as { data?: { message?: string }; message?: string };
  return apiError.data?.message || apiError.message || fallback;
};

export default function FaqView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const initializedExpandedFaq = useRef(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAdminFaqsQuery();
  const [createFaq, { isLoading: isCreating }] =
    useCreateAdminFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] =
    useUpdateAdminFaqMutation();

  const faqs = data || [];
  const isBusy = isLoading && faqs.length === 0;
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (!initializedExpandedFaq.current && faqs.length > 0) {
      initializedExpandedFaq.current = true;
      setExpandedId(faqs[0].id);
    }
  }, [faqs]);

  const toggleFaq = (id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const openAddModal = () => {
    setEditingFaq(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: AdminFaq) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSaveFaq = async (
    payload: AdminFaqMutationRequest,
  ): Promise<boolean> => {
    try {
      if (editingFaq) {
        const response = await updateFaq({
          id: editingFaq.id,
          body: payload,
        }).unwrap();
        toast.success(response.message || "FAQ updated successfully.");
        setExpandedId(editingFaq.id);
      } else {
        const response = await createFaq(payload).unwrap();
        toast.success(response.message || "FAQ added successfully.");
        if (response.data?.id) setExpandedId(response.data.id);
      }
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          editingFaq ? "Failed to update FAQ." : "Failed to add FAQ.",
        ),
      );
      return false;
    }
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          FAQ
        </h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 transition-all hover:bg-[#009cb9] active:scale-[0.98] sm:text-sm"
        >
          <span>Add FAQ</span>
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      <div className="pt-2">
        {isBusy ? (
          <FaqListSkeleton />
        ) : isError ? (
          <div className="rounded-[20px] border border-red-100 bg-white p-10 text-center">
            <p className="text-sm font-semibold text-red-500">
              Failed to load FAQs.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
            >
              Try Again
            </button>
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
            No FAQs have been added.
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = expandedId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`rounded-[20px] border border-slate-100/90 bg-white p-4 shadow-[0_4px_25px_rgba(0,0,0,0.01)] transition-all duration-300 sm:p-5 ${
                    isOpen ? "ring-1 ring-slate-100" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
                    >
                      <h3 className="font-poppins text-sm font-bold leading-snug text-[#0F2E4A] sm:text-base">
                        {faq.title || "N/A"}
                      </h3>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00B2D6] text-white shadow-md shadow-cyan-100">
                        {isOpen ? (
                          <Minus size={15} className="stroke-[3]" />
                        ) : (
                          <Plus size={15} className="stroke-[3]" />
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(faq)}
                      aria-label={`Edit ${faq.title || "FAQ"}`}
                      title="Edit"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-[#E6FAFF] hover:text-[#00B2D6]"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="mt-3.5 border-t border-slate-100/60 pt-3.5 font-sans text-[13px] font-medium leading-relaxed text-slate-500 animate-in fade-in slide-in-from-top-2 duration-300 sm:text-[14px]">
                      {faq.description || "N/A"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddFaqModal
        isOpen={isModalOpen}
        faq={editingFaq}
        isSaving={isSaving}
        onClose={closeModal}
        onSave={handleSaveFaq}
      />
    </div>
  );
}
