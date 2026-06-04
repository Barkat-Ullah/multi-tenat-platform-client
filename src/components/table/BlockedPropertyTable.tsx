import React, { useState } from "react";
import { Table, Button, Dropdown, Input } from "antd";
import { Search, MoreVertical } from "lucide-react";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { MenuProps } from "antd";

// TypeScript interfaces
export interface BlockedPropertyData {
  key: string;
  propertyId: string;
  date: string;
  listerName: string;
  propertyType: string;
  location: string;
  price: number;
  unit: number;
  status: "Blocked";
}

interface BlockedPropertyTableProps {
  data: BlockedPropertyData[];
  onAction?: (action: string, record: BlockedPropertyData) => void;
}

// Reusable BlockedPropertyTable Component
export const BlockedPropertyTable: React.FC<BlockedPropertyTableProps> = ({
  data,
  onAction,
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleMenuClick = (key: string, record: BlockedPropertyData): void => {
    if (onAction) {
      onAction(key, record);
    }
  };

  const columns: ColumnsType<BlockedPropertyData> = [
    {
      title: "Property Id",
      dataIndex: "propertyId",
      key: "propertyId",
      width: 150,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
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
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => price.toLocaleString(),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 80,
    },
    {
      title: "Statuses",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <span className="text-red-500 font-medium">{status}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_: unknown, record: BlockedPropertyData) => {
        const menuItems: MenuProps["items"] = [
          { key: "view", label: "View Details" },
          { key: "unblock", label: "Unblock" },
          { key: "delete", label: "Delete" },
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

  const filteredData: BlockedPropertyData[] = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const tableProps: TableProps<BlockedPropertyData> = {
    columns,
    dataSource: filteredData,
    pagination: {
      pageSize: 5,
      size: "small",
      showSizeChanger: false,
      position: ["bottomCenter"],
    },
    scroll: { x: 1200 },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-600">
            Blocked Property
          </h2>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search"
              prefix={<Search size={16} className="text-gray-400" />}
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value)
              }
              className="w-64"
            />
          </div>
        </div>

        <Table {...tableProps} size="small" className="custom-table" />
      </div>
    </div>
  );
};
