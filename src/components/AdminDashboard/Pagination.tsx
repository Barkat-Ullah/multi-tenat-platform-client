"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-end gap-2.5 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 border rounded-xl font-bold text-sm transition-all ${
          currentPage === 1
            ? "border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50"
            : "border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
        }`}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                isActive
                  ? "bg-[#00B2D6] text-white shadow-[0_4px_12px_rgba(0,178,214,0.15)]"
                  : "bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100/80 hover:text-slate-700"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2 border rounded-xl font-bold text-sm transition-all ${
          currentPage === totalPages
            ? "border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50/50"
            : "border-[#00B2D6] text-[#00B2D6] hover:bg-[#E6FAFF] cursor-pointer"
        }`}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
