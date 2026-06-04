"use client";

import React from "react";

export default function OrganizerDashboardPage() {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Organizer Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to the Event & Organizer Management Portal. This dashboard is role-restricted and ready for template custom features.
      </p>
      
      {/* Centralized Mock Stats Showcase (Tiny, generic UI stat block) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-600 font-medium uppercase tracking-wider">Active Campaigns</p>
          <p className="text-3xl font-extrabold text-amber-900 mt-2">12</p>
        </div>
        <div className="p-5 bg-teal-50 rounded-lg border border-teal-100">
          <p className="text-sm text-teal-600 font-medium uppercase tracking-wider">Total Events</p>
          <p className="text-3xl font-extrabold text-teal-900 mt-2">48</p>
        </div>
        <div className="p-5 bg-rose-50 rounded-lg border border-rose-100">
          <p className="text-sm text-rose-600 font-medium uppercase tracking-wider">Subscribers</p>
          <p className="text-3xl font-extrabold text-rose-900 mt-2">5,670</p>
        </div>
      </div>
    </div>
  );
}
