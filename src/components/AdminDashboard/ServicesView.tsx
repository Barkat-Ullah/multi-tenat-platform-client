"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { adminServicesData, ServiceItemData } from "@/app/data/AdminDashboardData";
import AddServiceModal from "./AddServiceModal";
import { toast } from "sonner";

export default function ServicesView() {
  const [services, setServices] = useState<ServiceItemData[]>(adminServicesData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveService = (newService: Omit<ServiceItemData, "id">) => {
    const created: ServiceItemData = {
      id: `serv-${Date.now()}`,
      ...newService,
    };
    setServices((prev) => [...prev, created]);
    toast.success(`Successfully added service "${newService.serviceName}"!`);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          All Services
        </h1>
        {/* Add Service Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
        >
          <span>Add Service</span>
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      {/* Services Grid (3 columns matching mockup) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-4 bg-white rounded-[24px] border border-slate-100/80 p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.012)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            {/* Left Image Cover */}
            <div className="relative w-[95px] h-[72px] sm:w-[110px] sm:h-[82px] rounded-2xl overflow-hidden shrink-0 bg-slate-100">
              <Image
                src={service.image}
                alt={service.serviceName}
                fill
                sizes="(max-width: 640px) 95px, 110px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>

            {/* Right Text Fields */}
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-[15px] text-[#0F2E4A] font-poppins truncate">
                {service.serviceName}
              </h3>
              <p className="text-xs text-slate-400 font-medium font-sans mt-1.5 line-clamp-2">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal overlay */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
      />
    </div>
  );
}
