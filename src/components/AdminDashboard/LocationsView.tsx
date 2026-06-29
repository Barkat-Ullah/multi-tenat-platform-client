"use client";

import React, { useState, useMemo } from "react";
import { Search, Map, Calendar, Users, Plus } from "lucide-react";
import { adminLocationsData, LocationItemData } from "@/app/data/AdminDashboardData";
import Pagination from "./Pagination";
import AddLocationModal from "./AddLocationModal";

export default function LocationsView() {
  const [locations, setLocations] = useState<LocationItemData[]>(adminLocationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const itemsPerPage = 6;

  // Filter locations based on search term (city name or address)
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const term = searchTerm.toLowerCase();
      return (
        loc.city.toLowerCase().includes(term) ||
        loc.address.toLowerCase().includes(term)
      );
    });
  }, [locations, searchTerm]);

  // Total pages calculation
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredLocations.length / itemsPerPage));
  }, [filteredLocations]);

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginated data slice
  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLocations.slice(start, start + itemsPerPage);
  }, [filteredLocations, currentPage]);

  const handleSaveLocation = (newLoc: {
    city: string;
    address: string;
    bookingsCount: number;
    cliniciansCount: number;
  }) => {
    const loc: LocationItemData = {
      id: `loc-${Date.now()}`,
      ...newLoc,
    };
    setLocations((prev) => [loc, ...prev]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Locations
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 active:scale-[0.98] cursor-pointer"
        >
          <span>Add Location</span>
          <span className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
            <Plus size={12} className="stroke-[3]" />
          </span>
        </button>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-sm text-[#0F2E4A] placeholder-slate-400 transition-all font-semibold"
        />
      </div>

      {/* Locations Cards Grid */}
      {paginatedLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLocations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-6 relative hover:shadow-[0_10px_35px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Title & Icon */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0F2E4A] font-poppins tracking-tight">
                    {loc.city}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shadow-sm">
                    <Map size={15} />
                  </div>
                </div>

                {/* Address Description */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Address Details
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                    City Name : {loc.address}
                  </p>
                </div>
              </div>

              {/* Statistics details */}
              <div className="mt-5 pt-4 border-t border-slate-50 space-y-2">
                {/* Bookings */}
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <Calendar size={14} className="text-[#00B2D6] stroke-[2.25]" />
                  <span>{loc.bookingsCount} bookings</span>
                </div>
                {/* Clinicians */}
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <Users size={14} className="text-[#00B2D6] stroke-[2.25]" />
                  <span>{loc.cliniciansCount} clinicians</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.015)] p-12 text-center">
          <p className="text-slate-500 font-semibold text-sm">
            No locations found matching your search.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveLocation}
      />
    </div>
  );
}
