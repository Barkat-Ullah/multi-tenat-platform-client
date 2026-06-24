"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { medicalTypesData, otherMedicalsData } from "@/app/data/LandingPageData";

interface Step1MedicalTypeProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  isAccordionOpen: boolean;
  setIsAccordionOpen: (open: boolean) => void;
  onNext: () => void;
  onCardBookNow: (title: string) => void;
}

export default function Step1MedicalType({
  selectedType,
  setSelectedType,
  isAccordionOpen,
  setIsAccordionOpen,
  onNext,
  onCardBookNow
}: Step1MedicalTypeProps) {
  return (
    <div className="w-full">
      {/* Step 1 Header */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F2E4A] tracking-tight leading-tight">
          Select Your Medical Type
        </h1>
        <p className="text-[#55697A] text-sm md:text-base font-medium mt-3">
          Professional driver medicals approved by DVLA. Fast, convenient, and compliant.
        </p>
      </div>

      {/* standard grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {medicalTypesData.map((card, index) => {
          const isSelected = selectedType === card.title;
          return (
            <div
              key={index}
              onClick={() => setSelectedType(card.title)}
              className={`flex flex-row items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all duration-300 group ${
                isSelected 
                  ? "border-[#00B2D6] bg-[#E6FAFF]/30 shadow-md shadow-[#00B2D6]/5 ring-1 ring-[#00B2D6]" 
                  : "border-slate-200/80 bg-white hover:border-[#00B2D6]/30 hover:shadow-sm"
              }`}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col items-start min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-[#0F2E4A] break-words w-full group-hover:text-[#00B2D6] transition-colors leading-tight">
                  {card.title}
                </h3>
                <p className="text-xs text-[#55697A] font-semibold mt-1 mb-3.5 w-full truncate">
                  {card.description}
                </p>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardBookNow(card.title);
                  }}
                  className={`inline-flex items-center justify-between rounded-full pl-3.5 pr-1 py-0.5 text-xs font-bold transition-all duration-300 ${
                    isSelected 
                      ? "bg-[#00B2D6] text-white hover:bg-[#0092B3]" 
                      : "bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#00B2D6] hover:text-white"
                  }`}
                >
                  <span className="mr-2 font-poppins">Book Now</span>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-[#00B2D6]">
                    <ArrowRight size={10} strokeWidth={3} />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* accordion */}
      <div className="w-full mb-12">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className={`w-full text-left p-4 sm:p-5 border rounded-2xl bg-white transition-all duration-300 flex items-center justify-between gap-3 group ${
            isAccordionOpen 
              ? "border-[#00B2D6] shadow-sm" 
              : "border-slate-200/80 hover:border-[#00B2D6]/20 shadow-sm"
          }`}
          aria-expanded={isAccordionOpen}
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#EBFBFF] flex items-center justify-center text-[#00B2D6] flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <ClipboardList size={20} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-[#00B2D6] group-hover:text-[#0092B3] transition-colors leading-tight">
                Other Medicals
              </h4>
              <p className="text-xs sm:text-sm text-[#55697A] font-medium mt-0.5">
                View and book a range of other medical services
              </p>
            </div>
          </div>
          <div className="text-slate-400 p-1 group-hover:text-[#00B2D6] transition-colors">
            {isAccordionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isAccordionOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 sm:p-5 border border-slate-100 rounded-2xl bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherMedicalsData.map((item, index) => {
                  const isSelected = selectedType === item.name;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedType(item.name)}
                      className={`flex items-center justify-between gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border bg-white ${
                        isSelected 
                          ? "border-[#00B2D6] bg-[#E6FAFF]/30 shadow-sm" 
                          : "border-slate-100 hover:border-[#00B2D6]/30"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h5 className="text-xs sm:text-sm font-extrabold text-[#0F2E4A] leading-tight">{item.name}</h5>
                        <p className="text-[11px] text-[#55697A] font-semibold mt-0.5 leading-snug truncate">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardBookNow(item.name);
                        }}
                        className="text-xs font-extrabold text-[#00B2D6] hover:text-[#0092B3] flex items-center gap-0.5 group shrink-0"
                      >
                        <span>Book</span>
                        <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedType && (
        <div className="text-center text-xs sm:text-sm text-[#0F2E4A] font-bold mb-4 animate-pulse">
          Selected: <span className="text-[#00B2D6]">{selectedType}</span>
        </div>
      )}

      <div className="w-full flex justify-center">
        <button
          type="button"
          onClick={onNext}
          className={`w-full max-w-md py-4 rounded-full font-bold text-base transition-all duration-200 ${
            selectedType 
              ? "bg-[#00B2D6] hover:bg-[#0092B3] hover:scale-[1.02] text-white shadow-md shadow-[#00B2D6]/10" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          disabled={!selectedType}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
