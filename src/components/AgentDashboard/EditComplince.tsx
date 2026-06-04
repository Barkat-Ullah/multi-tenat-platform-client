/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { appAlert } from "@/utils/appAlert";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useUploadComplianceDocumentsMutation } from "@/redux/service/agent/propertiesApi";

type DocKey =
  | "energyCertificate"
  | "urbanCadastral"
  | "ownershipDeed"
  | "leaseAgreement";

type DocState = Record<DocKey, File | null>;

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

function getErrorMessage(err: unknown, fallback = "Failed to submit compliance documents.") {
  if (typeof err === "object" && err !== null) {
    if ("data" in err) {
      const fetchError = err as FetchBaseQueryError & { data?: { message?: string } };
      return fetchError.data?.message || fallback;
    }
    if ("message" in err) {
      const serializedError = err as SerializedError;
      return serializedError.message || fallback;
    }
  }
  return fallback;
}

export default function EditCompliance({ propertyData }: any) {
  const [uploadCompliance, { isLoading }] = useUploadComplianceDocumentsMutation();

  const [propertyId, setPropertyId] = useState<string>("");
  const [files, setFiles] = useState<DocState>({
    energyCertificate: null,
    urbanCadastral: null,
    ownershipDeed: null,
    leaseAgreement: null,
  });

  const [errors, setErrors] = useState<Partial<Record<DocKey | "propertyId", string>>>({}); // Separate hidden inputs for each section
  const inputRefs = useRef<Record<DocKey, HTMLInputElement | null>>({
    energyCertificate: null,
    urbanCadastral: null,
    ownershipDeed: null,
    leaseAgreement: null,
  });

  // ✅ DEBUG: Log incoming data
  console.log("🚀 EditCompliance - propertyData:", propertyData);
  console.log("🚀 complianceDocuments:", propertyData?.data?.complianceDocuments);

  // ✅ PERFECT: Populate with existing compliance data (EDIT MODE)
  useEffect(() => {
    if (propertyData?.data) {
      const data = propertyData.data;
      
      // Get property ID from API (not localStorage)
      setPropertyId(data.id || "");
      console.log("✅ Property ID set to:", data.id);

      // Display existing compliance documents (readonly preview)
      if (data.complianceDocuments) {
        console.log("✅ Compliance documents found:", data.complianceDocuments);
        console.log("✅ All compliance data processed successfully!");
      } else {
        console.log("⚠️ No complianceDocuments found in property data");
      }
    } else {
      console.log("❌ No property data available yet");
    }
  }, [propertyData?.data]); // ✅ Use nested property as dependency

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) return "Only jpg, png, webp, or pdf files are allowed.";
    if (file.size > MAX_FILE_SIZE) return "File size must be less than or equal to 25MB.";
    return null;
  }

  function setDocFile(key: DocKey, file: File | null) {
    if (!file) {
      setFiles((prev) => ({ ...prev, [key]: null }));
      setErrors((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    const validationMsg = validateFile(file);
    if (validationMsg) {
      setErrors((prev) => ({ ...prev, [key]: validationMsg }));
      return;
    }

    setErrors((prev) => ({ ...prev, [key]: "" }));
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  function onBrowse(key: DocKey) {
    inputRefs.current[key]?.click();
  }

  function onFileChange(key: DocKey, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setDocFile(key, file);
    e.target.value = ""; // allow reselect same file
  }

  function onDrop(key: DocKey, e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0] || null;
    setDocFile(key, file);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function removeFile(key: DocKey) {
    setDocFile(key, null);
  }

  async function handleSubmit() {
    const nextErrors: typeof errors = {};

    if (!propertyId.trim()) nextErrors.propertyId = "Property ID is required.";

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const formData = new FormData();
    formData.append("propertyId", propertyId.trim());

    // ✅ These keys must match backend exactly (as Postman)
    if (files.energyCertificate) formData.append("energyCertificate", files.energyCertificate);
    if (files.urbanCadastral) formData.append("urbanCadastral", files.urbanCadastral);
    if (files.ownershipDeed) formData.append("ownershipDeed", files.ownershipDeed);
    if (files.leaseAgreement) formData.append("leaseAgreement", files.leaseAgreement);

    // Debug exactly like your previous page
    console.log("=== Compliance FormData entries ===");
    for (const [k, v] of formData.entries()) {
      console.log(k, v instanceof File ? `FILE: ${v.name} (${v.type})` : v);
    }
    console.log("=== End Compliance FormData entries ===");

    try {
      const res = await uploadCompliance(formData).unwrap();
      appAlert.fire({
        title: "Success!",
        text: res?.message || "Compliance documents uploaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      appAlert.fire({
        title: "Error!",
        text: msg,
        icon: "error",
        confirmButtonText: "OK",
      });
      console.log("Compliance submit error:", err);
    }
  }

  // ✅ Display existing documents (readonly preview)
  const ExistingDocumentsPreview = () => {
    const compliance = propertyData?.data?.complianceDocuments;
    if (!compliance) return null;

    const docMap = [
      { key: "energyCertificate", label: "Energy Certificate", value: compliance.energyCertificate },
      { key: "urbanCadastral", label: "Urban/Cadastral", value: compliance.urbanCadastral },
      { key: "ownershipDeed", label: "Ownership Deed", value: compliance.ownershipDeed },
      { key: "leaseAgreement", label: "Lease Agreement", value: compliance.leaseAgreement },
    ];

    const hasAnyDoc = docMap.some(d => d.value);
    if (!hasAnyDoc) return null;

    return (
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Existing Documents</h3>
        <div className="space-y-3">
          {docMap.map((doc) => (
            doc.value && (
              <div key={doc.key} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">{doc.label}</p>
                    <p className="text-sm text-gray-600 truncate max-w-md">{doc.value}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Uploaded
                </span>
              </div>
            )
          ))}
        </div>
        <p className="mt-4 text-sm text-blue-800 italic">
          Note: To replace a document, upload a new file below. The old file will be replaced.
        </p>
      </div>
    );
  };

  const UploadBox = ({
    title,
    keyName,
    description,
  }: {
    title: string;
    keyName: DocKey;
    description?: string;
  }) => {
    const file = files[keyName];

    return (
      <div className="border border-[#D4D4D4] rounded-lg p-6 bg-white">
        <h3 className="text-sm md:text-[18px] font-semibold text-[#2B2B2B] mb-4">
          {title}
        </h3>

        {/* Hidden file input */}
        <input
          ref={(el) => {
            inputRefs.current[keyName] = el;
          }}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={(e) => onFileChange(keyName, e)}
          className="hidden"
        />

        <div
          onDrop={(e) => onDrop(keyName, e)}
          onDragOver={onDragOver}
          onClick={() => onBrowse(keyName)}
          className="border-2 flex items-center flex-col border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="24"
            viewBox="0 0 26 24"
            fill="none"
          >
            <path
              d="M17.3339 15.9995L13.0006 11.9995M13.0006 11.9995L8.66723 15.9995M13.0006 11.9995V20.9995M22.0897 18.3895C23.1463 17.8578 23.9811 17.0164 24.4621 15.9981C24.9431 14.9799 25.0431 13.8427 24.7463 12.7662C24.4494 11.6896 23.7727 10.735 22.8228 10.0529C21.8729 9.37088 20.704 9.00023 19.5006 8.99949H18.1356C17.8077 7.82874 17.1965 6.74183 16.348 5.82049C15.4995 4.89915 14.4358 4.16735 13.2368 3.6801C12.0379 3.19286 10.7348 2.96285 9.42569 3.00738C8.11656 3.0519 6.83539 3.3698 5.67851 3.93716C4.52163 4.50453 3.51914 5.3066 2.74641 6.28308C1.97368 7.25956 1.45081 8.38503 1.21713 9.57489C0.983443 10.7647 1.04501 11.988 1.39722 13.1528C1.74942 14.3175 2.38308 15.3934 3.25057 16.2995"
              stroke="#2B2B2B"
              strokeWidth="1.40075"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="block text-sm md:text-[18px] font-normal text-[#2B2B2B] mb-2 mt-2">
            Drop file or browse
          </p>

          <p className="block text-xs md:text-sm font-normal text-[#BDBDBD] mb-3">
            Format: .jpeg, .png, .webp, .pdf • Max size: 25 MB
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBrowse(keyName);
            }}
            className="px-4 py-2 bg-[#004E60] text-white rounded-lg text-sm md:text-[18px] font-medium transition-colors"
          >
            Browse Files
          </button>

          {file && (
            <div className="mt-4 w-full flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2">
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
                <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(keyName);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm md:text-[18px] font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {!!errors[keyName] && (
            <p className="mt-3 text-sm text-red-600">{errors[keyName]}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="font-inter">
      {/* Header */}
      <div className="text-center mb-7">
        <h2 className="text-2xl md:text-3xl font-lato font-semibold text-[#223355] mb-2">
          Compliance & Documentation
        </h2>
        <p className="text-[#003944] text-sm md:text-[18px] font-medium mb-8">
          Provide regulatory compliance records and supporting documents. This
          information ensures regulatory adherence and protects against potential
          legal risks.
        </p>
      </div>

      {/* Property ID display */}
      {propertyId && (
        <p className="text-sm text-gray-600 mb-4">
          Property ID: <span className="font-medium">{propertyId}</span>
        </p>
      )}

      {/* Existing Documents Preview */}
      <ExistingDocumentsPreview />

      {/* Upload Sections */}
      <div className="space-y-6">
        <UploadBox title="Energy Certificate (APE)" keyName="energyCertificate" />
        <UploadBox title="Urban/Cadastral Compliance" keyName="urbanCadastral" />
        <UploadBox title="Ownership Deed" keyName="ownershipDeed" />
        <UploadBox title="Lease Agreement" keyName="leaseAgreement" />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-6">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleSubmit}
          className="px-6 py-3 bg-[#004E60] text-white rounded-lg text-sm md:text-[18px] font-medium transition-colors disabled:opacity-60"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}