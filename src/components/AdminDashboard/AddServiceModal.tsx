"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, X } from "lucide-react";

interface AddServiceModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; file: File }) => Promise<boolean>;
}

export default function AddServiceModal({
  isOpen,
  isSaving,
  onClose,
  onSave,
}: AddServiceModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setErrors({});

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const setSelectedFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Upload a valid image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be 5MB or less." }));
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files?.[0]);
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Service name is required.";
    if (!description.trim()) nextErrors.description = "Description is required.";
    if (!imageFile) nextErrors.image = "Service image is required.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const saved = await onSave({
      title: title.trim(),
      description: description.trim(),
      file: imageFile as File,
    });
    if (saved) onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close add service dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[500px] rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100/60 pb-3">
          <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-[22px]">
            Add Services
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF1F2] text-[#EC5F5F] transition-all hover:bg-[#FCE8E8]"
            aria-label="Close add service dialog"
            title="Close"
          >
            <X size={15} className="stroke-[2.5]" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`relative flex h-[180px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-[#F8FAFC]/70 transition-all hover:border-[#00B2D6] hover:bg-[#F1F5F9]/70 ${
                imagePreview ? "border-[#00B2D6]" : "border-[#CBD5E1]"
              }`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-bold text-white opacity-0 transition-opacity hover:opacity-100">
                    Change Picture
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center p-4 text-center">
                  <span className="font-poppins mb-3 text-sm font-extrabold text-[#0F2E4A] sm:text-base">
                    Upload picture
                  </span>
                  <UploadCloud size={38} className="mb-2 text-slate-400" />
                  <span className="font-sans text-[11px] font-medium text-slate-400 sm:text-xs">
                    Formats: JPG, PNG, JPEG - Max 5MB each
                  </span>
                </span>
              )}
            </button>
            {errors.image && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.image}</p>}
          </div>

          <div>
            <label className="font-poppins mb-2 block text-sm font-bold text-[#0F2E4A] sm:text-base">
              Services Name
            </label>
            <input
              type="text"
              placeholder="HGV/Bus Medicals"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all placeholder:text-slate-300 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-[15px]"
            />
            {errors.title && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="font-poppins mb-2 block text-sm font-bold text-[#0F2E4A] sm:text-base">
              Services Description
            </label>
            <textarea
              rows={4}
              placeholder="For HGV & LGV drivers"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setErrors((prev) => ({ ...prev, description: "" }));
              }}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all placeholder:text-slate-300 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-[15px]"
            />
            {errors.description && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.description}</p>}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-full bg-[#00B2D6] py-3.5 text-sm font-bold tracking-wide text-white shadow-md shadow-cyan-100/50 transition-all hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
          >
            {isSaving ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
