"use client";

import React, { useEffect, useRef, useState } from "react";
import { Collapse } from "antd";
import { Plus, Minus } from "lucide-react";
import { useGetFaqsQuery } from "@/redux/service/faq/faqApi";

export default function FaqAccordionSection() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const initializedActiveFaq = useRef(false);
  const { data, isLoading, isError, refetch } = useGetFaqsQuery();
  const faqs = data || [];

  useEffect(() => {
    if (!initializedActiveFaq.current && faqs.length > 0) {
      initializedActiveFaq.current = true;
      setActiveKey(faqs[0].id);
    }
  }, [faqs]);

  return (
    <section className="py-16 sm:py-20 bg-white poppins">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#55697A] text-sm sm:text-base font-semibold mt-2">
            Common questions and answers about our services, medicals, and requirements.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4" role="status" aria-label="Loading FAQs">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="flex min-h-[64px] animate-pulse items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4"
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
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/30 p-10 text-center">
            <p className="text-sm font-semibold text-red-500">
              Failed to load FAQs.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#009cb9]"
            >
              Try Again
            </button>
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm font-semibold text-slate-500">
            No FAQs are available.
          </div>
        ) : (
          <div className="space-y-4">
          {faqs.map((faq) => {
            const isPanelActive = activeKey === faq.id;

            const collapseItems = [
              {
                key: faq.id,
                label: (
                  <span className={`text-[#0F2E4A] text-sm sm:text-base leading-snug transition-all ${
                    isPanelActive ? "font-bold" : "font-medium"
                  }`}>
                    {faq.title || "N/A"}
                  </span>
                ),
                children: (
                  <p className="text-[#55697A] text-xs sm:text-sm font-semibold leading-relaxed pr-2 sm:pr-4">
                    {faq.description || "N/A"}
                  </p>
                ),
                style: { border: "none" }
              }
            ];

            return (
              <div
                key={faq.id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isPanelActive
                    ? "border-[#00B2D6]/30 shadow-[0_8px_30px_rgba(0,178,214,0.03)]"
                    : "border-slate-200/80 hover:border-[#00B2D6]/20 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.015)]"
                }`}
              >
                <Collapse
                  activeKey={isPanelActive ? [faq.id] : []}
                  onChange={() => setActiveKey(isPanelActive ? null : faq.id)}
                  bordered={false}
                  expandIconPosition="end"
                  expandIcon={({ isActive }) => (
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-all duration-200 shrink-0 ${
                        isActive ? "bg-[#00B2D6]" : "bg-[#00B2D6]"
                      }`}
                    >
                      {isActive ? (
                        <Minus className="h-4 w-4 stroke-[3]" />
                      ) : (
                        <Plus className="h-4 w-4 stroke-[3]" />
                      )}
                    </div>
                  )}
                  items={collapseItems}
                  className="bg-transparent"
                />
              </div>
            );
          })}
          </div>
        )}

      </div>
    </section>
  );
}
