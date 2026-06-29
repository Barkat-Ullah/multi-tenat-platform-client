"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AddFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { question: string; answer: string }) => void;
}

export default function AddFaqModal({
  isOpen,
  onClose,
  onSave,
}: AddFaqModalProps) {
  const [mounted, setMounted] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuestion("");
      setAnswer("");
      setErrors({});
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!question.trim()) newErrors.question = "Question is required.";
    if (!answer.trim()) newErrors.answer = "Answer is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      question: question.trim(),
      answer: answer.trim(),
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[480px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins">
            Add New FAQ
          </h2>
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
            aria-label="Close modal"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Inputs Fields */}
        <div className="space-y-5 mt-6">
          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Question
            </label>
            <input
              type="text"
              placeholder="e.g., Who is eligible to apply for an HGV license?"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) setErrors((prev) => ({ ...prev, question: "" }));
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all"
            />
            {errors.question && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.question}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2E4A] mb-1.5 font-sans">
              Answer
            </label>
            <textarea
              rows={4}
              placeholder="Provide a detailed answer..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (errors.answer) setErrors((prev) => ({ ...prev, answer: "" }));
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 font-semibold transition-all resize-none"
            />
            {errors.answer && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.answer}</p>}
          </div>
        </div>

        {/* Submit Action */}
        <div className="mt-8 flex justify-start">
          <button
            type="submit"
            className="px-8 py-3 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-bold text-sm tracking-wide transition-all active:scale-[0.98] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
