"use client";

import React, { useState } from "react";
import { Collapse } from "antd";
import { Plus, Minus } from "lucide-react";
import { faqItems } from "@/app/data/FaqPageData";

export default function FaqAccordionSection() {
  // Store the active index to manage custom animations and highlight styles
  const [activeKey, setActiveKey] = useState<string | null>("0");

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

        {/* FAQs List using individual Ant Design Collapse components for separate card spacing */}
        <div className="space-y-4">
          {faqItems.map((faq, index) => {
            const isPanelActive = activeKey === String(index);

            // Ant Design Collapse items array
            const collapseItems = [
              {
                key: String(index),
                label: (
                  <span className={`text-[#0F2E4A] text-sm sm:text-base leading-snug transition-all ${
                    isPanelActive ? "font-bold" : "font-medium"
                  }`}>
                    {faq.question}
                  </span>
                ),
                children: (
                  <p className="text-[#55697A] text-xs sm:text-sm font-semibold leading-relaxed pr-2 sm:pr-4">
                    {faq.answer}
                  </p>
                ),
                style: { border: "none" }
              }
            ];

            return (
              <div
                key={index}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isPanelActive
                    ? "border-[#00B2D6]/30 shadow-[0_8px_30px_rgba(0,178,214,0.03)]"
                    : "border-slate-200/80 hover:border-[#00B2D6]/20 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.015)]"
                }`}
              >
                <Collapse
                  activeKey={isPanelActive ? [String(index)] : []}
                  onChange={() => setActiveKey(isPanelActive ? null : String(index))}
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

      </div>
    </section>
  );
}
