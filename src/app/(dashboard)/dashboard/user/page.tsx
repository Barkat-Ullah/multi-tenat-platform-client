"use client";

import React from "react";

export default function UserDashboardPage() {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">User Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to your Compliance Medicals Portal. Here you can manage your driver medicals, track appointments, and update your personal settings.
      </p>
      
      {/* Centralized Mock Stats Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-sky-50 rounded-lg border border-sky-100">
          <p className="text-sm text-sky-600 font-medium uppercase tracking-wider">Upcoming Medicals</p>
          <p className="text-3xl font-extrabold text-sky-900 mt-2">1</p>
        </div>
        <div className="p-5 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-sm text-emerald-600 font-medium uppercase tracking-wider">Booked Slots</p>
          <p className="text-3xl font-extrabold text-emerald-900 mt-2">1</p>
        </div>
        <div className="p-5 bg-violet-50 rounded-lg border border-violet-100">
          <p className="text-sm text-violet-600 font-medium uppercase tracking-wider">Completed Medicals</p>
          <p className="text-3xl font-extrabold text-violet-900 mt-2">2</p>
        </div>
      </div>
    </div>
  );
}
