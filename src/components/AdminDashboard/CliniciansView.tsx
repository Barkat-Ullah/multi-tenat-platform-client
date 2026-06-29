"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { Dropdown } from "antd";
import { adminCliniciansData, ClinicianItemData } from "@/app/data/AdminDashboardData";
import Pagination from "./Pagination";
import AddClinicianModal from "./AddClinicianModal";
import ClinicianDetailsModal from "./ClinicianDetailsModal";
import { toast } from "sonner";

export default function CliniciansView() {
  const [clinicians, setClinicians] = useState<ClinicianItemData[]>(adminCliniciansData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinician, setSelectedClinician] = useState<ClinicianItemData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const itemsPerPage = 9; // Show 9 items per page matching the mockup list count

  // Filter clinicians based on clinicianName
  const filteredClinicians = useMemo(() => {
    return clinicians.filter((clin) => {
      const term = searchTerm.toLowerCase();
      return clin.clinicianName.toLowerCase().includes(term);
    });
  }, [clinicians, searchTerm]);

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredClinicians.length / itemsPerPage));
  }, [filteredClinicians]);

  // Paginated slice
  const paginatedClinicians = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClinicians.slice(start, start + itemsPerPage);
  }, [filteredClinicians, currentPage]);

  const handleSaveClinician = (newClinician: Omit<ClinicianItemData, "id">) => {
    const created: ClinicianItemData = {
      id: `clin-${Date.now()}`,
      ...newClinician,
    };
    setClinicians((prev) => [created, ...prev]);
    toast.success("Successfully added new clinician!");
  };

  const handleViewClinician = (clin: ClinicianItemData) => {
    setSelectedClinician(clin);
    setIsDetailsOpen(true);
  };

  const handleDeleteClinician = (id: string) => {
    setClinicians((prev) => prev.filter((c) => c.id !== id));
    toast.success("Successfully deleted clinician record.");
  };

  // Ant Design Dropdown items builder
  const getActionMenuItems = (clin: ClinicianItemData) => [
    {
      key: "view",
      label: <span className="font-semibold text-slate-700 font-sans px-2 block">View</span>,
      onClick: () => handleViewClinician(clin),
    },
    {
      key: "delete",
      label: <span className="font-semibold text-red-500 font-sans px-2 block">Delete</span>,
      onClick: () => handleDeleteClinician(clin.id),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Clinicians
        </h1>
        {/* Add Clinician Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98]"
        >
          <span>Add Clinician</span>
          <Plus size={16} className="stroke-[3]" />
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Patient" // Placeholder matching mockup exactly
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 transition-all font-semibold"
        />
      </div>

      {/* Second Heading & Table container */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#0F2E4A] font-poppins">
          Clinicians
        </h2>

        {/* Data Table */}
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              {/* Note the thin solid cyan line bottom border matching the mockup */}
              <tr className="border-b-2 border-[#00B2D6] text-left">
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Clinician
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Email
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Locations
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans">
                  Speciality
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans text-center">
                  Status
                </th>
                <th className="py-4 px-6 text-sm font-bold text-[#0F2E4A] font-sans text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedClinicians.length > 0 ? (
                paginatedClinicians.map((clin) => (
                  <tr key={clin.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors last:border-b-0">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {clin.clinicianName}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {clin.email}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {clin.locations}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-slate-500">
                      {clin.speciality}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block tracking-wide ${
                        clin.status === "Active"
                          ? "bg-[#E6FDF5] text-[#10B981]"
                          : "bg-[#FFF8E6] text-[#F59E0B]"
                      }`}>
                        {clin.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Dropdown
                        menu={{ items: getActionMenuItems(clin) }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <button
                          className="w-8 h-8 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none ml-auto"
                          aria-label="More actions"
                        >
                          <MoreVertical size={16} className="stroke-[2.5]" />
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    No clinicians found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Panel */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Clinician Popup Form Overlay */}
      <AddClinicianModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClinician}
      />

      {/* View Clinician Details Modal */}
      <ClinicianDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        clinician={selectedClinician}
      />
    </div>
  );
}
