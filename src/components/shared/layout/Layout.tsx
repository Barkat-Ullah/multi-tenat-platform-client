"use client";

import React, { ReactNode, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Layout, Menu, Spin, Dropdown } from "antd";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Bell } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { logout } from "@/redux/features/auth";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { normalizeRole } from "@/utils/roles";

const { Sider, Header, Content } = Layout;

interface MenuItem {
  key: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}
interface AdminLayoutProps {
  children: ReactNode;
  menu?: MenuItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, menu }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get user profile details from Redux state to fully bypass any /me API calls on dashboard
  const authUser = useAppSelector((state) => state.auth.user);

  const user = useMemo(() => {
    if (!authUser) return null;
    return {
      role: authUser.role,
      email: authUser.email,
      profile: {
        name: authUser.name || "Osama",
        avatar: "", // Offline mode bypasses avatar fetch
      }
    };
  }, [authUser]);

  const isLoading = false;


  const menuToRender = menu || [];
  const selectedKey =
    menuToRender.find((item) => item.key === pathname)?.key ||
    menuToRender[0]?.key ||
    "/dashboard/admin";

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  // --- Dropdown Menu Items ---
  const profileMenuItems = [
    {
      key: "logout",
      label: "Log out",
      icon: <LogOut size={16} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const displayName = useMemo(() => {
    return user?.profile?.name || user?.email?.split("@")[0] || "User";
  }, [user?.profile?.name, user?.email]);

  const role = normalizeRole(user?.role);

  const avatarUrl = useMemo(() => {
    const url = user?.profile?.avatar?.trim();
    return url && url.length > 0 ? url : null;
  }, [user?.profile?.avatar]);

  const fallbackInitial = useMemo(() => {
    const initial =
      user?.profile?.name?.trim()?.[0] ||
      user?.email?.trim()?.[0] ||
      "U";
    return initial.toUpperCase();
  }, [user?.profile?.name, user?.email]);

  // --- Custom Notification Dropdown Content ---
  const notificationDropdown = (
    <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-4 w-80 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="font-bold text-[#0F2E4A] text-sm font-poppins">Notifications</h4>
        <span className="text-[10px] font-bold text-[#00B2D6] bg-[#E6FAFF] px-2 py-0.5 rounded-full">3 New</span>
      </div>
      <div className="space-y-3 max-h-[250px] overflow-y-auto">
        <div className="flex gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-[#00B2D6] mt-1.5 shrink-0 animate-ping" />
          <div>
            <p className="font-bold text-[#0F2E4A] leading-tight">New Booking Created</p>
            <p className="text-slate-500 mt-0.5 leading-snug">John Doe booked COVID Test at London East</p>
            <span className="text-[10px] font-semibold text-slate-400 block mt-1">5 mins ago</span>
          </div>
        </div>
        <div className="flex gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-[#00B2D6] mt-1.5 shrink-0 animate-ping" />
          <div>
            <p className="font-bold text-[#0F2E4A] leading-tight">Report Ready</p>
            <p className="text-slate-500 mt-0.5 leading-snug">Monthly compliance report is ready for download</p>
            <span className="text-[10px] font-semibold text-slate-400 block mt-1">1 hour ago</span>
          </div>
        </div>
        <div className="flex gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
          <div>
            <p className="font-bold text-gray-500 leading-tight">System Update</p>
            <p className="text-slate-400 mt-0.5 leading-snug">v2.1 dashboard successfully deployed</p>
            <span className="text-[10px] font-semibold text-slate-400 block mt-1">1 day ago</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 px-1">
        <button className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent">
          Mark all as read
        </button>
        <Link
          href="/dashboard/admin/notifications"
          className="text-[11px] font-bold text-[#00B2D6] hover:underline transition-all"
        >
          View all
        </Link>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width={240}
        collapsedWidth={0}
        breakpoint="lg"
        collapsed={false}
        theme="light"
        className={`!bg-[#F0F9FF] !border-r !border-sky-100/50 fixed lg:relative h-full z-50 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-center py-6 border-b border-sky-100/50 bg-[#F0F9FF]">
              <Link href="/" className="transition-opacity hover:opacity-90">
                <Image
                  src={logo}
                  width={180}
                  height={50}
                  alt="logo"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              style={{ backgroundColor: "transparent", border: "none" }}
              inlineIndent={16}
              className="mt-6 px-3 space-y-1"
              items={menuToRender.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
                className: item.className || "",
              }))}
            />
          </div>

          {/* Logout Button at bottom */}
          <div className="p-4 bg-[#F0F9FF] border-t border-sky-100/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-[#C2410C] rounded-xl bg-orange-50/20 hover:bg-orange-50/70 text-[#C2410C] hover:text-[#9A3412] transition-all duration-200 font-bold text-sm tracking-wide active:scale-[0.99]"
            >
              <LogOut size={16} className="text-[#C2410C]" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </Sider>

      <Layout className="min-h-screen">
        <Header
          style={{ padding: "0px 20px", height: "64px", lineHeight: "56px" }}
          className="bg-white shadow-md flex items-center justify-between z-10"
        >
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
            <span className="hidden xs:inline">Welcome Back, </span>
            <span className="xs:hidden">Hi, </span>
            {displayName}!
          </h2>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden block text-2xl text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Right Action Bar containing Bell Notification & Profile Dropdown */}
          <div className="hidden lg:flex items-center gap-4">
            <Dropdown popupRender={() => notificationDropdown} placement="bottomRight" arrow trigger={["click"]}>
              <button
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#E6FAFF] text-[#00B2D6] hover:bg-[#D0F3FC] hover:scale-105 active:scale-95 transition-all relative cursor-pointer border-none outline-none"
                aria-label="Notifications"
              >
                <Bell size={20} className="stroke-[2.25]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </Dropdown>

            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {fallbackInitial}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <div className="font-medium text-gray-800 leading-tight">
                    {displayName}
                  </div>
                  <h3 className="text-xs text-gray-500 leading-tight uppercase">
                    {role}
                  </h3>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          className="!overflow-y-auto !overflow-x-hidden p-4 md:p-6 !bg-white"
          style={{ minHeight: "calc(100vh - 140px)" }}
          onClick={() => setMobileOpen(false)}
        >
          {children}
        </Content>

        <style jsx global>{`
          .ant-menu-light .ant-menu-item {
            color: #0F2E4A !important;
            font-weight: 600 !important;
            font-family: 'Poppins', sans-serif !important;
            border-radius: 12px !important;
            transition: all 0.2s ease-in-out !important;
            margin: 4px 0 !important;
          }
          .ant-menu-light .ant-menu-item .ant-menu-item-icon {
            color: #00B2D6 !important;
            font-size: 16px !important;
          }
          /* Hover state for normal (unselected) items */
          .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover {
            background-color: #E6FAFF !important;
            color: #00B2D6 !important;
          }
          .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-item-icon {
            color: #00B2D6 !important;
          }
          .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover a {
            color: #00B2D6 !important;
          }
          /* Selected item states */
          .ant-menu-light .ant-menu-item-selected {
            background-color: #00B2D6 !important;
            color: white !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0, 178, 214, 0.15) !important;
          }
          .ant-menu-light .ant-menu-item-selected a {
            color: white !important;
          }
          .ant-menu-light .ant-menu-item-selected .ant-menu-item-icon {
            color: white !important;
          }
          /* Selected item hover states (remains solid cyan/teal) */
          .ant-menu-light .ant-menu-item-selected:hover {
            background-color: #0092B0 !important; /* Slightly darker shade on hover for premium depth effect */
            color: white !important;
          }
          .ant-menu-light .ant-menu-item-selected:hover a {
            color: white !important;
          }
          .ant-menu-light .ant-menu-item-selected:hover .ant-menu-item-icon {
            color: white !important;
          }
          .ant-dropdown-menu-item-danger {
            color: #ff4d4f !important;
          }
        `}</style>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
