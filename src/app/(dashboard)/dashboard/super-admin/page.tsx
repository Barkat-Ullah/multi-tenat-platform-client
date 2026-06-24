/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, Row, Col } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EyeOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";
import Spinner from "@/components/ui/Spinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Stats Card Component
const StatsCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string; }) => (
  <Card variant="borderless" className="shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      </div>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

const SuperAdminDashboard = () => {
  // Backendless / API-less local statistics state
  const statsResponse = {
    data: {
      customerCount: 156,
      agencyCount: 42,
      totalIncome: 24850,
      subscriptionCount: 98,
    },
  };
  const statsLoading = false;

  const totalUsers =
    (statsResponse?.data?.customerCount ?? 0) + (statsResponse?.data?.agencyCount ?? 0);

  const statsData = [
    { title: "Total Income", value: statsResponse?.data?.totalIncome ?? 0, icon: <FileTextOutlined />, color: "#F97316" },
    { title: "Total Users", value: totalUsers, icon: <UserOutlined />, color: "#1E293B" },
    { title: "Active Subscriptions", value: statsResponse?.data?.subscriptionCount ?? 0, icon: <EyeOutlined />, color: "#EF4444" },
    { title: "Super Admin Status", value: "Active", icon: <SafetyCertificateOutlined />, color: "#00B2D6" },
  ];

  if (statsLoading) return <Spinner />;

  const barData = [
    { name: "Users", count: totalUsers },
    { name: "Subscriptions", count: statsResponse?.data?.subscriptionCount ?? 0 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 font-poppins text-center md:text-left">
        Super Admin Control Panel
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat, index) => (
          <div key={index}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24}>
          <Card variant="borderless" className="shadow-sm" title={<span className="text-lg font-bold">Platform Wide Analytics</span>}>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="count" fill="#00B2D6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SuperAdminDashboard;
