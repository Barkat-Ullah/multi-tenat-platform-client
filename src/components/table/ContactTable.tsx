"use client";
import React, { useMemo } from "react";
import { Table, Input, Button, Popconfirm } from "antd";
import { Search, Trash2 } from "lucide-react";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ContactData } from "@/redux/service/contact/contactApi";

export interface ContactTableProps {
  data: ContactData[];
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (search: string) => void;
  total: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  title?: string;
}

export const ContactTable: React.FC<ContactTableProps> = ({
  data,
  page,
  setPage,
  search,
  setSearch,
  total,
  onDelete,
  isDeleting,
  title = "Contact Submissions",
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const columns: ColumnsType<ContactData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (name: string) => <div className="font-medium text-sm text-gray-900">{name || "—"}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      width: 200,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 300,
      render: (message: string) => (
        <div className="text-sm text-gray-600 truncate max-w-xs" title={message}>
          {message || "—"}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Delete the contact?"
          description="Are you sure to delete this contact submission?"
          onConfirm={() => onDelete(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true, loading: isDeleting }}
        >
           <Button type="text" danger icon={<Trash2 size={16} />} />
        </Popconfirm>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data || [];

    return (data || []).filter((item) => {
      const name = item?.name || "";
      const email = item?.email || "";
      const subject = item?.subject || "";
      return [name, email, subject].some((val) => val.toLowerCase().includes(q));
    });
  }, [data, search]);

  const tableProps: TableProps<ContactData> = {
    columns,
    dataSource: filteredData,
    rowKey: (record) => record.id,
    pagination: {
      current: page,
      pageSize: 10,
      total: total,
      size: "small",
      onChange: (newPage) => setPage(newPage),
      showSizeChanger: false,
      showTotal: (total) => `Total ${total} submission${total !== 1 ? "s" : ""}`,
    },
    scroll: { x: 1050 },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-poppins">{title}</h2>
        <Input
          placeholder="Search contacts..."
          prefix={<Search size={16} className="text-gray-400" />}
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-80 rounded-full"
          allowClear
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table {...tableProps} size="small" className="custom-table" />
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden p-4 space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No contacts found</div>
          ) : (
            filteredData.map((record) => (
              <div key={record.id} className="border rounded-xl p-4 bg-gray-50 space-y-3 relative">
                <div className="flex justify-between items-start pr-8">
                  <div>
                    <div className="font-bold text-gray-900">{record.name || "—"}</div>
                    <div className="text-xs text-gray-500">{record.email}</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Popconfirm
                      title="Delete the contact?"
                      description="Are you sure to delete this contact submission?"
                      onConfirm={() => onDelete(record.id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true, loading: isDeleting }}
                    >
                      <Button type="text" danger icon={<Trash2 size={16} />} />
                    </Popconfirm>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-500">Subject</div>
                  <div className="text-sm font-medium">{record.subject || "—"}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-500">Message</div>
                  <div className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                    {record.message}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-xs text-gray-400">
                  <span>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "—"}</span>
                  <span>ID: {record.id.slice(0, 8)}...</span>
                </div>
              </div>
            ))
          )}

          {/* Mobile Pagination */}
          {total > 10 && (
            <div className="flex justify-center pt-2">
              <div className="flex items-center gap-4">
                <Button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)}
                  size="small"
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">{page} / {Math.ceil(total / 10)}</span>
                <Button 
                  disabled={page >= Math.ceil(total / 10)} 
                  onClick={() => setPage(page + 1)}
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
