/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, Button, Dropdown, Input, Select, Tag, Avatar, Space } from "antd";
import { Search, MoreVertical } from "lucide-react";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  useDeleteUserMutation,
  User,
  useUpdateUserStatusMutation,
} from "@/redux/service/admin/userApi";
import { UserRole, UserStatus } from "@/utils/types";
import { toast } from "sonner";
import { normalizeRole } from "@/utils/roles";


export type UserData = User & {
  profile?: {
    name?: string | null;
    avatar?: string | null;
    phone?: string | null;
  };
  method?: string;
  createdAt?: string;
};

interface UsersTableProps {
  data: UserData[];
  onAction?: (action: string, record: UserData) => void;
  setSearch?: (value: string) => void;
  setPage?: (value: number) => void;
  currentPage?: number;
  total?: number;
  pageSize?: number;
  setRole?: (value: UserRole | "ALL") => void;
  selectedRole?: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data,
  onAction,
  setSearch,
  setRole,
  selectedRole = "ALL",
  setPage,
  currentPage = 1,
  total = 0,
  pageSize = 5,
}) => {
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleUserStatusUpdate = async ({
    id,
    status,
  }: {
    id: string;
    status: UserStatus;
  }) => {
    try {
      const payload = {
        id,
        status,
      };
      console.log(payload)
      await updateUserStatus(payload).unwrap();
      toast.success("User status changed successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || "Failed to delete user");
    }
  };

  const handleMenuClick = async (key: string, record: UserData) => {
    if (key === "view") {
      onAction?.(key, record);
      return;
    }

    if (key === "delete") {
      await handleDeleteUser(record.id);
      return;
    }

    if (key === "active") {
      await handleUserStatusUpdate({ id: record.id, status: "ACTIVE" });
      return;
    }

    if (key === "inactive") {
      await handleUserStatusUpdate({ id: record.id, status: "INACTIVE" });
      return;
    }

    if (key === "blocked") {
      await handleUserStatusUpdate({ id: record.id, status: "BLOCKED" });
      return;
    }
  };

  const columns: ColumnsType<UserData> = [
    {
      title: "User",
      key: "user",
      width: 240,
      render: (_, record) => (
        <Space>
          <Avatar src={record.profile?.avatar || undefined}>
            {record.profile?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <div>
            <div className="font-medium text-gray-800">
              {record.profile?.name || "N/A"}
            </div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      width: 140,
      render: (_, record) => record.profile?.phone || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => {
        const normalizedRole = normalizeRole(role);
        const colorMap: Record<string, string> = {
          ADMIN: "purple",
          USER: "blue",
        };

        return <Tag color={colorMap[normalizedRole] || "default"}>{normalizedRole}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          ACTIVE: "green",
          INACTIVE: "red",
          BLOCKED: "volcano",
          PENDING: "orange",
        };

        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      width: 120,
      render: (verified: boolean) =>
        verified ? <Tag color="green">Verified</Tag> : <Tag color="red">Not Verified</Tag>,
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 120,
      render: (method: string) => {
        const colorMap: Record<string, string> = {
          GMAIL: "blue",
          MANUAL: "default",
        };

        return <Tag color={colorMap[method] || "default"}>{method || "N/A"}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => (value ? new Date(value).toLocaleString() : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      fixed: "right",
      render: (_: unknown, record: UserData) => {
        const menuItems: MenuProps["items"] = [
          { key: "view", label: "View Details" },
          { type: "divider" },
          { key: "active", label: "Set Active" },
          { key: "inactive", label: "Set Inactive" },
          { key: "blocked", label: "Set Blocked" },
          { type: "divider" },
          { key: "delete", label: "Delete User", danger: true },
        ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => handleMenuClick(key, record),
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreVertical size={16} />} />
          </Dropdown>
        );
      },
    },
  ];

  const tableProps: TableProps<UserData> = {
    rowKey: "id",
    columns,
    dataSource: data,
    pagination: {
      current: currentPage,
      total,
      pageSize,
      size: "small",
      showSizeChanger: false,
      onChange: (page) => {
        setPage?.(page);
      },
    },
    scroll: { x: 1100 },
  };

  return (
    <div className="min-h-screen">
      <div className="rounded-lg bg-white shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-4 gap-4">
          <h2 className="text-lg font-semibold font-poppins">All Users</h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Input
              placeholder="Search by name or email"
              prefix={<Search size={16} className="text-gray-400" />}
              onChange={(e) => setSearch?.(e.target.value)}
              className="w-full sm:w-64 rounded-full"
              allowClear
            />

            <Select
              value={selectedRole}
              style={{ width: "100%" }}
              className="sm:w-[140px]"
              onChange={(value) => setRole?.(value as UserRole | "ALL")}
              options={[
                { value: "ALL", label: "All" },
                { value: UserRole.ADMIN, label: "Admin" },
                { value: UserRole.USER, label: "User" },
              ]}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table {...tableProps} size="small" className="custom-table" />
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden p-4 space-y-4">
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            data.map((record) => {
              const menuItems: MenuProps["items"] = [
                { key: "view", label: "View Details" },
                { type: "divider" },
                { key: "active", label: "Set Active" },
                { key: "inactive", label: "Set Inactive" },
                { key: "blocked", label: "Set Blocked" },
                { type: "divider" },
                { key: "delete", label: "Delete User", danger: true },
              ];

              return (
                <div key={record.id} className="border rounded-xl p-4 bg-gray-50 space-y-3 relative">
                  <div className="flex items-start gap-3">
                    <Avatar src={record.profile?.avatar || undefined} size={48} className="flex-shrink-0">
                      {record.profile?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="font-bold text-gray-900 truncate">
                        {record.profile?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{record.email}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Tag color={
                          normalizeRole(record.role) === "ADMIN" ? "purple" : "blue"
                        } className="m-0">
                          {normalizeRole(record.role)}
                        </Tag>
                        <Tag color={
                          record.status === "ACTIVE" ? "green" : 
                          record.status === "INACTIVE" ? "red" : 
                          record.status === "BLOCKED" ? "volcano" : "orange"
                        } className="m-0">
                          {record.status}
                        </Tag>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Dropdown
                        menu={{
                          items: menuItems,
                          onClick: ({ key }) => handleMenuClick(key, record),
                        }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <Button type="text" icon={<MoreVertical size={16} />} />
                      </Dropdown>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm pt-2 border-t border-gray-200">
                    <div className="col-span-1">
                      <div className="text-gray-500 text-xs">Phone</div>
                      <div className="font-medium truncate">{record.profile?.phone || "N/A"}</div>
                    </div>
                    <div className="col-span-1 text-right">
                      <div className="text-gray-500 text-xs text-right">Method</div>
                      <Tag color={record.method === "GMAIL" ? "blue" : "default"} className="m-0">
                        {record.method || "N/A"}
                      </Tag>
                    </div>
                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs">Joined</div>
                      <div className="font-medium">
                        {record.createdAt ? new Date(record.createdAt).toLocaleString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Mobile Pagination */}
          {total > pageSize && (
            <div className="flex justify-center pt-2 pb-4">
              <div className="flex items-center gap-4">
                <Button 
                  disabled={currentPage === 1} 
                  onClick={() => setPage?.(currentPage - 1)}
                  size="small"
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">{currentPage} / {Math.ceil(total / pageSize)}</span>
                <Button 
                  disabled={currentPage >= Math.ceil(total / pageSize)} 
                  onClick={() => setPage?.(currentPage + 1)}
                  size="small"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
