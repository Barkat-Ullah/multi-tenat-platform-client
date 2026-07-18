"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Mail, Send, User as UserIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  type User,
  useGetAllUsersQuery,
  useSendManualEmailMutation,
} from "@/redux/service/admin/userApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;
  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };
  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

const TEMPLATE_PRESETS = [
  {
    title: "Booking Update",
    subject: "Compliance Medicals - Important Booking Information",
    message:
      "<p>Dear Client,</p><p>We are writing to provide an update regarding your medical appointment booking with Compliance Medicals.</p><p>Please log in to your dashboard to review your latest booking details.</p><br/><p>Best regards,<br/><strong>Compliance Medicals Team</strong></p>",
  },
  {
    title: "Medical Record Notice",
    subject: "Compliance Medicals - Medical Certificate Status Update",
    message:
      "<p>Dear Client,</p><p>Your medical record / certificate information has been updated by our clinic team.</p><p>You can view and download your documents anytime from your account dashboard.</p><br/><p>Best regards,<br/><strong>Compliance Medicals Team</strong></p>",
  },
  {
    title: "Account Notice",
    subject: "Compliance Medicals - Account Notification",
    message:
      "<p>Dear Client,</p><p>This is an official communication regarding your account with Compliance Medicals.</p><p>If you have any questions or require assistance, please feel free to reply to this message or contact our support team.</p><br/><p>Best regards,<br/><strong>Compliance Medicals Team</strong></p>",
  },
];

export default function SendClientEmailView() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get("userId") || "";

  const [selectedUserId, setSelectedUserId] = useState<string>(initialUserId);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 340,
      minHeight: 240,
      placeholder: "Write your email message to the client here...",
      toolbarAdaptive: true,
      toolbarSticky: false,
      statusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
    }),
    [],
  );

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetAllUsersQuery({ limit: 1000 });

  const [sendManualEmail, { isLoading: isSending }] = useSendManualEmailMutation();

  const users: User[] = usersResponse?.data || [];
  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    if (initialUserId && users.length > 0) {
      const match = users.find((u) => u.id === initialUserId);
      if (match) {
        setSelectedUserId(match.id);
      }
    }
  }, [initialUserId, users]);

  const handleApplyPreset = (preset: (typeof TEMPLATE_PRESETS)[0]) => {
    setSubject(preset.subject);
    setMessage(preset.message);
    toast.info(`Applied preset: ${preset.title}`);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a target client first.");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter an email subject.");
      return;
    }

    const cleanMessage = message.replace(/<[^>]*>/g, "").trim();
    if (!cleanMessage && !message.includes("<img")) {
      toast.error("Please enter an email message.");
      return;
    }

    try {
      const response = await sendManualEmail({
        id: selectedUserId,
        body: {
          subject: subject.trim(),
          message: message.trim(),
        },
      }).unwrap();

      toast.success(
        response?.message ||
          `Email successfully sent to ${selectedUser?.email || "client"}.`,
      );

      // Reset email fields
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send email to client."));
    }
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          Client Communications
        </h1>
        <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
          Send direct manual email notifications to registered clients and users.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left / Top Column: Client Selector & Info Card */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
            <h2 className="flex items-center gap-2 font-poppins text-base font-bold text-[#0F2E4A]">
              <UserIcon size={18} className="text-[#00B2D6]" />
              Select Recipient Client
            </h2>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Choose the user you wish to contact directly.
            </p>

            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                Target User / Client
              </label>
              {isUsersLoading ? (
                <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
              ) : isUsersError ? (
                <p className="text-xs font-semibold text-red-500">
                  Failed to load users list.
                </p>
              ) : (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-[#0F2E4A] transition-all focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
                >
                  <option value="">-- Select a User --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || "N/A"} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Recipient Details Card */}
            {selectedUser ? (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E6FAFF] font-poppins text-base font-extrabold text-[#00B2D6]">
                    {(selectedUser.fullName || selectedUser.email)[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-poppins text-sm font-extrabold text-[#0F2E4A]">
                      {selectedUser.fullName || "Unnamed User"}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-slate-200/60">
                  <div>
                    <span className="text-slate-400 font-medium">Role:</span>{" "}
                    <span className="font-bold text-[#00B2D6]">
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Phone:</span>{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedUser.phoneNumber || "N/A"}
                    </span>
                  </div>
                  {selectedUser.city && (
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium">Location:</span>{" "}
                      <span className="font-semibold text-slate-700">
                        {selectedUser.city}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-400">
                <Mail size={32} className="stroke-[1.5] text-slate-300 mb-2" />
                <p className="text-xs font-semibold">
                  No recipient selected yet.
                </p>
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-3">
            <h3 className="font-poppins text-sm font-bold text-[#0F2E4A]">
              Quick Email Templates
            </h3>
            <p className="text-xs font-medium text-slate-400">
              Click a preset to quickly fill the subject and message text.
            </p>
            <div className="space-y-2 pt-1">
              {TEMPLATE_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full text-left rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-[#E6FAFF] hover:border-[#00B2D6]/40 transition-all text-xs font-semibold text-[#0F2E4A]"
                >
                  <p className="font-bold text-[#0F2E4A]">{preset.title}</p>
                  <p className="truncate text-slate-400 text-[11px] font-normal mt-0.5">
                    {preset.subject}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Main Column: Compose Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handleSendEmail}
            className="rounded-[24px] border border-slate-100 bg-white p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-poppins text-lg font-extrabold text-[#0F2E4A]">
                Compose Email
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                The message will be delivered directly to the client's email inbox.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#0F2E4A]">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Notice regarding your medical appointment"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs sm:text-sm font-semibold text-[#0F2E4A] placeholder-slate-400 transition-all focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#0F2E4A]">
                Email Body / Message <span className="text-red-500">*</span>
              </label>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <JoditEditor
                  value={message}
                  config={editorConfig}
                  onBlur={(newContent) => setMessage(newContent)}
                  onChange={(newContent) => setMessage(newContent)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSubject("");
                  setMessage("");
                }}
                disabled={isSending}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isSending || !selectedUserId}
                className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-8 py-3 text-xs font-bold text-white transition-all hover:bg-[#009cb9] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-[0_4px_15px_rgba(0,178,214,0.3)] sm:text-sm"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
