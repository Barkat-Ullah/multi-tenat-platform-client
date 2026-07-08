"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { MapPin, UploadCloud, X } from "lucide-react";
import type { CreateAdminLocationRequest } from "@/redux/service/admin/locationsApi";

interface AddLocationModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: CreateAdminLocationRequest) => Promise<boolean>;
}

const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-gradient-to-br from-slate-100 via-cyan-50 to-slate-100" />
  ),
});

export default function AddLocationModal({
  isOpen,
  isSaving,
  onClose,
  onSave,
}: AddLocationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
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
    setLocationName("");
    setLatitude("");
    setLongitude("");
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

  const selectedLatitude = useMemo(() => {
    const value = Number(latitude.trim());
    return latitude.trim() && Number.isFinite(value) ? value : null;
  }, [latitude]);

  const selectedLongitude = useMemo(() => {
    const value = Number(longitude.trim());
    return longitude.trim() && Number.isFinite(value) ? value : null;
  }, [longitude]);

  const setSelectedFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, image: "Upload a valid image file." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: "Image must be 5MB or less." }));
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((current) => ({ ...current, image: "" }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0]);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSelectedFile(event.dataTransfer.files?.[0]);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((current) => ({ ...current, image: "" }));
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const lat = Number(latitude.trim());
    const lng = Number(longitude.trim());

    if (!locationName.trim()) nextErrors.locationName = "Location name is required.";
    if (!latitude.trim() || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      nextErrors.latitude = "Enter a valid latitude between -90 and 90.";
    }
    if (!longitude.trim() || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      nextErrors.longitude = "Enter a valid longitude between -180 and 180.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const saved = await onSave({
      locationName: locationName.trim(),
      lat,
      lng,
      image: imageFile,
    });
    if (saved) onClose();
  };

  const handleMapSelect = (lat: number, lng: number) => {
    setLatitude(String(lat));
    setLongitude(String(lng));
    setErrors((current) => ({ ...current, latitude: "", longitude: "" }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close add location dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-slate-100/80 pb-4">
          <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A] sm:text-2xl">
            Add New Location
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add location dialog"
            title="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="location-name" className="mb-2 block text-sm font-bold text-[#0F2E4A]">
              Location Name
            </label>
            <input
              id="location-name"
              type="text"
              value={locationName}
              onChange={(event) => {
                setLocationName(event.target.value);
                setErrors((current) => ({ ...current, locationName: "" }));
              }}
              placeholder="e.g., West Rampura"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
            />
            {errors.locationName && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.locationName}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#0F2E4A]">
              Location Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`relative flex h-[170px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-[#F8FAFC]/70 transition-all hover:border-[#00B2D6] hover:bg-[#F1F5F9]/70 ${
                imagePreview ? "border-[#00B2D6]" : "border-[#CBD5E1]"
              }`}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Location preview"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-bold text-white opacity-0 transition-opacity hover:opacity-100">
                    Change Image
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center p-4 text-center">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6]">
                    <UploadCloud size={22} />
                  </span>
                  <span className="font-poppins text-sm font-extrabold text-[#0F2E4A]">
                    Upload location image
                  </span>
                  <span className="mt-1 text-xs font-semibold text-slate-400">
                    JPG, PNG, JPEG - Max 5MB
                  </span>
                </span>
              )}
            </button>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <MapPin size={13} className="text-[#00B2D6]" />
                Optional image for public location cards.
              </p>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs font-bold text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            {errors.image && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.image}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location-latitude" className="mb-2 block text-sm font-bold text-[#0F2E4A]">Latitude</label>
              <input
                id="location-latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(event) => {
                  setLatitude(event.target.value);
                  setErrors((current) => ({ ...current, latitude: "" }));
                }}
                placeholder="23.7645867"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
              />
              {errors.latitude && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.latitude}</p>}
            </div>
            <div>
              <label htmlFor="location-longitude" className="mb-2 block text-sm font-bold text-[#0F2E4A]">Longitude</label>
              <input
                id="location-longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(event) => {
                  setLongitude(event.target.value);
                  setErrors((current) => ({ ...current, longitude: "" }));
                }}
                placeholder="90.4469565"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-[#0F2E4A] placeholder:text-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
              />
              {errors.longitude && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.longitude}</p>}
            </div>
          </div>

          <div className="h-[230px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
            <LocationPickerMap
              latitude={selectedLatitude}
              longitude={selectedLongitude}
              onSelect={handleMapSelect}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-7 rounded-full bg-[#00B2D6] px-8 py-3 text-sm font-bold text-white shadow-md shadow-cyan-100/50 hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Location"}
        </button>
      </form>
    </div>,
    document.body,
  );
}
