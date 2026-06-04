/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Drawer, Dropdown, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { useGetProfileDataQuery } from "@/redux/service/profile/profileApi";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";
import { Logo } from "@/components/ui/Logo";
import { TopBar } from "@/components/layout/TopBar";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const { Text } = Typography;

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Get auth state from Redux
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const role = normalizeRole(user?.role);

  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  };
  
  const isAuthenticated = !!accessToken && !!user;
  
  // 👤 Get full profile data for avatar and name
  const { data: profileResponse } = useGetProfileDataQuery(undefined, { skip: !isAuthenticated });
  const profile = profileResponse?.data?.profile;
  
  const avatarUrl = profile?.avatar?.trim() || null;
  const displayName = profile?.name || user?.name || user?.email?.split("@")[0] || "User";
  const fallbackInitial = (displayName?.[0] || user?.email?.[0] || "U").toUpperCase();

  // ===== Navigation Links =====
  const navLinks = [
    { href: "/#hgv-bus", label: "HGV/Bus Medicals" },
    { href: "/#taxi", label: "Taxi Medicals" },
    { href: "/#other", label: "Other Medicals" },
    { href: "/#business", label: "Business" },
    { href: "/#occupational", label: "Occupational Health" },
    { href: "/#location", label: "Location" },
    { href: "/#faq", label: "FAQ's" },
  ];

  const isActive = (href: string) => pathname === href;

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
    const handleScrollAndResize = () => {
      const currentScroll = window.scrollY;
      const isDesktop = window.innerWidth >= 1024;
      
      const stickyThreshold = isDesktop ? 38 : 5;
      setIsSticky(currentScroll > stickyThreshold);
      
      if (navbarRef.current) {
        if (isDesktop) {
          const translateY = Math.min(currentScroll, 38);
          navbarRef.current.style.transform = `translateY(-${translateY}px)`;
        } else {
          navbarRef.current.style.transform = "translateY(0px)";
        }
      }
    };
    
    handleScrollAndResize();
    window.addEventListener("scroll", handleScrollAndResize, { passive: true });
    window.addEventListener("resize", handleScrollAndResize, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
    };
  }, []);

  // ===== Mobile Drawer =====
  const MobileDrawer = () => {
    return (
      <Drawer
        title={
          <Link href="/" className="font-bold">
            <Logo />
          </Link>
        }
        placement="left"
        width={300}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={false}
        extra={
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-[#E6FAFF] text-[#00B2D6] border-l-4 border-[#00B2D6]"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#00B2D6]"
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
                <Dropdown
                  menu={{ items: avatarMenuItems }}
                  trigger={["click"]}
                  arrow
                >
                  <div className="flex items-center gap-3 w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#00B2D6] flex items-center justify-center border-2 border-white shadow-sm flex-shrink-0">
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
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        {role}
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
                  className="w-full inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-6 pr-1.5 py-1.5 font-sans font-bold text-white hover:bg-[#0092B3]"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-sm font-semibold tracking-wide">Log In</span>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00B2D6]">
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    );
  };

  return (
    <div className="w-full">
      {/* Placeholder to reserve space in document flow and prevent layout shift */}
      <div className="h-[73px] lg:h-[111px]" />

      {/* Fixed Container wrapping both TopBar and Main Navbar */}
      <div
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 z-50 w-full"
      >
        {/* Top Bar */}
        <TopBar />

        {/* Main Navbar */}
        <div
          className={cn(
            "bg-white border-b border-gray-100 w-full transition-shadow duration-300",
            isSticky ? "shadow-md" : "shadow-none"
          )}
        >
        {/* Desktop Navbar */}
        <div className="hidden lg:flex container mx-auto py-4 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold">
            <Logo />
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] xl:text-[15px] font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-[#00B2D6]"
                    : "text-[#0F2E4A] hover:text-[#00B2D6]"
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
                <Dropdown menu={{ items: avatarMenuItems }} trigger={["click"]}>
                  <div className="flex items-center gap-2 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-gray-200">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#00B2D6] flex items-center justify-center flex-shrink-0">
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
                    <span className="text-sm font-semibold text-[#0F2E4A] hidden md:inline">
                      {displayName}
                    </span>
                    <DownOutlined className="text-xs text-gray-500" />
                  </div>
                </Dropdown>
              </>
            ) : (
              // Guest: Log In Pill Button
              <Link
                href="/login"
                className="inline-flex items-center justify-between rounded-full bg-[#00B2D6] pl-6 pr-1.5 py-1.5 font-sans font-bold text-white transition-all duration-300 hover:bg-[#0092B3] group"
              >
                <span className="text-sm font-semibold tracking-wide mr-4">Log In</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00B2D6] group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex lg:hidden items-center justify-between px-6 py-4 bg-white">
          <Link href="/" className="font-bold">
            <Logo />
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Open menu"
          >
            <IoMenu size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Drawer */}
    <MobileDrawer />
  </div>
  );
}
