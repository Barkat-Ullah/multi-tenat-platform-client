/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Table, Button, Dropdown, Input, Tag } from "antd";
import { Search, MoreVertical } from "lucide-react";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Property, useGetAgencyPropertiesQuery } from "@/redux/service/agent/propertiesApi";
import Spinner from "../ui/Spinner";
import { useDeletePropertyMutation } from "@/redux/service/admin/propertiesApi";
import { toast } from "sonner";

interface AgentPropertyTableProps {
  title?: string;
  statusDropdown?: boolean;
  onAction?: (key: string, record: Property) => void;
}

export const AgentPropertyTable: React.FC<AgentPropertyTableProps> = ({
  title = "Properties",
  // statusDropdown = true,
  onAction,
}) => {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const { data: apiResponse, isLoading, isFetching } = useGetAgencyPropertiesQuery({
    page,
    limit: 5,
    search: searchText,
  });
  const [deleteProperty] = useDeletePropertyMutation()
  const handleMenuClick = (key: string, record: Property): void => {
    if (onAction) onAction(key, record);
  };
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId).unwrap()
      toast.success("Property deleted successfully!")
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  if (isLoading || isFetching) return <Spinner />;

  //  Correctly typed columns with safe access
  const columns: ColumnsType<Property> = [
    {
      title: "Property Id",
      dataIndex: "id",
      key: "id",
      width: 250,
      render: (id: string, record: Property) => (
        <div className="flex items-center gap-3">
          <Image
            width={40}
            height={40}
            src={record.images && record.images.length > 0
              ? record.images[0]
              : "/placeholder.png"}
            alt="Property"
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <div className="font-medium text-sm">{record.title}</div>
            <div className="text-xs text-gray-500">ID: {id.slice(-6)}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
    },
    {
      title: "Property Type",
      dataIndex: "type",
      key: "propertyType",
      width: 150,
      render: (type: string) => type.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "location",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Price",
      key: "price",
      width: 120,
      render: (_: any, record: Property) => {
        const price = record.financialInfos?.askingPrice ?? 0;
        return `$${price.toLocaleString()}`;
      },
    },
    {
      title: "Status",
      dataIndex: "verified",
      key: "status",
      width: 120,
      render: (verified: boolean) => (
        <Tag color={verified ? "green" : "red"}>
          {verified ? "Verified" : "Unverified"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record: Property) => {
        const menuItems: MenuProps["items"] = [
          {
            key: "view",
            label: <Link href={`/all-property/${record.id}`}>View Details</Link>,
          },
          { key: "edit", label: <Link href={`/dashboard/user/all-properties/edit-property/${record?.id}`}>Edit Details</Link> },
          { key: "delete", label: <button onClick={() => handleDeleteProperty(record?.id)} className="text-red-600">Remove</button> },
        ];

        return (
          <Dropdown
            menu={{
              items: menuItems,
              onClick: ({ key }) => handleMenuClick(key, record)
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreVertical size={16} />} />
          </Dropdown>
        );
      },
    },
  ];

  //  Correct data extraction (your API returns flat array under .data)
  const rawData = apiResponse?.data || [];

  // Optional client-side filtering (if needed)
  const filteredData = searchText
    ? rawData.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.address && item.address.toLowerCase().includes(searchText.toLowerCase()))
    )
    : rawData;

  // Calculate total correctly
  const totalItems = apiResponse?.pagination?.total || filteredData.length;

  const tableProps: TableProps<Property> = {
    columns,
    dataSource: filteredData,
    rowKey: "id",
    pagination: {
      current: page,
      pageSize: 5,
      total: totalItems,
      size: "small",
      onChange: (newPage) => setPage(newPage),
      // position: ["bottomCenter"],
      showSizeChanger: false,
      className: "mt-4",
    },
    scroll: { x: 1200 },
    loading: isFetching,
    className: "custom-table",
    size: "small",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search title or address..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchText}
            onChange={handleSearchChange}
            className="w-64 rounded-full"
            allowClear
          />
        </div>
      </div>

      <Table {...tableProps} />
    </div>
  );
};