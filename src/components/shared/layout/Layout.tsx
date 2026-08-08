"use client";

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layout, Menu, Spin, Dropdown } from "antd";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Bell, Menu as LucideMenu } from "lucide-react";
import Cookies from "js-cookie";
import logo from "@/assets/logo/logo.png";
import { logout } from "@/redux/features/auth";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { getDashboardPathByRole, normalizeRole } from "@/utils/roles";
import { useGetProfileDataQuery } from "@/redux/service/profile/profileApi";
import { getImageUrl } from "@/utils/getImageUrl";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const authUser = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const { data: profileResponse } = useGetProfileDataQuery(undefined, {
    skip: !authUser || !accessToken,
  });
  const profileData = profileResponse?.data;

  const user = useMemo(() => {
    if (!authUser) return null;
    return {
      role: authUser.role,
      email: authUser.email,
      profile: {
        name: profileData?.fullName || profileData?.profile?.name || authUser.name,
        avatar: profileData?.image || profileData?.profile?.avatar || "",
      }
    };
  }, [authUser, profileData]);

  const isLoading = false;


  const menuToRender = menu || [];
  const selectedKey = useMemo(() => {
    if (!menuToRender.length) return "";

    const exactMatch = menuToRender.find((item) => item.key === pathname);
    if (exactMatch) return exactMatch.key;

    const nestedMatch = menuToRender.find((item) => {
      if (item.key === "/dashboard/admin" || item.key === "/dashboard/super-admin") {
        return false;
      }
      return pathname.startsWith(`${item.key}/`) || pathname.startsWith(`${item.key}?`);
    });

    if (nestedMatch) return nestedMatch.key;

    return menuToRender[0]?.key || "/dashboard/admin";
  }, [menuToRender, pathname]);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const redirectIfLoggedOut = () => {
      const hasCookieToken = Boolean(Cookies.get("accessToken"));
      if (!authUser || !accessToken || !hasCookieToken) {
        router.replace("/login");
      }
    };

    redirectIfLoggedOut();

    const handlePageShow = () => redirectIfLoggedOut();
    const handleFocus = () => redirectIfLoggedOut();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        redirectIfLoggedOut();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [accessToken, authUser, router]);

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
  const notificationsPath = `${getDashboardPathByRole(user?.role)}/notifications`;

  const avatarUrl = useMemo(() => {
    const url = user?.profile?.avatar?.trim();
    return url && url.length > 0 ? getImageUrl(url) : null;
  }, [user?.profile?.avatar]);

  const fallbackInitial = useMemo(() => {
    const initial =
      user?.profile?.name?.trim()?.[0] ||
      user?.email?.trim()?.[0] ||
      "U";
    return initial.toUpperCase();
  }, [user?.profile?.name, user?.email]);

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
        trigger={null}
        breakpoint="lg"
        collapsed={false}
        theme="light"
        className={`!bg-[#F0F9FF] !border-r !border-sky-100/50 fixed lg:relative h-full z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
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
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <LucideMenu size={22} />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[160px] sm:max-w-none">
              <span className="hidden xs:inline">Welcome Back, </span>
              <span className="xs:hidden">Hi, </span>
              {displayName}!
            </h2>
          </div>

          {/* Right Action Bar containing Bell Notification & Profile Dropdown */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href={notificationsPath}
              aria-label="Notifications"
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border-none bg-[#E6FAFF] text-[#00B2D6] outline-none transition-all hover:scale-105 hover:bg-[#D0F3FC] active:scale-95"
            >
              <Bell size={20} className="stroke-[2.25]" />
            </Link>

            <Dropdown
              menu={{ items: profileMenuItems }}
              placement="bottomRight"
              arrow
            >
              <div className="hidden items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 lg:flex">
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
            color: #0f2e4a !important;
            font-weight: 600 !important;
            font-family: "Poppins", sans-serif !important;
            border-radius: 12px !important;
            transition: all 0.2s ease-in-out !important;
            margin: 4px 0 !important;
          }
          .ant-menu-light .ant-menu-item .ant-menu-item-icon {
            color: #00b2d6 !important;
            font-size: 16px !important;
          }
          /* Hover state for normal (unselected) items */
          .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover {
            background-color: #e6faff !important;
            color: #00b2d6 !important;
          }
          .ant-menu-light
            .ant-menu-item:not(.ant-menu-item-selected):hover
            .ant-menu-item-icon {
            color: #00b2d6 !important;
          }
          .ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):hover a {
            color: #00b2d6 !important;
          }
          /* Selected item states */
          .ant-menu-light .ant-menu-item-selected {
            background-color: #00b2d6 !important;
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
            background-color: #0092b0 !important; /* Slightly darker shade on hover for premium depth effect */
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
          .ant-layout-sider-zero-width-trigger {
            display: none !important;
          }
          .ant-dropdown-menu-item-danger {
            color: #ff4d4f !important;
          }
          .ant-dropdown-menu-item-danger:hover {
            background-color: #ff4d4f !important;
            color: #ffffff !important;
          }
          .ant-dropdown-menu-item-danger:hover svg {
            color: #ffffff !important;
            stroke: #ffffff !important;
          }

          .ant-layout-sider-zero-width-trigger {
            display: none !important;
          }
        `}</style>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
