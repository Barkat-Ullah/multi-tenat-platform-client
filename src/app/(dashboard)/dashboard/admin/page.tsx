/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Tag,
  Dropdown,
  Button,
  MenuProps,
  Space,
} from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  EyeOutlined,
  HomeOutlined,
  MoreOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Search } from "lucide-react";
import Image from "next/image";
import { useGetAdminStatisticsQuery } from "@/redux/service/admin/dashboardApi";
import {
  useGetAdminPropertiesQuery,
  useTogglePropertyBlockMutation,
  useTogglePropertyVerifyMutation
} from "@/redux/service/admin/propertiesApi";
import Spinner from "@/components/ui/Spinner";
import { appAlert } from "@/utils/appAlert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

interface PropertyData {
  key: string;
  propertyId: string;
  image: string;
  title: string;
  date: string;
  listerName: string;
  propertyType: string;
  location: string;
  price: string;
  status: "Verified" | "Unverified" | "Blocked";
}

const AdminDashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [verified] = useTogglePropertyVerifyMutation();
  const [blocked] = useTogglePropertyBlockMutation();

  const { data: adminStats, isLoading: statsLoading } = useGetAdminStatisticsQuery();
  const { data: propertiesResponse, isLoading: propertiesLoading } = useGetAdminPropertiesQuery({
    page: currentPage,
    limit: 10,
    search: searchText
  });

  // Mapping the API data to the table format
  const propertyData: PropertyData[] = (propertiesResponse?.data || []).map((prop: any) => {
    const imageUrl = prop.images?.[0] || <FileImageOutlined />;
    const formattedDate = new Date(prop.createdAt).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    return {
      key: prop.id,
      propertyId: ` ${prop.uuid}`,
      image: imageUrl || <FileImageOutlined />,
      title: prop.title,
      date: formattedDate,
      listerName: prop.operator?.name || "Unknown",
      propertyType: prop.type || "N/A",
      location: prop.address || "No address provided",
      price: prop.price ? `${prop.price.toLocaleString()}` : "N/A",
      status: prop.blocked ? "Blocked" : prop.verified ? "Verified" : "Unverified",
    };
  });

  const handleAction = async (key: string, propertyId: string) => {
    try {
      let res: any;
      if (key === "verified") res = await verified(propertyId).unwrap();
      if (key === "blocked") res = await blocked(propertyId).unwrap();
      if (key === "view") return window.location.href = `/dashboard/admin/all-properties/${propertyId}`;

      if (res?.success) {
        appAlert.fire({ icon: 'success', title: 'Success', text: res.message });
      }
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const getActionMenu = (record: PropertyData): MenuProps => ({
    items: [
      { key: "view", label: "View Details" },
      { key: "verified", label: record.status === "Verified" ? "Unverify Property" : "Verify Property" },
      { key: "blocked", label: record.status === "Blocked" ? "Unblock Property" : "Block Property" },
    ],
    onClick: ({ key }) => handleAction(key, record.key),
  });

  const columns: ColumnsType<PropertyData> = [
    {
      title: "Property",
      dataIndex: "propertyId",
      key: "propertyId",
      render: (_: string, record: PropertyData) => (
        <Space size="middle">
          {/* Property Image */}
          <div className="relative w-[40px] h-[40px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={record.image || "/placeholder-property.jpg"}
              alt={record.title || "Property Image"}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>

          {/* Property Info */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {record.title || "Untitled Property"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              ID: {record.propertyId}
            </p>
          </div>
        </Space>
      ),
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },

    {
      title: "Lister Name",
      dataIndex: "listerName",
      key: "listerName",
      width: 150,
    },

    {
      title: "Property Type",
      dataIndex: "propertyType",
      key: "propertyType",
      width: 150,
    },

    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 200,
      render: (text: string) => (
        <span className="text-sm text-gray-700 truncate block">
          {text || "N/A"}
        </span>
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => (
        <span className="font-medium text-gray-800">
          €{price?.toLocaleString() || 0}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => {
        let color: "success" | "error" | "default" | "warning" = "default";

        if (status === "Verified") color = "success";
        else if (status === "Blocked") color = "error";
        else if (status === "Unverified") color = "warning";

        return (
          <Tag color={color} className="font-medium px-2 py-[2px]">
            {status}
          </Tag>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={getActionMenu(record)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="flex items-center justify-center"
          />
        </Dropdown>
      ),
    },
  ];

  const totalUsers =
    (adminStats?.data?.customerCount ?? 0) + (adminStats?.data?.agencyCount ?? 0);

  const statsData = [
    { title: "Total Income", value: adminStats?.data?.totalIncome ?? 0, icon: <FileTextOutlined />, color: "#F97316" },
    { title: "Total Users", value: totalUsers, icon: <UserOutlined />, color: "#1E293B" },
    { title: "Total Subscribed", value: adminStats?.data?.subscriptionCount ?? 0, icon: <EyeOutlined />, color: "#EF4444" },
    { title: "Total Properties", value: adminStats?.data?.propertyCount ?? 0, icon: <HomeOutlined />, color: "#9CA3AF" },
  ];

  if (statsLoading || propertiesLoading) return <Spinner />;

  const barData = [
    { name: "Users", count: totalUsers },
    { name: "Properties", count: adminStats?.data?.propertyCount ?? 0 },
    { name: "Subscriptions", count: adminStats?.data?.subscriptionCount ?? 0 },
  ];

  const pieData = [
    { name: "Users", value: totalUsers, color: "#1E293B" },
    { name: "Properties", value: adminStats?.data?.propertyCount ?? 0, color: "#3BB273" },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 font-poppins text-center md:text-left">Dashboard Overview</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        {statsData.map((stat, index) => (
          <div className="flex-1 min-w-[200px]" key={index}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} lg={16}>
          <Card variant="borderless" className="shadow-sm" title={<span className="text-lg font-bold">Platform Overview</span>}>
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
                  <Bar dataKey="count" fill="#004E60" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card variant="borderless" className="shadow-sm" title={<span className="text-lg font-bold">User Distribution</span>}>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card variant="borderless" className="shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 font-poppins">All Properties</h2>
          <Input
            placeholder="Search property..."
            suffix={<Search size={16} className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-full w-full sm:max-w-xs md:max-w-md"
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={propertyData}
          pagination={{
            // position: ["bottomCenter"],
            current: currentPage,
            pageSize: pageSize,
            total: propertiesResponse?.pagination?.total,
            size: "small",
            onChange: (page, size) => {
              setCurrentPage(page);
              // update current page
              if (size && size !== pageSize) setPageSize(size);
              // update pageSize
            },
            showSizeChanger: false,
          }}
          scroll={{ x: 1200 }}
          className="custom-table"
          size="small"
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
