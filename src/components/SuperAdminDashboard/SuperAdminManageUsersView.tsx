"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Dropdown } from "antd";
import {
  Check,
  MoreVertical,
  Search,
  Users,
  XCircle,
  XSquare,
} from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/AdminDashboard/Pagination";
import {
  type User,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/service/admin/userApi";
import type { UserStatus } from "@/utils/types";

const PAGE_LIMIT = 10;

const getUserName = (user: User) => user.fullName || "N/A";

const getMeta = (response?: {
  pagination?: { limit?: number; total?: number; totalPages?: number };
  meta?: { limit?: number; total?: number; totalPages?: number };
  data?: User[];
}) => {
  const total = response?.pagination?.total ?? response?.meta?.total ?? 0;
  const limit =
    response?.pagination?.limit ?? response?.meta?.limit ?? PAGE_LIMIT;
  const totalPages =
    response?.pagination?.totalPages ??
    response?.meta?.totalPages ??
    Math.max(1, Math.ceil(total / limit));

  return { total, totalPages };
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === "ACTIVE" ? "Active" : "Suspended";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;
  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };

  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

const StatsSkeleton = () => (
  <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
);

const TableSkeleton = () => (
  <tbody className="divide-y divide-slate-100/80" aria-label="Loading users">
    {Array.from({ length: 7 }, (_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse">
        {[42, 54, 38, 30, 28, 24].map((width, index) => (
          <td key={index} className="px-6 py-5">
            <div
              className="h-2.5 rounded-full bg-slate-200"
              style={{ width: `${width - (rowIndex % 3) * 3}%` }}
            />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

export default function SuperAdminManageUsersView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const trimmedSearch = searchTerm.trim().toLowerCase();
  const isSearching = trimmedSearch.length > 0;

  const {
    data: usersResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllUsersQuery({
    page: isSearching ? 1 : currentPage,
    limit: isSearching ? 1000 : PAGE_LIMIT,
  });
  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = usersResponse?.data || [];
  const filteredUsers = useMemo(() => {
    if (!trimmedSearch) return users;

    return users.filter((user) =>
      [
        user.fullName,
        user.email,
        user.phoneNumber,
        user.role,
        normalizeStatus(user.status),
        user.status,
      ].some((value) => value?.toLowerCase().includes(trimmedSearch)),
    );
  }, [trimmedSearch, users]);
  const paginatedUsers = useMemo(() => {
    if (!isSearching) return filteredUsers;
    const start = (currentPage - 1) * PAGE_LIMIT;
    return filteredUsers.slice(start, start + PAGE_LIMIT);
  }, [currentPage, filteredUsers, isSearching]);
  const { total: apiTotal, totalPages: apiTotalPages } = getMeta(usersResponse);
  const total = isSearching ? filteredUsers.length : apiTotal;
  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filteredUsers.length / PAGE_LIMIT))
    : apiTotalPages;
  const isUsersLoading = isLoading || isFetching;

  const activeCount = useMemo(
    () => filteredUsers.filter((user) => user.status === "ACTIVE").length,
    [filteredUsers],
  );
  const suspendedCount = useMemo(
    () => filteredUsers.filter((user) => user.status === "SUSPENDED").length,
    [filteredUsers],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (!deleteTarget) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [deleteTarget]);

  const handleToggleStatus = async (user: User) => {
    const nextStatus: UserStatus =
      user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      const response = await updateUserStatus({
        id: user.id,
        status: nextStatus,
      }).unwrap();
      toast.success(
        response?.message ||
          `${getUserName(user)} marked as ${normalizeStatus(nextStatus)}.`,
      );
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update user status."));
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;

    try {
      const response = await deleteUser(deleteTarget.id).unwrap();
      toast.success(response?.message || "User deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete user."));
    }
  };

  const getActionMenuItems = (user: User) => [
    {
      key: "toggle",
      label: (
        <span className="block px-2 py-1 font-sans font-semibold text-slate-700">
          {user.status === "ACTIVE" ? "Suspend User" : "Activate User"}
        </span>
      ),
      onClick: () => handleToggleStatus(user),
      disabled: isUpdatingStatus,
    },
    {
      key: "delete",
      label: (
        <span className="block px-2 py-1 font-sans font-semibold text-red-500">
          Delete
        </span>
      ),
      onClick: () => setDeleteTarget(user),
      disabled: isDeleting,
    },
  ];

  const stats = [
    {
      title: "Total Users",
      value: total,
      icon: Users,
      iconClassName: "text-[#00B2D6]",
      iconBackground: "bg-[#E6FAFF]",
    },
    {
      title: "Active Users",
      value: activeCount,
      icon: Check,
      iconClassName: "text-[#10B981]",
      iconBackground: "bg-[#E8F8F5]",
    },
    {
      title: "Inactive Users",
      value: 0,
      icon: XSquare,
      iconClassName: "text-[#D9A700]",
      iconBackground: "bg-[#FEF9E7]",
    },
    {
      title: "Suspended Users",
      value: suspendedCount,
      icon: XCircle,
      iconClassName: "text-[#E53E3E]",
      iconBackground: "bg-[#FDF2F2]",
    },
  ];

  return (
    <div className="w-full space-y-8 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Manage Users
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="flex min-h-[140px] flex-col justify-between rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                  {stat.title}
                </span>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${stat.iconBackground} ${stat.iconClassName}`}
                >
                  <Icon size={18} className="stroke-[2.5]" />
                </div>
              </div>
              <div className="pt-4 font-poppins text-2xl font-extrabold text-[#0F2E4A] sm:text-3xl">
                {isUsersLoading ? (
                  <StatsSkeleton />
                ) : (
                  stat.value.toLocaleString("en-GB")
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="search"
          placeholder="Search Users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-xs font-semibold text-[#0F2E4A] shadow-[0_2px_10px_rgba(0,0,0,0.01)] transition-all placeholder-slate-400 focus:border-[#00B2D6] focus:outline-none focus:ring-1 focus:ring-[#00B2D6] sm:text-sm"
        />
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="font-poppins text-xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-2xl">
          Users
        </h2>

        <div className="overflow-hidden rounded-[24px] border border-slate-100/90 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#00B2D6] bg-white">
                  <th className="w-[18%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    User Name
                  </th>
                  <th className="w-[22%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Email
                  </th>
                  <th className="w-[14%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Phone Number
                  </th>
                  <th className="w-[12%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Role
                  </th>
                  <th className="w-[14%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Join Date
                  </th>
                  <th className="w-[12%] px-6 py-4 font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Status
                  </th>
                  <th className="w-[8%] px-6 py-4 text-center font-poppins text-xs font-bold text-[#0F2E4A] sm:text-sm">
                    Action
                  </th>
                </tr>
              </thead>

              {isUsersLoading ? (
                <TableSkeleton />
              ) : (
                <tbody className="divide-y divide-slate-100/80">
                  {paginatedUsers.map((user) => {
                    const status = normalizeStatus(user.status);
                    return (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-slate-50/40"
                      >
                        <td className="px-6 py-3.5 font-sans text-xs font-bold text-[#0F2E4A] sm:text-sm">
                          {getUserName(user)}
                        </td>
                        <td className="px-6 py-3.5 font-sans text-xs font-semibold text-slate-500 sm:text-sm">
                          {user.email || "N/A"}
                        </td>
                        <td className="px-6 py-3.5 font-sans text-xs font-semibold text-slate-500 sm:text-sm">
                          {user.phoneNumber || "N/A"}
                        </td>
                        <td className="px-6 py-3.5 font-sans text-xs font-semibold text-slate-500 sm:text-sm">
                          {user.role || "N/A"}
                        </td>
                        <td className="px-6 py-3.5 font-sans text-xs font-semibold text-slate-500 sm:text-sm">
                          {formatDate(user.joinDate || user.createdAt)}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-block rounded-full px-3.5 py-1 font-poppins text-xs font-bold tracking-wider ${
                              status === "Active"
                                ? "bg-[#E8F8F5] text-[#10B981]"
                                : "bg-[#FDF2F2] text-[#E53E3E]"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <Dropdown
                            menu={{ items: getActionMenuItems(user) }}
                            trigger={["click"]}
                            placement="bottomRight"
                            overlayClassName="min-w-[150px] bg-white border border-slate-100 rounded-xl shadow-lg"
                          >
                            <button
                              type="button"
                              className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#E6FAFF] text-[#00B2D6] transition-all hover:scale-105 hover:bg-[#D0F3FC] active:scale-95"
                              aria-label={`Open actions for ${getUserName(user)}`}
                              title="Actions"
                            >
                              <MoreVertical size={16} />
                            </button>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>

            {!isUsersLoading && isError && (
              <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 border-t border-slate-100 text-center">
                <p className="text-sm font-bold text-red-500">
                  Failed to load users.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isUsersLoading && !isError && filteredUsers.length === 0 && (
              <div className="flex min-h-[280px] items-center justify-center border-t border-slate-100 px-6 text-center text-sm font-semibold text-slate-400">
                No users found.
              </div>
            )}
          </div>
        </div>

        {!isLoading && !isError && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {deleteTarget && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancel delete user"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative z-10 w-full max-w-[420px] rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:p-7">
            <h3 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
              Delete User
            </h3>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
              Are you sure you want to delete {getUserName(deleteTarget)}? This
              action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="rounded-full bg-red-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
