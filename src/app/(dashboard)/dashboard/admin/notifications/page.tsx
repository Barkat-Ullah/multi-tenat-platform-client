"use client";

import React, { useState } from "react";
import { notificationsData } from "@/app/data/AdminDashboardData";
import NotificationItem from "@/components/AdminDashboard/NotificationItem";
import Pagination from "@/components/AdminDashboard/Pagination";

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(notificationsData.length / itemsPerPage);

  const paginatedNotifications = notificationsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-poppins tracking-tight mb-6">
        Notifications
      </h1>

      {/* Notifications Cards Container */}
      <div className="space-y-4">
        {paginatedNotifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            title={notif.title}
            location={notif.location}
            time={notif.time}
          />
        ))}
      </div>

      {/* Custom Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
