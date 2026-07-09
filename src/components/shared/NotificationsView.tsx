"use client";

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import NotificationItem from "@/components/shared/NotificationItem";
import Pagination from "@/components/AdminDashboard/Pagination";
import {
  AppNotification,
  useGetNotificationsQuery,
  useLazyGetNotificationQuery,
} from "@/redux/service/notifications/notificationsApi";

const PAGE_LIMIT = 7;

const getNotificationId = (notification: AppNotification) =>
  notification.id || notification._id || "";

const getNotificationTitle = (notification: AppNotification) =>
  notification.title ||
  notification.data?.title ||
  notification.type ||
  "Notification";

const getNotificationMessage = (notification: AppNotification) =>
  notification.message ||
  notification.body ||
  notification.description ||
  notification.data?.message ||
  "No additional details available.";

const getNotificationLocation = (notification: AppNotification) =>
  notification.location ||
  notification.data?.location ||
  notification.data?.locationName ||
  notification.data?.clinicName ||
  notification.data?.serviceTitle ||
  "System";

const getNotificationTime = (notification: AppNotification) => {
  const value = notification.createdAt || notification.updatedAt;
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isNotificationRead = (notification: AppNotification) =>
  Boolean(notification.isRead || notification.read);

const NotificationsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex items-center justify-between rounded-3xl border border-slate-100/80 bg-white p-5 shadow-[0_2px_15px_rgba(0,0,0,0.01)]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-56 max-w-full animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
      </div>
    ))}
  </div>
);

const NotificationDetailsModal = ({
  notification,
  isLoading,
  onClose,
}: {
  notification: AppNotification | null;
  isLoading: boolean;
  onClose: () => void;
}) => {
  if (!notification && !isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close notification details"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-[500px] rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
            Notification Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification details"
            title="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC]"
          >
            <X size={16} />
          </button>
        </div>

        {isLoading || !notification ? (
          <div className="mt-6 space-y-3">
            <div className="h-5 w-52 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-[#0F2E4A]">
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Title</span>
              <p className="mt-1 text-sm font-bold">{getNotificationTitle(notification)}</p>
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Message</span>
              <p className="mt-1 rounded-2xl bg-slate-50 p-3 text-sm font-semibold leading-relaxed text-slate-500">
                {getNotificationMessage(notification)}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400">Source</span>
                <p className="mt-1 text-sm font-semibold text-slate-500">{getNotificationLocation(notification)}</p>
              </div>
              <div>
                <span className="block text-xs font-bold uppercase text-slate-400">Time</span>
                <p className="mt-1 text-sm font-semibold text-slate-500">{getNotificationTime(notification) || "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default function NotificationsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetNotificationsQuery({
    page: currentPage,
    limit: PAGE_LIMIT,
  });
  const [
    getNotification,
    { data: notificationDetails, isFetching: isDetailsLoading },
  ] = useLazyGetNotificationQuery();

  const notifications = data?.data || [];
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((data?.meta?.total || notifications.length) / PAGE_LIMIT));
  }, [data?.meta?.total, notifications.length]);
  const isBusy = isLoading || isFetching;

  const handleOpenNotification = async (notification: AppNotification) => {
    const notificationId = getNotificationId(notification);
    setSelectedNotification(notification);

    if (notificationId) {
      try {
        await getNotification(notificationId).unwrap();
      } catch {
        // Keep the list item data visible if the details endpoint fails.
      }
    }
  };

  const detailNotification = selectedNotification
    ? notificationDetails?.data || selectedNotification
    : null;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins mb-6 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
        Notifications
      </h1>

      {isBusy ? (
        <NotificationsSkeleton />
      ) : isError ? (
        <div className="rounded-3xl border border-red-100 bg-white p-12 text-center shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          <p className="text-sm font-semibold text-red-500">
            Failed to load notifications.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            Try Again
          </button>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={getNotificationId(notification)}
              title={getNotificationTitle(notification)}
              location={getNotificationLocation(notification)}
              time={getNotificationTime(notification)}
              isRead={isNotificationRead(notification)}
              onClick={() => handleOpenNotification(notification)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center text-sm font-semibold text-slate-500 shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
          No notifications found.
        </div>
      )}

      {!isBusy && !isError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <NotificationDetailsModal
        notification={detailNotification}
        isLoading={Boolean(selectedNotification) && isDetailsLoading}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
}
