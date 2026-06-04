/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Table, Tag, Button, Dropdown, Input } from "antd";
import { Search, ChevronDown } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import Image from "next/image";
import { appAlert } from "@/utils/appAlert";
import { useDeletePropertyMutation, useTogglePropertyBlockMutation, useTogglePropertyVerifyMutation } from "@/redux/service/admin/propertiesApi";
import { useUpdatePropertyStatusMutation } from "@/redux/service/agent/propertiesApi";
import { MoreOutlined } from "@ant-design/icons";
import { getImageUrl } from "@/utils/getImageUrl";
import { usePathname } from "next/navigation";

// ----------------------- Types -----------------------
export interface PropertyData {
  key: string;
  propertyId: string;
  title: string;
  image: string;
  date: string;
  listerName: string;
  propertyType: string;
  location: string;
  price: number;
  setVerified?: boolean
  status?: string
  blocked?: boolean;
  verified?: boolean;
  uuid?: string
}

export interface PropertyTableProps {
  data: PropertyData[];
  onAction?: (action: string, record: PropertyData) => void;
  title?: string;
  statusDropdown?: boolean;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  verifiedStatus?: "Verified" | "Unverified" | null;
  setVerified?: (status: "Verified" | "Unverified" | null) => void;
  setPage?: (page: number) => void;
  total?: number;
  currentPage?: number;

}


// ------------------- Property Table -------------------
export const PropertyTable: React.FC<PropertyTableProps> = ({
  data,
  onAction,
  title = "All Property",
  statusDropdown = true,
  setVerified,
  setPage,
  searchTerm,
  setSearchTerm,
  total,
  currentPage,
  verifiedStatus
}) => {
  // const [deleteProperty] = useDeletePropertyMutation();
  const [verified] = useTogglePropertyVerifyMutation();
  const [blocked] = useTogglePropertyBlockMutation();
  const [deleteProperty] = useDeletePropertyMutation();
  const [updatePropertyStatus] = useUpdatePropertyStatusMutation();
  const pathName = usePathname()

  const handleAction = async (key: string, propertyId: string) => {
    try {
      let res: any;
      if (key === "view") return window.location.href = `/dashboard/admin/all-properties/${propertyId}`;
      if (key === "edit") return window.location.href = `/dashboard/admin/property-list/edit-property/${propertyId}`;

      if (key === "delete") {
        const result = await appAlert.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
          res = await deleteProperty(propertyId).unwrap();
          if (res?.success) {
            appAlert.fire('Deleted!', res.message || 'Property has been deleted.', 'success');
          }
        }
        return;
      }

      if (key === "verified") res = await verified(propertyId).unwrap();
      if (key === "blocked") res = await blocked(propertyId).unwrap();

      if (res?.success) {
        appAlert.fire({ icon: 'success', title: 'Success', text: res.message });
      }
    } catch (error: any) {
      console.error("Action failed:", error);
      appAlert.fire({
        icon: 'error',
        title: 'Error',
        text: error?.data?.message || error?.message || 'Something went wrong!'
      });
    }
  };
  const handleStatusChangeAction = async (propertyId: string, newStatus: string) => {
    try {
      const res = await updatePropertyStatus({ id: propertyId, status: newStatus }).unwrap();
      if (res?.success) {
        appAlert.fire({
          icon: 'success',
          title: 'Success',
          text: res.message || `Status updated to ${newStatus}`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error: any) {
      console.error("Status update failed:", error);
      appAlert.fire({
        icon: 'error',
        title: 'Error',
        text: error?.data?.message || error?.message || 'Failed to update status'
      });
    }
  };

  const getActionMenu = (record: PropertyData): MenuProps => ({
    items: [
      { key: "view", label: "View Details" },
      { key: "verified", label: record.status === "Verified" ? "Unverify Property" : "Verify Property" },
      { key: "blocked", label: record.blocked ? "Unblock Property" : "Block Property" },
      ...(pathName === "/dashboard/admin/agency-properties"
        ? [{ key: "edit", label: "Edit Property" }]
        : []),
      { key: "delete", label: "Delete Property", danger: true },
    ],
    onClick: ({ key }) => handleAction(key, record.key),
  });


  const columns: ColumnsType<PropertyData> = [
    {
      title: "Property Id",
      dataIndex: "propertyId",
      key: "propertyId",
      width: 200,
      render: (text: string, record: PropertyData) => (
        <div className="flex items-center gap-3">
          <Image
            width={40}
            height={40}
            src={getImageUrl(record.image)}
            alt="Property"
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <div className="font-medium text-sm">{record.title}</div>
            <div className="text-xs text-gray-500">ID: {record.uuid}</div>
          </div>
        </div>
      ),
    },
    { title: "Date", dataIndex: "date", key: "date", width: 120 },
    { title: "Lister Name", dataIndex: "listerName", key: "listerName", width: 150 },
    { title: "Property Type", dataIndex: "propertyType", key: "propertyType", width: 150 },
    { title: "Location", dataIndex: "location", key: "location", width: 180 },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => `€ ${price.toLocaleString()}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string, record: PropertyData) => {
        const isUserPropertyList = pathName === "/dashboard/user/property-list";

        if (isUserPropertyList) {
          const statusItems = [
            { key: "ACTIVE", label: "Active" },
            { key: "INACTIVE", label: "Inactive" },
            { key: "DRAFT", label: "Draft" },
            { key: "ARCHIVED", label: "Archived" },
            { key: "BOOKED", label: "Booked" },
          ];

          return (
            <Dropdown
              menu={{
                items: statusItems,
                onClick: ({ key }) => handleStatusChangeAction(record.key, key),
              }}
              trigger={["click"]}
            >
              <Tag
                color={status === "ACTIVE" ? "green" : "orange"}
                className="cursor-pointer flex items-center gap-1"
              >
                {status} <ChevronDown size={12} />
              </Tag>
            </Dropdown>
          );
        }

        return (
          <div className="flex flex-col gap-1">
            <Tag color={record.verified ? "green" : "red"}>
              {record.verified ? "Verified" : "Unverified"}
            </Tag>
            {record.blocked && <Tag color="volcano">Blocked</Tag>}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Handle search with debounce
  const handleSearch = (value: string) => {
    if (setSearchTerm) {
      setSearchTerm(value);
      if (setPage) setPage(1); // Reset to first page on new search
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (setPage) setPage(page);
  };

  // Status dropdown menu
  const filterMenuItems: MenuProps["items"] = [
    { key: "1", label: "All" },
    { key: "2", label: "Verified" },
    { key: "3", label: "Unverified" },
  ];

  const handleStatusChange = ({ key }: { key: string }) => {
    if (!setVerified) return;
    if (key === "1") setVerified(null);
    if (key === "2") setVerified("Verified");
    if (key === "3") setVerified("Unverified");
    if (setPage) setPage(1);
  };


  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              <Input
                placeholder="Search"
                prefix={<Search size={16} className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-64 md:w-80 rounded-full"
                allowClear
              />
              {statusDropdown && (
                <Dropdown
                  menu={{
                    items: filterMenuItems,
                    onClick: handleStatusChange,
                  }}
                  trigger={["click"]}
                >
                  <Button className="w-full sm:w-auto">
                    {verifiedStatus ?? "All"} <ChevronDown size={14} className="ml-1" />
                  </Button>
                </Dropdown>
              )}
            </div>
            <div className="w-full sm:w-auto">
              <Button href="/dashboard/admin/all-properties/add-properties" type="primary" className="w-full sm:w-auto">
                Add Property
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: total,
              size: "small",
              showSizeChanger: false,
              onChange: handlePageChange
            }}
            scroll={{ x: 1200 }}
            className="custom-table"
            rowKey="key"
            size="small"
          />
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden p-4 space-y-4">
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No properties found</div>
          ) : (
            data.map((record) => (
              <div key={record.key} className="border rounded-xl p-4 bg-gray-50 space-y-3 relative">
                <div className="flex items-start gap-3">
                  <Image
                    width={64}
                    height={64}
                    src={getImageUrl(record.image)}
                    alt="Property"
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{record.title}</div>
                    <div className="text-xs text-gray-500">ID: {record.uuid}</div>
                    <Tag color={record.status === "Verified" ? "green" : "red"} className="mt-1">
                      {record.status}
                    </Tag>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Dropdown menu={getActionMenu(record)} trigger={["click"]} placement="bottomRight">
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-gray-500 text-xs">Date</div>
                    <div className="font-medium">{record.date}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Price</div>
                    <div className="font-medium">€ {record.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Type</div>
                    <div className="font-medium">{record.propertyType}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Name</div>
                    <div className="font-medium text-xs truncate" title={record.listerName}>{record.listerName}</div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="text-gray-500 text-xs">Location</div>
                  <div className="font-medium truncate" title={record.location}>{record.location}</div>
                </div>
              </div>
            ))
          )}

          {/* Mobile Pagination */}
          {total !== undefined && total > 10 && (
            <div className="flex justify-center pt-2">
              <div className="flex items-center gap-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange((currentPage || 1) - 1)}
                  size="small"
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">{currentPage || 1} / {Math.ceil(total / 10)}</span>
                <Button
                  disabled={(currentPage || 1) >= Math.ceil(total / 10)}
                  onClick={() => handlePageChange((currentPage || 1) + 1)}
                  size="small"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: #0F4C75 !important;
          color: white !important;
          font-weight: 600;
          border: none;
        }
        .custom-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0;
          padding: 8px 16px !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background-color: #f9fafb !important;
        }
        .custom-table .ant-table-thead > tr > th {
          padding: 10px 16px !important;
        }
        .ant-pagination-item-active {
          background-color: #0F4C75 !important;
          border-color: #0F4C75 !important;
        }
        .ant-pagination-item-active a {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

