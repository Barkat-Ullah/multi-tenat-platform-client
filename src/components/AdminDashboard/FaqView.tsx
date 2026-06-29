"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { adminFaqsData, FaqItemData } from "@/app/data/AdminDashboardData";
import AddFaqModal from "./AddFaqModal";
import { toast } from "sonner";

export default function FaqView() {
  const [faqs, setFaqs] = useState<FaqItemData[]>(adminFaqsData);
  const [expandedId, setExpandedId] = useState<string | null>("faq-1"); // First expanded by default matching mockup
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFaq = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSaveFaq = (newFaq: Omit<FaqItemData, "id">) => {
    const created: FaqItemData = {
      id: `faq-${Date.now()}`,
      ...newFaq,
    };
    setFaqs((prev) => [created, ...prev]);
    setExpandedId(created.id); // Expand newly added FAQ automatically
    toast.success("Successfully added new FAQ!");
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          FAQ
        </h1>
        {/* Add FAQ Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
        >
          <span>Add Faq</span>
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-4 pt-2">
        {faqs.map((faq) => {
          const isOpen = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className={`bg-white rounded-[20px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] p-4 sm:p-5 transition-all duration-300 ${
                isOpen ? "ring-1 ring-slate-100" : ""
              }`}
            >
              {/* Question Header Row */}
              <div
                onClick={() => toggleFaq(faq.id)}
                className="flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <h3 className="font-bold text-sm sm:text-base text-[#0F2E4A] font-poppins leading-snug">
                  {faq.question}
                </h3>
                {/* Circular Toggle Button */}
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-[#00B2D6] text-white flex items-center justify-center shadow-md shadow-cyan-100 shrink-0 border-none outline-none transition-transform duration-300"
                >
                  {isOpen ? (
                    <Minus size={15} className="stroke-[3]" />
                  ) : (
                    <Plus size={15} className="stroke-[3]" />
                  )}
                </button>
              </div>

              {/* Answer Panel */}
              {isOpen && (
                <div className="mt-3.5 border-t border-slate-100/60 pt-3.5 text-[13px] sm:text-[14px] text-slate-500 font-medium font-sans leading-relaxed tracking-wide animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add FAQ Modal Overlay */}
      <AddFaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFaq}
      />
    </div>
  );
}
