"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Edit3, Eye, RefreshCw, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import {
  useCreatePrivacyPolicyMutation,
  useUpdatePrivacyPolicyMutation,
} from "@/redux/service/admin/privacyApi";
import { useGetPrivacyPoliciesQuery } from "@/redux/service/privacy/privacyApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function PrivacyPolicyView() {
  const [activeTab, setActiveTab] = useState<"preview" | "edit">("preview");
  const [savedContent, setSavedContent] = useState("");
  const [draftContent, setDraftContent] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPrivacyPoliciesQuery();
  const [createPrivacyPolicy, { isLoading: isCreating }] =
    useCreatePrivacyPolicyMutation();
  const [updatePrivacyPolicy, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicyMutation();

  const activePolicy = data || null;
  const isInitialLoading = (isLoading || isFetching) && !data;
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    const content = activePolicy?.text || "";
    setSavedContent(content);
    setDraftContent(content);
  }, [activePolicy]);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 520,
      minHeight: 360,
      placeholder: "Write the privacy policy...",
      toolbarAdaptive: true,
      toolbarSticky: false,
      statusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    [],
  );

  const handleSave = async () => {
    const plainText = draftContent
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();

    if (!plainText) {
      toast.error("Privacy policy content is required.");
      return;
    }

    try {
      const response = activePolicy
        ? await updatePrivacyPolicy({
            id: activePolicy.id,
            text: draftContent,
          }).unwrap()
        : await createPrivacyPolicy({ text: draftContent }).unwrap();

      setSavedContent(draftContent);
      setActiveTab("preview");
      toast.success(
        response.message ||
          (activePolicy
            ? "Privacy Policy updated successfully."
            : "Privacy Policy created successfully."),
      );
    } catch (error) {
      const message =
        (error as { data?: { message?: string }; message?: string })?.data
          ?.message ||
        (error as { message?: string })?.message ||
        "Failed to save Privacy Policy.";
      toast.error(message);
    }
  };

  const handleReset = () => {
    setDraftContent(savedContent);
    toast.info("Unsaved changes were reset.");
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          Privacy Policy
        </h1>

        {activeTab === "edit" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Reset unsaved changes"
              title="Reset unsaved changes"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-cyan-100/50 transition-colors hover:bg-[#009cb9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "preview"
              ? "border-[#00B2D6] text-[#00B2D6]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Eye size={16} />
          Preview
        </button>
        <button
          type="button"
          onClick={() => {
            setDraftContent(savedContent);
            setActiveTab("edit");
          }}
          className={`inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
            activeTab === "edit"
              ? "border-[#00B2D6] text-[#00B2D6]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Edit3 size={16} />
          Edit Policy
        </button>
      </div>

      {isInitialLoading ? (
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-8">
          <div className="h-5 w-56 animate-pulse rounded-full bg-slate-200" />
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className={`h-3 animate-pulse rounded-full bg-slate-100 ${
                index % 3 === 0 ? "w-4/5" : "w-full"
              }`}
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-red-500">
            Failed to load the Privacy Policy.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      ) : activeTab === "preview" ? (
        savedContent ? (
        <article
          className="privacy-policy-content rounded-2xl border border-slate-100 bg-white p-6 text-sm font-medium leading-relaxed text-[#55697A] shadow-[0_4px_20px_rgba(15,46,74,0.01)] sm:p-8 md:p-10"
          dangerouslySetInnerHTML={{ __html: savedContent }}
        />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-500">
            No Privacy Policy has been created.
          </div>
        )
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <JoditEditor
            value={draftContent}
            config={editorConfig}
            onBlur={(content) => setDraftContent(content)}
            onChange={(content) => setDraftContent(content)}
          />
        </div>
      )}

      <style jsx global>{`
        .privacy-policy-content h1,
        .privacy-policy-content h2,
        .privacy-policy-content h3 {
          margin: 1.75rem 0 0.75rem;
          color: #0f2e4a;
          font-weight: 800;
          line-height: 1.3;
        }
        .privacy-policy-content h2 {
          font-size: 1.125rem;
        }
        .privacy-policy-content p {
          margin: 0.75rem 0;
        }
        .privacy-policy-content ul,
        .privacy-policy-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .privacy-policy-content ul {
          list-style: disc;
        }
        .privacy-policy-content ol {
          list-style: decimal;
        }
        .privacy-policy-content li {
          margin: 0.4rem 0;
        }
        .jodit-container:not(.jodit_inline) {
          border: 0 !important;
          border-radius: 12px !important;
        }
        .jodit-toolbar__box:not(:empty) {
          border-radius: 12px 12px 0 0 !important;
        }
      `}</style>
    </div>
  );
}
