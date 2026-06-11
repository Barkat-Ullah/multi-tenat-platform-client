"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TaxiFaqData } from "@/app/data/TaxiMedicalData";

interface TaxiFaqSectionProps {
  data: TaxiFaqData;
}

export default function TaxiFaqSection({ data }: TaxiFaqSectionProps) {
  // Set the first item (index 0) open by default to match the mockup
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white poppins border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F2E4A] tracking-tight leading-tight mb-4">
            {data.title}
          </h2>
          <p className="text-[#55697A] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* FAQs List Accordion */}
        <div className="max-w-[860px] mx-auto flex flex-col gap-4">
          {data.faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white border border-[#E5E9EB] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_25px_rgba(0,0,0,0.04)]"
              >
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between text-left px-6 py-5 gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B2D6] focus-visible:ring-offset-2"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-[#0F2E4A] text-[16px] sm:text-[18px] leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className="w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-full bg-[#00B2D6] flex items-center justify-center text-white transition-all duration-300 flex-shrink-0"
                  >
                    {isOpen ? (
                      <Minus className="w-[14px] h-[14px] sm:w-4 sm:h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-[14px] h-[14px] sm:w-4 sm:h-4 stroke-[3]" />
                    )}
                  </div>
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-[14px] sm:text-[15px] text-[#55697A] font-normal leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
