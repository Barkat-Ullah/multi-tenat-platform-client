/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { DownOutlined, HeartFilled, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Drawer, Dropdown, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import logo from "@/assets/logo/logo.png";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store"; // 👈 adjust path if needed
import { logout } from "@/redux/features/auth"; // 👈 your logout action
import Cookies from "js-cookie";
import { useGetProfileDataQuery } from "@/redux/service/profile/profileApi";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";

const { Text } = Typography;

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 🔑 Get auth state from Redux
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const role = normalizeRole(user?.role);


  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout())
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
  }
  const isAuthenticated = !!accessToken && !!user;
  
  // 👤 Get full profile data for avatar and name
  const { data: profileResponse } = useGetProfileDataQuery(undefined, { skip: !isAuthenticated });
  const profile = profileResponse?.data?.profile;
  
  const avatarUrl = profile?.avatar?.trim() || null;
  const displayName = profile?.name || user?.name || user?.email?.split("@")[0] || "User";
  const roleName = normalizeRole(profileResponse?.data?.role || user?.role);

  const fallbackInitial = (displayName?.[0] || user?.email?.[0] || "U").toUpperCase();

  // ===== Navigation Links =====
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#demo", label: "Demo" },
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact Us" },

  ];

  const isActive = (href: string) => pathname === href;

  // ===== Profile Dropdown Menu =====
  // ===== Profile Dropdown Menu =====
  const avatarMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Link href="/profile" className="block w-full">
          <Text strong>View Profile</Text>
        </Link>
      ),
    },
    // Conditionally add Dashboard link
    ...(role
      ? [
        {
          key: "dashboard",
          label: (
            <Link href={getDashboardPathByRole(role)} className="block w-full">
              <Text strong>Dashboard</Text>
            </Link>
          ),
        },
      ]
      : []),
    { type: "divider" },
    {
      key: "logout",
      label: (
        <Text
          onClick={() => handleLogOut()}
          className="!w-full block text-red-600 hover:text-red-800"
          strong
        >
          Log Out
        </Text>
      ),
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== Mobile Drawer =====
  const MobileDrawer = () => {
    return (
      <Drawer
        title={
          <Link href="/" className="font-bold text-xl text-[#8B7355]">
            <Image
              src={logo}
              width={100}
              height={100}
              alt="logo"
              className="h-8 w-auto"
            />
          </Link>
        }
        placement="left"
        width={280}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={false}
        extra={
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <IoClose size={20} className="text-gray-700" />
          </button>
        }
        styles={{
          body: { padding: 0 },
          header: {
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#fff",
          },
          content: { backgroundColor: "#ffffff" },
        }}
      >
        {/* Main Nav */}
        <nav className="px-4 py-6">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive(link.href)
                  ? "bg-green-50 text-[#4CAF50] border-l-4 border-[#4CAF50]"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#4CAF50]"
                  }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Auth-Specific Actions */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-5">
          <div className="space-y-2">
            {isAuthenticated ? (
              <>
                {
                  role === "USER" &&
                  <Link
                    href="/dashboard/user/property-list/add-property"
                    className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 hover:border-[#4CAF50] hover:text-[#4CAF50] transition-all"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Listing</span>
                  </Link>
                }

                <div className="border-t border-gray-200 my-3"></div>

                <Dropdown
                  menu={{ items: avatarMenuItems }}
                  trigger={["click"]}
                  arrow
                >
                  <div className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#4CAF50] flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {fallbackInitial}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {roleName}
                      </p>
                    </div>
                    <DownOutlined className="text-gray-400 text-xs" />
                  </div>
                </Dropdown>
              </>
            ) : (
              // Guest: Show Sign In
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#3da800] to-[#4caf50] text-white font-bold rounded-full text-center hover:from-[#359200] hover:to-[#439e47] transition-all"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                {/* <Link
                  href="/register"
                  className="w-full px-4 py-3 bg-white border border-[#004E60] text-[#004E60] font-medium rounded-lg text-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Register
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </Drawer>
    );
  };

  return (
    <div className="w-full">
      {/* Sticky Navbar */}
      <div
        className={cn(
          "bg-white border-b border-gray-100 transition-all duration-300",
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 shadow-sm"
            : "relative shadow-sm",
        )}
      >
        {/* Desktop Navbar */}
        <div className="hidden lg:flex container py-3 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-[#8B7355]">
            <Image
              src={logo}
              width={120}
              height={120}
              alt="logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm md:text-[15px] font-medium transition-all duration-200 ${isActive(link.href)
                  ? "text-[#4CAF50]"
                  : "text-gray-600 hover:text-[#4CAF50]"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Actions - Desktop */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {
                  role === "USER" &&
                  <Link
                    href="/dashboard/user/property-list/add-property"
                    className="text-sm px-4 py-2 rounded-[16px] bg-[#4CAF50] text-white font-medium hover:bg-[#439e47] transition-colors"
                  >
                    Add Listing
                  </Link>
                }
                <Dropdown menu={{ items: avatarMenuItems }} trigger={["click"]}>
                  <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors border border-[#D4D4D4]">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#4CAF50] flex items-center justify-center flex-shrink-0">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">
                          {fallbackInitial}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800 hidden md:inline">
                      {displayName}
                    </span>
                    <DownOutlined className="text-xs text-gray-500" />
                  </div>
                </Dropdown>
              </>
            ) : (
              // Guest: Login & Register buttons
              <>
                <Link
                  href="/login"
                  className="text-sm px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3da800] to-[#4caf50] hover:from-[#359200] hover:to-[#439e47] text-white font-bold transition-all duration-200 shadow-sm"
                >
                  Sign In
                </Link>
                {/* <Link
                  href="/register"
                  className="text-sm px-4 py-2 rounded-[16px] border border-[#004E60] text-[#004E60] font-medium hover:bg-gray-50 transition-colors"
                >
                  Register
                </Link> */}
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
          <Link href="/" className="font-bold text-xl text-[#8B7355]">
            <Image
              src={logo}
              width={80}
              height={80}
              alt="logo"
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="p-2"
            aria-label="Open menu"
          >
            <IoMenu size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </div>
  );
}
