"use client";

import React from "react";
import { Card } from "antd";

export default function CliniciansPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 font-poppins">
        Clinicians
      </h1>
      <Card variant="borderless" className="shadow-sm p-6 text-center">
        <p className="text-gray-500">Clinician assignments and staff schedules will be wired here.</p>
      </Card>
    </div>
  );
}
