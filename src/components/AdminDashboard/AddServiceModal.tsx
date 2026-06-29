"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, UploadCloud } from "lucide-react";
import { StaticImageData } from "next/image";

// Preset fallbacks mapping to match high-quality design
import hgvImg from "@/assets/home/hgv-medical-bus.png";
import taxiImg from "@/assets/home/taxies.png";
import ambulanceImg from "@/assets/home/ambulance-hero-intro.png";
import forkliftImg from "@/assets/home/forklift.png";
import motorsportImg from "@/assets/home/motorsportMedicals.png";
import preEmploymentImg from "@/assets/home/pre-employment.png";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    serviceName: string;
    description: string;
    image: StaticImageData | string;
  }) => void;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  onSave,
}: AddServiceModalProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setName("");
      setDescription("");
      setImageFile(null);
      setErrors({});
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
        if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
        if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Service name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Default presets array if they didn't upload any file
    const fallbackImages = [hgvImg, taxiImg, ambulanceImg, forkliftImg, motorsportImg, preEmploymentImg];
    const finalImage = imageFile || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

    onSave({
      serviceName: name.trim(),
      description: description.trim(),
      image: finalImage,
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
        className="bg-white w-full max-w-[500px] rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100/60">
          <h2 className="text-xl sm:text-[22px] font-extrabold text-[#0F2E4A] font-poppins">
            Add Services
          </h2>
          {/* Close Button - pinkish/red theme matching mockup */}
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FFF1F2] text-[#EC5F5F] hover:bg-[#FCE8E8] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
            aria-label="Close modal"
          >
            <X size={15} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-5 mt-5">
          {/* File Upload Box */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={handleBoxClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`w-full h-[180px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer bg-[#F8FAFC]/70 hover:bg-[#F1F5F9]/70 hover:border-[#00B2D6] transition-all relative overflow-hidden group ${
                imageFile ? "border-[#00B2D6]" : "border-[#CBD5E1]"
              }`}
            >
              {imageFile ? (
                <>
                  <img
                    src={imageFile}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold font-sans">
                      Change Picture
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 flex flex-col items-center">
                  <span className="text-sm sm:text-base font-extrabold text-[#0F2E4A] font-poppins mb-3">
                    Upload picture
                  </span>
                  <UploadCloud size={38} className="text-slate-400 stroke-[1.5] mb-2" />
                  <span className="text-[11px] sm:text-xs text-slate-400 font-medium font-sans">
                    Formats: JPG, PNG, JPEG – Max 5MB each
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service Name Input */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-[#0F2E4A] mb-2 font-poppins">
              Services Name
            </label>
            <input
              type="text"
              placeholder="HGV/Bus Medicals"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm sm:text-[15px] text-[#0F2E4A] placeholder-slate-300 font-semibold transition-all"
            />
            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name}</p>}
          </div>

          {/* Service Description Textarea */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-[#0F2E4A] mb-2 font-poppins">
              Services Description
            </label>
            <textarea
              rows={4}
              placeholder="For HGV & LGV drivers"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm sm:text-[15px] text-[#0F2E4A] placeholder-slate-300 font-semibold transition-all resize-none"
            />
            {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Submit Button (Spans full width matching mockup) */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3.5 bg-[#00B2D6] hover:bg-[#009cb9] rounded-full text-white font-bold text-sm sm:text-base tracking-wide transition-all active:scale-[0.99] shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
