"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Check,
  XSquare,
  XCircle,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  ShieldAlert
} from "lucide-react";
import { Dropdown } from "antd";
import { superAdminUsersData, SuperAdminUserItem } from "@/app/data/SuperAdminDashboardData";
import { toast } from "sonner";

export default function SuperAdminManageUsersView() {
  const [users, setUsers] = useState<SuperAdminUserItem[]>(superAdminUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter users based on search term (name or email)
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.userName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  }, [filteredUsers]);

  // Paginated slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleToggleStatus = (id: string, name: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
    toast.success(`Successfully toggled status for user "${name}"!`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.error(`Deleted user "${name}" record.`);
  };

  // Ant Design Dropdown items builder
  const getActionMenuItems = (user: SuperAdminUserItem) => [
    {
      key: "toggle",
      label: (
        <span className="font-semibold text-slate-700 font-sans px-2 py-1 block flex items-center gap-2">
          <Eye size={14} className="text-[#00B2D6]" />
          Toggle Status
        </span>
      ),
      onClick: () => handleToggleStatus(user.id, user.userName),
    },
    {
      key: "suspend",
      label: (
        <span className="font-semibold text-amber-600 font-sans px-2 py-1 block flex items-center gap-2">
          <ShieldAlert size={14} />
          Suspend User
        </span>
      ),
      onClick: () => toast.warning(`Suspended user "${user.userName}" session active states.`),
    },
    {
      key: "delete",
      label: (
        <span className="font-semibold text-red-500 font-sans px-2 py-1 block flex items-center gap-2">
          <Trash2 size={14} />
          Delete
        </span>
      ),
      onClick: () => handleDeleteUser(user.id, user.userName),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Manage Users
        </h1>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
              <Users size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            12
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Active Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
              <Check size={18} className="stroke-[3]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            322
          </div>
        </div>

        {/* Inactive Users */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Inactive Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E6FAFF] text-[#00B2D6] flex items-center justify-center shrink-0">
              <XSquare size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            342
          </div>
        </div>

        {/* Suspended Users */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins">
              Suspended Users
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F2] text-[#E53E3E] flex items-center justify-center shrink-0">
              <XCircle size={18} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins pt-4">
            5
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] focus:outline-none focus:border-[#00B2D6] focus:ring-1 focus:ring-[#00B2D6] text-xs sm:text-sm text-[#0F2E4A] placeholder-slate-400 transition-all font-semibold"
        />
      </div>

      {/* Users List Table */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Users
        </h2>

        <div className="bg-white rounded-[24px] border border-slate-100/90 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[22%]">
                    User Name
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[24%]">
                    Email
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Phone Number
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[18%]">
                    Join Date
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins w-[12%]">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs sm:text-sm font-bold text-[#0F2E4A] font-poppins text-center w-[6%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-[#0F2E4A] font-bold font-sans">
                      {user.userName}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {user.phoneNumber}
                    </td>
                    <td className="py-3.5 px-6 text-xs sm:text-sm text-slate-500 font-semibold font-sans">
                      {user.joinDate}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold font-poppins tracking-wider ${
                          user.status === "Active"
                            ? "bg-[#E8F8F5] text-[#10B981]"
                            : "bg-[#FEF9E7] text-[#D9A700]"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <Dropdown
                        menu={{ items: getActionMenuItems(user) }}
                        trigger={["click"]}
                        placement="bottomRight"
                        overlayClassName="min-w-[150px] bg-white border border-slate-100 rounded-xl shadow-lg"
                      >
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none outline-none"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination Control Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-400 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#00B2D6] text-white border border-[#00B2D6] shadow-sm"
                      : "border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 font-bold text-xs sm:text-sm flex items-center gap-1 transition-all outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
