"use client";

// import ActivePropertiesSection from "@/components/pages/All-Property/ActivePropertiesSection";
import ChangePasswordForm from "@/components/pages/Profile/ChangesPassword";
import Spinner from "@/components/ui/Spinner";
import {
  useGetAgencyProfileDataQuery,
  useUpdateProfileDataMutation,
  type ProfileData,
  type UpdateProfilePayload,
} from "@/redux/service/profile/profileApi";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import { appAlert } from "@/utils/appAlert";
import { getImageUrl } from "@/utils/getImageUrl";

export default function Page() {
  const { data: profileResponse, isLoading } = useGetAgencyProfileDataQuery();
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileDataMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // const user = profileResponse?.data || null;

  const [statData, setStatData] = useState<{
    totalProperty: number;
    totalShare: number;
    totalView: number;
    totalSaved: number;
  }>({
    totalProperty: 0,
    totalShare: 0,
    totalView: 0,
    totalSaved: 0,
  });

  // State to hold user object
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    email: "",
    role: "",
    profile: {
      name: "",
      phone: "",
      street: "",
      city: "",
      zipCode: "",
      region: "",
      country: "",
      description: "",
      avatar: "",
    },
    stats: {
      totalProperty: 0,
      totalShare: 0,
      totalView: 0,
      totalSaved: 0,
    },
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState<UpdateProfilePayload>({
    name: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    region: "",
    country: "",
    description: "",
  });

  // console.log("profile response", profileResponse)
  

  // Sync with API data
  useEffect(() => {
    if (profileResponse?.data) {
      const u = profileResponse.data;
      setProfileData(u);

      // Set stats from API
      setStatData({
        totalProperty: u.stats?.totalProperty ?? 0,
        totalShare: u.stats?.totalShare ?? 0,
        totalView: u.stats?.totalView ?? 0,
        totalSaved: u.stats?.totalSaved ?? 0,
      });

      setEditFormData({
        name: u.profile.name || "",
        phone: u.profile.phone || "",
        street: u.profile.street || "",
        city: u.profile.city || "",
        zipCode: u.profile.zipCode || "",
        region: u.profile.region || "",
        country: u.profile.country || "",
        description: u.profile.description || "",
      });

      setImagePreview(u?.profile?.avatar);
      setAvatarFile(null);
    }
  }, [profileResponse]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      appAlert.fire({
        icon: "error",
        title: "File Too Large",
        text: "The file size exceeds the 2MB limit. Please choose a smaller file.",
      });
      return;
    }
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      appAlert.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPEG and PNG image files are allowed.",
      });
      return;
    }

    // preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setAvatarFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  // ✅ IMPORTANT: send as form-data like Postman:
  // avatar = File
  // data = JSON string
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const payload: UpdateProfilePayload = {
        name: editFormData.name || "",
        phone: editFormData.phone || "",
        street: editFormData.street || "",
        city: editFormData.city || "",
        zipCode: editFormData.zipCode || "",
        region: editFormData.region || "",
        country: editFormData.country || "",
        description: editFormData.description || "",
      };

      // ✅ Postman style: "data" text field contains JSON string
      formData.append("data", JSON.stringify(payload));

      // ✅ Postman style: avatar file field
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // debug (optional)
      console.log("=== Update Profile FormData ===");
      for (const [k, v] of formData.entries()) {
        console.log(k, v instanceof File ? `FILE: ${v.name}` : v);
      }

      const res = await updateProfile(formData).unwrap();

      appAlert.fire({
        icon: "success",
        title: "Success!",
        text: res?.message || "Profile Updated!",
        confirmButtonText: "OK",
      });

      // If backend returns updated user
      if (res?.data) {
        setProfileData(res.data);
        setImagePreview(res.data?.profile?.avatar);
      }

      setIsEditModalOpen(false);
      setAvatarFile(null);
    } catch (err: unknown) {
      console.log("Update profile error:", err);

      const message =
        typeof err === "object" && err !== null && "data" in err
          ? // @ts-expect-error RTK error shape
          (err?.data?.message as string) || "Failed to save changes."
          : "Failed to save changes.";

      appAlert.fire({
        icon: "error",
        title: "Error!",
        text: message,
        confirmButtonText: "OK",
      });
    }
  };

  const hasValue = (value: string | null | undefined) =>
    !!value && value.trim() !== "";

  const getValidImageSrc = (value: string | null | undefined) => {
    const trimmedValue = value?.trim();
    return trimmedValue ? getImageUrl(trimmedValue) : null;
  };

  const ProfileField = ({
    label,
    value,
  }: {
    label: string;
    value: string | null | undefined;
  }) => {
    if (!hasValue(value)) return null;
    return (
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-900">{value}</span>
      </div>
    );
  };
  const user = profileData;
  const profileAvatarSrc = getValidImageSrc(user.profile.avatar);
  const previewImageSrc = getValidImageSrc(imagePreview);

  // console.log("Profile Data:", statData);

  if (isLoading) return <Spinner />;



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 md:px-8 py-4 bg-white">
        <p className="text-sm text-gray-400">Setting</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 h-fit">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-12 text-gray-900">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mb-4 overflow-hidden">
                  {profileAvatarSrc ? (
                    <Image
                      src={profileAvatarSrc}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl font-bold text-gray-600">👤</div>
                  )}
                </div>

                {hasValue(user.profile.name) && (
                  <h3 className="text-lg font-bold text-gray-900">
                    {user.profile.name}
                  </h3>
                )}
              </div>

              <div className="mt-6 space-y-4 border-t border-gray-200 pt-6">
                <ProfileField label="Email" value={user.email} />
                <ProfileField label="Phone" value={user.profile.phone} />
                <ProfileField label="Street" value={user.profile.street} />
                <ProfileField label="City" value={user.profile.city} />
                <ProfileField label="Region" value={user.profile.region} />
                <ProfileField label="Country" value={user.profile.country} />
                <ProfileField label="Post Code" value={user.profile.zipCode} />
              </div>
            </div>
          </div>

          {/* Right column content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
              {/* ===== MY Details ===== */}
              <div className="flex items-start justify-between gap-x-6 gap-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">MY Details</h2>

                <button
                  onClick={() => {
                    setEditFormData({
                      name: profileData.profile.name || "",
                      phone: profileData.profile.phone || "",
                      street: profileData.profile.street || "",
                      city: profileData.profile.city || "",
                      zipCode: profileData.profile.zipCode || "",
                      region: profileData.profile.region || "",
                      country: profileData.profile.country || "",
                      description: profileData.profile.description || "",
                    });
                    setImagePreview(profileData?.profile?.avatar);
                    setAvatarFile(null);
                    setIsEditModalOpen(true);
                  }}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                  aria-label="Edit profile"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm">
                {user.profile.description || "No description yet."}
              </p>

              {/* ===== Divider spacing ===== */}
              <div className="mt-8" />

              {/* ===== Property Status ===== */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Property Status
              </h3>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {/* <StatusCard
                  value={totalProperty ?? 0}
                  label="Total Property"
                  icon={<PropertyIcon />}
                /> */}

                <StatusCard
                  value={statData?.totalProperty ?? 0}
                  label="Total Property"
                  icon={<PropertyIcon />}
                />

                <StatusCard
                  value={statData?.totalShare ?? 0}
                  label="Total Share"
                  icon={<ShareIcon />}
                />

                <StatusCard
                  value={statData?.totalView ?? 0}
                  label="Total View"
                  icon={<ViewIcon />}
                />

                <StatusCard
                  value={statData?.totalSaved ?? 0}
                  label="Total Saved"
                  icon={<SavedIcon />}
                />
              </div>
            </div>
          </div>




          {/*  */}

        </div>

        {/* All Active Properties */}

        {/* <div className="mb-10">
          <h1>fgsdfgsrgsregseg</h1>
        </div> */}

        {/* <ActivePropertiesSection /> */}

        {/*  */}

        {/* <div className="h-fit mb-10">
          <ValuationCalculator />
        </div> */}


        {/* Change Password Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
            Change Password
          </h2>
          <ChangePasswordForm />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        // onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 p-6 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={editFormData.street || ""}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                />
              </div>

              {/* City, Region, Country, ZipCode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={editFormData.region || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={editFormData.country || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={editFormData.zipCode || ""}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004E60]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging
                    ? "border-[#004E60] bg-blue-50"
                    : "border-gray-300"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {previewImageSrc ? (
                    <div className="space-y-3">
                      <Image
                        src={previewImageSrc}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full mx-auto object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setAvatarFile(null);
                        }}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500">Drag & drop or browse</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="mt-2 inline-block px-4 py-2 bg-[#004E60] text-white rounded cursor-pointer"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 bg-[#004E60] text-white rounded-lg disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




// -------------------------------------------------------------------------------------------------------------------------------




function StatusCard({
  value,
  label,
  icon,
}: {
  value: number | string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="text-sm font-medium text-gray-500 mb-1">
          {label}
        </div>
        <div className="text-3xl font-bold text-gray-900 leading-none">
          {String(value).padStart(2, "0")}
        </div>
      </div>

      <div className="text-[#A88D63] bg-[#A88D63]/10 p-3 rounded-lg">
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}




// -------------------------------------------------------------------------------------------------------------------------------



function PropertyIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 52V24L32 10v42H10z" />
      <path d="M32 20l22-10v42H32" />
      <path d="M18 52V40h8v12" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="18" r="8" />
      <circle cx="18" cy="44" r="8" />
      <circle cx="46" cy="44" r="8" />
      <path d="M25 22L21 36" />
      <path d="M39 22l4 14" />
      <path d="M26 44h12" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 32s10-16 26-16 26 16 26 16-10 16-26 16S6 32 6 32z" />
      <circle cx="32" cy="32" r="7" />
    </svg>
  );
}

function SavedIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 10h28a4 4 0 014 4v40l-18-10-18 10V14a4 4 0 014-4z" />
    </svg>
  );
}
