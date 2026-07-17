"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Paperclip, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/AdminDashboard/Pagination";
import {
  SupportTicketAttachment,
  SupportTicket,
  SupportTicketAnalytics,
  SupportTicketMessage,
  useCreateSupportTicketMessageMutation,
  useCreateSupportTicketMutation,
  useGetSupportTicketAnalyticsQuery,
  useGetSupportTicketQuery,
  useGetSupportTicketsQuery,
  useUpdateSupportTicketStatusMutation,
} from "@/redux/service/support/supportTicketsApi";

type SupportCenterMode = "admin" | "requester";

interface SupportCenterViewProps {
  mode?: SupportCenterMode;
}

const PAGE_LIMIT = 15;

const statusOptions = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const categoryOptions = [
  { value: "OTHER", label: "Other" },
  { value: "ACCOUNT_ISSUE", label: "Account Issue" },
  { value: "BOOKING_ISSUE", label: "Booking Issue" },
  { value: "MEDICAL_RECORD_ISSUE", label: "Medical Record Issue" },
  { value: "PAYMENT_ISSUE", label: "Payment Issue" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const statusClasses: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-700",
};

const priorityClasses: Record<string, string> = {
  LOW: "bg-blue-100 text-blue-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-600",
  URGENT: "bg-rose-100 text-rose-700",
};

const normalizeEnum = (value?: string | null, fallback = "N/A") =>
  value
    ? value
        .replace(/-/g, "_")
        .trim()
        .toUpperCase()
    : fallback;

const formatLabel = (value?: string | null, fallback = "N/A") => {
  if (!value) return fallback;
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getTicketId = (ticket?: SupportTicket | null) => ticket?.id || ticket?._id || "";

const getTicketCode = (ticket: SupportTicket) =>
  ticket.ticketNo || ticket.ticketNumber || ticket.code || `TKT-${getTicketId(ticket).slice(-5).toUpperCase()}`;

const getTicketSubject = (ticket?: SupportTicket | null) =>
  ticket?.subject || ticket?.title || "Untitled support ticket";

const getTicketCustomer = (ticket?: SupportTicket | null) =>
  ticket?.createdBy?.fullName ||
  ticket?.createdBy?.name ||
  ticket?.user?.fullName ||
  ticket?.user?.name ||
  ticket?.requester?.fullName ||
  ticket?.requester?.name ||
  "Customer";

const getTicketCustomerId = (ticket?: SupportTicket | null) =>
  ticket?.createdBy?.id ||
  ticket?.createdBy?._id ||
  ticket?.user?.id ||
  ticket?.user?._id ||
  ticket?.requester?.id ||
  ticket?.requester?._id ||
  ticket?.createdById ||
  ticket?.userId ||
  "";

const getMessageId = (message: SupportTicketMessage, index: number) =>
  message.id || message._id || `${index}`;

const getMessageText = (message: SupportTicketMessage) =>
  message.message || message.text || message.description || "";

const getMessageAuthor = (message: SupportTicketMessage) =>
  message.sender?.fullName ||
  message.sender?.name ||
  message.user?.fullName ||
  message.user?.name ||
  message.createdBy?.fullName ||
  message.createdBy?.name ||
  "Support";

const getMessageAuthorId = (message: SupportTicketMessage) =>
  message.sender?.id ||
  message.sender?._id ||
  message.user?.id ||
  message.user?._id ||
  message.createdBy?.id ||
  message.createdBy?._id ||
  message.senderId ||
  message.userId ||
  "";

const getMessageFiles = (message: SupportTicketMessage) => {
  const files = message.files ?? message.attachments;
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

const getAttachmentUrl = (file: SupportTicketAttachment | string) => {
  if (typeof file === "string") return file;
  return file.url || file.fileUrl || file.secureUrl || file.path || "";
};

const getAttachmentName = (file: SupportTicketAttachment | string) => {
  if (typeof file !== "string") {
    return (
      file.originalName ||
      file.fileName ||
      file.name ||
      getAttachmentUrl(file).split("/").pop() ||
      "Attachment"
    );
  }

  return file.split("?")[0].split("/").pop() || "Attachment";
};

const isImageAttachment = (file: SupportTicketAttachment | string) => {
  if (typeof file !== "string") {
    const mimeType = file.mimetype || file.mimeType || "";
    if (mimeType.startsWith("image/")) return true;
  }

  return /\.(avif|gif|jpe?g|png|webp|bmp|svg)$/i.test(getAttachmentUrl(file).split("?")[0]);
};

const formatDateTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const getAnalyticsCount = (
  analytics: SupportTicketAnalytics | undefined,
  keys: Array<keyof SupportTicketAnalytics>,
  fallback: number,
) => {
  for (const key of keys) {
    const value = analytics?.[key];
    if (typeof value === "number") return value;
  }
  return fallback;
};

const getStatusDistributionCount = (
  analytics: SupportTicketAnalytics | undefined,
  statuses: string[],
  fallback: number,
) => {
  const distribution = analytics?.statusDistribution;
  if (!distribution) return fallback;

  return statuses.reduce((total, status) => {
    return total + (distribution[status] || distribution[status.toLowerCase()] || 0);
  }, 0);
};

const getTotalFromDistribution = (analytics: SupportTicketAnalytics | undefined) => {
  const distribution = analytics?.statusDistribution;
  if (!distribution) return undefined;
  return Object.values(distribution).reduce((total, value) => total + value, 0);
};

const SupportCenterSkeleton = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-[120px] animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[430px_minmax(0,1fr)]">
      <div className="h-[390px] animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-[520px] animate-pulse rounded-2xl bg-slate-100" />
    </div>
  </div>
);

export default function SupportCenterView({ mode = "admin" }: SupportCenterViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [reply, setReply] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "OTHER",
    priority: "MEDIUM",
  });

  const replyFileInputRef = useRef<HTMLInputElement | null>(null);
  const isRequesterMode = mode === "requester";

  const {
    data: ticketsResponse,
    isLoading: isTicketsLoading,
    isError: isTicketsError,
    refetch: refetchTickets,
  } = useGetSupportTicketsQuery(
    { page: currentPage, limit: PAGE_LIMIT },
    {
      pollingInterval: 30000,
      skipPollingIfUnfocused: true,
    },
  );

  const { data: analyticsResponse } = useGetSupportTicketAnalyticsQuery(undefined, {
    skip: isRequesterMode,
    pollingInterval: 60000,
    skipPollingIfUnfocused: true,
  });
  const { data: selectedTicketResponse, isFetching: isTicketDetailsFetching } =
    useGetSupportTicketQuery(selectedTicketId, {
      skip: !selectedTicketId,
      pollingInterval: selectedTicketId ? 10000 : 0,
      skipPollingIfUnfocused: true,
    });

  const [createTicket, { isLoading: isCreatingTicket }] = useCreateSupportTicketMutation();
  const [sendMessage, { isLoading: isSendingMessage }] = useCreateSupportTicketMessageMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSupportTicketStatusMutation();

  const tickets = ticketsResponse?.data ?? [];
  const selectedTicket =
    selectedTicketResponse?.data ||
    tickets.find((ticket) => getTicketId(ticket) === selectedTicketId) ||
    tickets[0] ||
    null;

  useEffect(() => {
    if (tickets.length === 0) {
      setSelectedTicketId("");
      return;
    }

    if (!selectedTicketId || !tickets.some((ticket) => getTicketId(ticket) === selectedTicketId)) {
      setSelectedTicketId(getTicketId(tickets[0]));
    }
  }, [selectedTicketId, tickets]);

  const filteredTickets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return tickets;

    return tickets.filter((ticket) =>
      [
        getTicketCode(ticket),
        getTicketSubject(ticket),
        formatLabel(ticket.status),
        formatLabel(ticket.priority),
        formatLabel(ticket.category),
        getTicketCustomer(ticket),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [tickets, searchTerm]);

  const totalTicketsFallback = ticketsResponse?.meta?.total ?? tickets.length;
  const analytics = analyticsResponse?.data;
  const analyticsTotal = getTotalFromDistribution(analytics);
  const pendingFallback = tickets.filter((ticket) =>
    ["OPEN", "IN_PROGRESS"].includes(normalizeEnum(ticket.status)),
  ).length;
  const resolvedFallback = tickets.filter((ticket) => normalizeEnum(ticket.status) === "RESOLVED").length;

  const visibleStats = [
    {
      label: "Total Support Ticket",
      value: getAnalyticsCount(
        analytics,
        ["total", "totalTicket", "totalTickets", "totalSupportTicket"],
        analyticsTotal ?? totalTicketsFallback,
      ),
    },
    {
      label: "Pending Support Ticket",
      value: getStatusDistributionCount(
        analytics,
        ["OPEN", "IN_PROGRESS"],
        getAnalyticsCount(
          analytics,
          ["pending", "pendingTicket", "pendingSupportTicket", "open", "inProgress", "in_progress"],
          pendingFallback,
        ),
      ),
    },
    {
      label: "Resolved",
      value: getStatusDistributionCount(
        analytics,
        ["RESOLVED", "CLOSED"],
        getAnalyticsCount(analytics, ["resolved", "resolvedTicket"], resolvedFallback),
      ),
    },
  ];

  const totalPages = Math.max(
    1,
    ticketsResponse?.meta?.totalPages ||
      ticketsResponse?.meta?.totalPage ||
      Math.ceil(totalTicketsFallback / PAGE_LIMIT),
  );

  const messages: SupportTicketMessage[] = selectedTicket
    ? selectedTicket.messages?.length
      ? selectedTicket.messages
      : selectedTicket.ticketMessages?.length
        ? selectedTicket.ticketMessages
        : selectedTicket.description
          ? [
              {
                id: `${getTicketId(selectedTicket)}-description`,
                message: selectedTicket.description,
                createdAt: selectedTicket.createdAt,
                sender: selectedTicket.createdBy || selectedTicket.user || selectedTicket.requester || undefined,
              },
            ]
          : []
    : [];

  const handleCreateTicket = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error("Please enter the ticket subject and description.");
      return;
    }

    try {
      const response = await createTicket({
        subject: newTicket.subject.trim(),
        description: newTicket.description.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
      }).unwrap();

      toast.success(response?.message || "Support ticket created successfully.");
      setIsCreateModalOpen(false);
      setNewTicket({ subject: "", description: "", category: "OTHER", priority: "MEDIUM" });
      const createdTicketId = getTicketId(response.data);
      if (createdTicketId) setSelectedTicketId(createdTicketId);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create support ticket.");
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedTicket) return;
    const id = getTicketId(selectedTicket);
    if (!id) return;

    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Ticket status updated.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ticket status.");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket) return;
    const id = getTicketId(selectedTicket);
    if (!id || !reply.trim()) return;

    try {
      await sendMessage({ id, message: reply.trim(), files: replyFiles }).unwrap();
      toast.success("Reply sent.");
      setReply("");
      setReplyFiles([]);
      if (replyFileInputRef.current) replyFileInputRef.current.value = "";
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reply.");
    }
  };

  const showInitialSkeleton = isTicketsLoading && !ticketsResponse;
  const showTicketDetailsSkeleton =
    isTicketDetailsFetching && !selectedTicketResponse?.data && messages.length === 0;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
          Support Center
        </h1>
        {isRequesterMode && (
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#00B2D6] px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,178,214,0.18)] transition-colors hover:bg-[#0092B3] sm:text-base"
          >
            New Ticket
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#00B2D6]">
              <Plus className="h-4 w-4" />
            </span>
          </button>
        )}
      </div>

      {showInitialSkeleton ? (
        <SupportCenterSkeleton />
      ) : isTicketsError ? (
        <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
          <p className="text-sm font-semibold text-red-500">Failed to load support tickets.</p>
          <button
            type="button"
            onClick={() => refetchTickets()}
            className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-sm font-bold text-white hover:bg-[#0092B3]"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_20px_rgba(15,46,74,0.03)]"
              >
                <p className="text-sm font-semibold text-[#0F2E4A] sm:text-base">{stat.label}</p>
                <p className="mt-8 text-3xl font-extrabold text-slate-950">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[430px_minmax(0,1fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,46,74,0.03)]">
              <div className="mb-3 flex gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4">
                  <Search className="h-5 w-5 shrink-0 text-[#00B2D6]" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search ticket"
                    className="h-14 min-w-0 flex-1 bg-transparent text-base font-medium text-[#0F2E4A] outline-none placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Filter tickets"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:text-[#00B2D6]"
                >
                  <SlidersHorizontal className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-3">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const status = normalizeEnum(ticket.status, "OPEN");
                    const priority = normalizeEnum(ticket.priority, "LOW");
                    return (
                      <button
                        key={getTicketId(ticket)}
                        type="button"
                        onClick={() => setSelectedTicketId(getTicketId(ticket))}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${
                          selectedTicket && getTicketId(selectedTicket) === getTicketId(ticket)
                            ? "border-[#00B2D6] bg-[#F2FCFF]"
                            : "border-slate-200 bg-white hover:border-[#00B2D6]/50"
                        }`}
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <span className="text-xs font-semibold text-slate-500">{getTicketCode(ticket)}</span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status] || "bg-slate-100 text-slate-600"}`}>
                            {formatLabel(status)}
                          </span>
                        </div>
                        <h2 className="line-clamp-2 text-sm font-extrabold text-slate-950">{getTicketSubject(ticket)}</h2>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <span className={`rounded px-2 py-1 font-bold ${priorityClasses[priority] || "bg-slate-100 text-slate-600"}`}>
                            {formatLabel(priority).toUpperCase()}
                          </span>
                          <span>·</span>
                          <span>{formatRelativeTime(ticket.createdAt) || formatDateTime(ticket.createdAt) || "N/A"}</span>
                          {typeof ticket._count?.messages === "number" && (
                            <>
                              <span>·</span>
                              <span>{ticket._count.messages} messages</span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm font-semibold text-slate-500">
                    No support tickets found.
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(15,46,74,0.03)] sm:p-5">
              {selectedTicket ? (
                <>
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold text-blue-600">{getTicketCode(selectedTicket)}</p>
                        <h2 className="mt-2 text-xl font-extrabold text-slate-950">{getTicketSubject(selectedTicket)}</h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[normalizeEnum(selectedTicket.status, "OPEN")] || "bg-slate-100 text-slate-600"}`}>
                            {formatLabel(selectedTicket.status || "OPEN")}
                          </span>
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClasses[normalizeEnum(selectedTicket.priority, "LOW")] || "bg-slate-100 text-slate-600"}`}>
                            {formatLabel(selectedTicket.priority || "LOW").toUpperCase()}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {formatLabel(selectedTicket.category || "OTHER")}
                          </span>
                        </div>
                      </div>
                      <div className="text-left text-xs font-medium text-slate-500 lg:text-right">
                        <p>Created {formatRelativeTime(selectedTicket.createdAt) || formatDateTime(selectedTicket.createdAt) || "N/A"}</p>
                        <p>
                          By <span className="font-bold text-slate-700">{getTicketCustomer(selectedTicket)}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isRequesterMode && (
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 py-4">
                      <span className="font-semibold text-slate-700">Status:</span>
                      <select
                        value={normalizeEnum(selectedTicket.status, "OPEN")}
                        onChange={(event) => handleStatusChange(event.target.value)}
                        disabled={isUpdatingStatus}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 outline-none disabled:opacity-60"
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {showTicketDetailsSkeleton ? (
                    <div className="space-y-3 py-5">
                      <div className="h-12 w-2/3 animate-pulse rounded-xl bg-slate-100" />
                      <div className="ml-auto h-12 w-2/3 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      {messages.map((message, index) => {
                        const author = getMessageAuthor(message);
                        const customerId = getTicketCustomerId(selectedTicket);
                        const authorId = getMessageAuthorId(message);
                        const isCustomer =
                          (authorId && customerId && authorId === customerId) ||
                          author === getTicketCustomer(selectedTicket);
                        const alignRight = isRequesterMode ? isCustomer : !isCustomer;
                        const files = getMessageFiles(message);

                        return (
                          <div
                            key={getMessageId(message, index)}
                            className={`flex flex-col ${alignRight ? "items-end" : "items-start"}`}
                          >
                            {(isRequesterMode || !alignRight) && (
                              <p className="mb-2 text-xs font-semibold text-slate-500">
                                {author} <span className="mx-1 text-slate-300">·</span>{" "}
                                {formatRelativeTime(message.createdAt) || formatDateTime(message.createdAt)}
                              </p>
                            )}
                            <div
                              className={`max-w-[720px] rounded-xl px-4 py-3 text-sm font-medium leading-relaxed ${
                                alignRight
                                  ? "bg-[#0F172A] text-white"
                                  : "border border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              {getMessageText(message)}
                              {files.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {files.map((file, fileIndex) => {
                                    const fileUrl = getAttachmentUrl(file);
                                    if (!fileUrl) return null;

                                    const fileName = getAttachmentName(file);
                                    const isImage = isImageAttachment(file);

                                    return (
                                      <a
                                        key={`${fileUrl}-${fileIndex}`}
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`block overflow-hidden rounded-lg border text-xs font-semibold transition-opacity hover:opacity-85 ${
                                          alignRight
                                            ? "border-white/15 bg-white/10 text-slate-100"
                                            : "border-slate-200 bg-slate-50 text-slate-600"
                                        }`}
                                      >
                                        {isImage ? (
                                          <img
                                            src={fileUrl}
                                            alt={fileName}
                                            className="h-28 w-36 object-cover"
                                          />
                                        ) : (
                                          <span className="flex max-w-[220px] items-center gap-2 px-3 py-2">
                                            <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate">{fileName}</span>
                                          </span>
                                        )}
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <input
                        ref={replyFileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(event) => setReplyFiles(Array.from(event.target.files || []))}
                      />
                      <button
                        type="button"
                        aria-label="Add attachment"
                        onClick={() => replyFileInputRef.current?.click()}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-[#00B2D6]"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <textarea
                          value={reply}
                          onChange={(event) => setReply(event.target.value)}
                          placeholder="Write a reply..."
                          rows={3}
                          className="min-h-20 w-full resize-none bg-transparent text-sm font-medium text-[#0F2E4A] outline-none placeholder:text-slate-400"
                        />
                        {replyFiles.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {replyFiles.map((file) => (
                              <span
                                key={`${file.name}-${file.size}`}
                                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                              >
                                <Paperclip className="h-3 w-3" />
                                {file.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!reply.trim() || isSendingMessage}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-[#00B2D6] hover:text-white disabled:cursor-not-allowed disabled:hover:bg-slate-100 disabled:hover:text-slate-500"
                    >
                      {isSendingMessage && <Loader2 className="h-4 w-4 animate-spin" />}
                      Send reply
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center text-sm font-semibold text-slate-500">
                  No ticket selected.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isCreateModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close new ticket modal"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <form
            onSubmit={handleCreateTicket}
            className="relative z-10 w-full max-w-[560px] rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(15,46,74,0.18)]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#0F2E4A]">New Support Ticket</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-[#00B2D6]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0F2E4A]">Subject</label>
                <input
                  value={newTicket.subject}
                  onChange={(event) => setNewTicket((prev) => ({ ...prev, subject: event.target.value }))}
                  placeholder="Booking issue with time slot"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#0F2E4A] outline-none focus:border-[#00B2D6]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#0F2E4A]">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(event) => setNewTicket((prev) => ({ ...prev, description: event.target.value }))}
                  rows={4}
                  placeholder="Describe the issue..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#0F2E4A] outline-none focus:border-[#00B2D6]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0F2E4A]">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(event) => setNewTicket((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#0F2E4A] outline-none focus:border-[#00B2D6]"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#0F2E4A]">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(event) => setNewTicket((prev) => ({ ...prev, priority: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-[#0F2E4A] outline-none focus:border-[#00B2D6]"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreatingTicket}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00B2D6] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0092B3] disabled:opacity-70"
            >
              {isCreatingTicket && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Ticket
            </button>
          </form>
        </div>,
        document.body,
      )}
    </div>
  );
}
