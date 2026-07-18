"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  FileText,
  Globe,
  ListFilter,
  Mail,
  MapPin,
  ParkingCircle,
  Phone,
  RefreshCw,
  Shield,
  Stethoscope,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  type User,
  useGetSingleUserQuery,
  useUpdateClientInfoMutation,
  useUpdateUserStatusMutation,
} from "@/redux/service/admin/userApi";

interface UserDetailsViewProps {
  userId: string;
  backLink: string;
  sendEmailPath: string;
}

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatSlotTime = (dateStr?: string, startTime?: string) => {
  if (!dateStr) return "N/A";
  const dateObj = new Date(dateStr);
  if (Number.isNaN(dateObj.getTime())) return "N/A";

  const dateFormatted = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateObj);

  if (startTime) {
    const [hStr, mStr] = startTime.split(":");
    const h = parseInt(hStr, 10);
    if (!isNaN(h)) {
      const period = h >= 12 ? "pm" : "am";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${dateFormatted}, ${h12}:${mStr || "00"} ${period}`;
    }
  }

  return dateFormatted;
};

const getStatusBadgeClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
    case "ACTIVE":
      return "bg-[#E8F8F5] text-[#10B981]";
    case "CONFIRMED":
      return "bg-[#E6FAFF] text-[#00B2D6]";
    case "CANCELLED":
    case "CANCELED":
    case "SUSPENDED":
      return "bg-[#FDF2F2] text-[#E53E3E]";
    default:
      return "bg-amber-50 text-amber-600";
  }
};

export default function UserDetailsView({
  userId,
  backLink,
  sendEmailPath,
}: UserDetailsViewProps) {
  const router = useRouter();
  const {
    data: userResponse,
    isLoading,
    isError,
    refetch,
  } = useGetSingleUserQuery(userId, { skip: !userId });

  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [updateClientInfo, { isLoading: isUpdatingInfo }] =
    useUpdateClientInfoMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    describe: "",
    city: "",
    address: "",
  });

  const user: User | undefined = userResponse?.data;
  const roleData = user?.roleSpecificData;

  const handleOpenEditModal = () => {
    if (!user) return;
    setEditForm({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      describe: user.describe || "",
      city: user.city || "",
      address: user.address || "",
    });
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    try {
      const response = await updateUserStatus({
        id: user.id,
        status: nextStatus,
      }).unwrap();
      toast.success(
        response?.message ||
          `User status changed to ${nextStatus === "ACTIVE" ? "Active" : "Suspended"}.`,
      );
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  const handleSaveClientInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await updateClientInfo({
        id: user.id,
        body: {
          fullName: editForm.fullName.trim() || undefined,
          phoneNumber: editForm.phoneNumber.trim() || undefined,
          describe: editForm.describe.trim() || undefined,
          city: editForm.city.trim() || undefined,
          address: editForm.address.trim() || undefined,
        },
      }).unwrap();

      toast.success(response?.message || "User information updated successfully.");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update user information.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200" />
        </div>
        <div className="h-64 w-full animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#00B2D6] hover:underline"
        >
          <ArrowLeft size={16} /> Back to Users
        </Link>

        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <XCircle size={44} className="text-red-400" />
          <h3 className="font-poppins text-lg font-extrabold text-[#0F2E4A]">
            User Not Found
          </h3>
          <p className="text-xs font-medium text-slate-400 max-w-sm">
            Could not fetch user details for ID: <span className="font-mono text-slate-600">{userId}</span>.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9]"
            >
              Retry
            </button>
            <Link
              href={backLink}
              className="rounded-full border border-slate-200 px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isActive = user.status === "ACTIVE";

  return (
    <div className="w-full space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={backLink}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 text-[#0F2E4A] transition-all hover:bg-slate-50 hover:border-[#00B2D6] shadow-sm"
            aria-label="Back to users list"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A]">
              User Details & History
            </h1>
            <p className="text-xs font-medium text-slate-400">
              Viewing full profile & history for <span className="font-semibold text-slate-600">{user.email}</span>
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenEditModal}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#0F2E4A] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit3 size={14} className="text-[#00B2D6]" /> Edit Information
          </button>
          <button
            type="button"
            onClick={() => router.push(sendEmailPath)}
            className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2 text-xs font-bold text-white hover:bg-[#009cb9] transition-all shadow-md active:scale-95"
          >
            <Mail size={14} /> Send Email
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] sm:p-8 space-y-8">
        {/* User Summary Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E6FAFF] text-[#00B2D6] font-poppins text-2xl font-extrabold shadow-inner">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
                {user.fullName || "N/A"}
              </h2>
              <p className="text-xs font-semibold text-slate-500">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#E6FAFF] px-3 py-0.5 font-poppins text-xs font-bold text-[#00B2D6]">
                  <Shield size={12} /> {user.role}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 font-poppins text-xs font-bold ${
                    isActive
                      ? "bg-[#E8F8F5] text-[#10B981]"
                      : "bg-[#FDF2F2] text-[#E53E3E]"
                  }`}
                >
                  {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {isActive ? "Active" : "Suspended"}
                </span>
                {user.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 font-poppins text-xs font-bold text-emerald-600">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
              isActive
                ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {isUpdatingStatus
              ? "Updating..."
              : isActive
              ? "Suspend User"
              : "Activate User"}
          </button>
        </div>

        {/* Overview Stats Counters */}
        {roleData && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-[#E6FAFF]/40 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total Bookings</span>
                <ListFilter size={16} className="text-[#00B2D6]" />
              </div>
              <span className="mt-2 block font-poppins text-2xl font-extrabold text-[#0F2E4A]">
                {roleData.bookingCount ?? roleData.bookings?.length ?? 0}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#E8F8F5]/40 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Total Time Slots</span>
                <Clock size={16} className="text-[#10B981]" />
              </div>
              <span className="mt-2 block font-poppins text-2xl font-extrabold text-[#0F2E4A]">
                {roleData.timeSlotCount ?? roleData.timeSlots?.length ?? 0}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Medical Records</span>
                <FileText size={16} className="text-purple-500" />
              </div>
              <span className="mt-2 block font-poppins text-2xl font-extrabold text-[#0F2E4A]">
                {roleData.medicalRecordCount ?? roleData.medicalRecords?.length ?? 0}
              </span>
            </div>
          </div>
        )}

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <UserIcon size={14} className="text-[#00B2D6]" /> User ID
            </span>
            <span className="mt-1.5 block font-mono text-xs font-bold text-[#0F2E4A] break-all">
              {user.id}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Mail size={14} className="text-[#00B2D6]" /> Email Address
            </span>
            <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A] break-all">
              {user.email}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Phone size={14} className="text-[#00B2D6]" /> Phone Number
            </span>
            <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
              {user.phoneNumber || "N/A"}
            </span>
          </div>

          {user.clinicGmcNumber && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Stethoscope size={14} className="text-[#00B2D6]" /> GMC Number
              </span>
              <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
                {user.clinicGmcNumber}
              </span>
            </div>
          )}

          {user.isParking !== undefined && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <ParkingCircle size={14} className="text-[#00B2D6]" /> Parking Available
              </span>
              <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
                {user.isParking ? "Yes" : "No"}
              </span>
            </div>
          )}

          {roleData?.location && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <MapPin size={14} className="text-[#00B2D6]" /> Clinic Location
              </span>
              <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
                {roleData.location.locationName}
              </span>
            </div>
          )}

          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Globe size={14} className="text-[#00B2D6]" /> City
            </span>
            <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
              {user.city || "N/A"}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <MapPin size={14} className="text-[#00B2D6]" /> Address
            </span>
            <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
              {user.address || "N/A"}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Calendar size={14} className="text-[#00B2D6]" /> Account Created
            </span>
            <span className="mt-1.5 block text-xs font-semibold text-[#0F2E4A]">
              {formatDate(user.createdAt || user.joinDate)}
            </span>
          </div>
        </div>

        {/* Bio / Description Box */}
        {user.describe && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <h4 className="text-xs font-bold text-slate-400 mb-2">Description / Bio</h4>
            <p className="text-xs font-semibold leading-relaxed text-slate-700 whitespace-pre-wrap">
              {user.describe}
            </p>
          </div>
        )}

        {/* Services Offered Section */}
        {roleData?.services && roleData.services.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="font-poppins text-base font-extrabold text-[#0F2E4A]">
              Offered Services ({roleData.services.length})
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {roleData.services.map((service) => (
                <div
                  key={service.id}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2 text-xs font-bold text-[#0F2E4A]"
                >
                  <Stethoscope size={14} className="text-[#00B2D6]" />
                  <span>{service.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings History Section */}
        {roleData?.bookings && roleData.bookings.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins text-lg font-extrabold text-[#0F2E4A]">
                Bookings History ({roleData.bookings.length})
              </h3>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#00B2D6] bg-slate-50/50">
                      <th className="px-4 py-3 text-xs font-bold text-slate-500">Booking ID</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500">Driver</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500">Service</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-500">Appointment Slot</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roleData.bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/40">
                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-slate-600">
                          {booking.id}
                        </td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-[#0F2E4A]">
                          <div>{booking.driver?.fullName || "N/A"}</div>
                          <div className="text-[11px] font-normal text-slate-400">
                            {booking.driver?.email}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                          {booking.service?.title || "N/A"}
                        </td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-slate-600">
                          {formatSlotTime(booking.timeSlot?.date || booking.scheduledAt, booking.timeSlot?.startTime)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Information Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancel edit"
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-poppins text-xl font-extrabold text-[#0F2E4A]">
                Edit User Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClientInfo} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="Enter city"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Enter full address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#0F2E4A]">
                  Description / Bio
                </label>
                <textarea
                  rows={4}
                  value={editForm.describe}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, describe: e.target.value }))
                  }
                  placeholder="Enter description..."
                  className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs font-semibold text-[#0F2E4A] focus:border-[#00B2D6] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#00B2D6] resize-y"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdatingInfo}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingInfo}
                  className="flex items-center gap-2 rounded-full bg-[#00B2D6] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#009cb9]"
                >
                  {isUpdatingInfo ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
