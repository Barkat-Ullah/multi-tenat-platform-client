"use client";

import React from "react";

export default function ClinicDashboardPage() {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Clinic Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to the Clinic Management Portal. This dashboard is role-restricted and ready for template custom features.
      </p>
      
      {/* Centralized Mock Stats Showcase (Tiny, generic UI stat block) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium uppercase tracking-wider">Patients Registered</p>
          <p className="text-3xl font-extrabold text-blue-900 mt-2">1,248</p>
        </div>
        <div className="p-5 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-medium uppercase tracking-wider">Active Staff</p>
          <p className="text-3xl font-extrabold text-green-900 mt-2">32</p>
        </div>
        <div className="p-5 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">Scheduled Today</p>
          <p className="text-3xl font-extrabold text-purple-900 mt-2">14</p>
        </div>
      </div>
    </div>
  );
}
