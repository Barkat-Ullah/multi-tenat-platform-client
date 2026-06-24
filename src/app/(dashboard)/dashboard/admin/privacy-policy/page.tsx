"use client";

import React from "react";
import { Card } from "antd";

export default function PrivacyPolicyPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 font-poppins">
        Privacy Policy
      </h1>
      <Card variant="borderless" className="shadow-sm p-6 text-center">
        <p className="text-gray-500">Privacy policy revisions and layout configurations will be wired here.</p>
      </Card>
    </div>
  );
}
