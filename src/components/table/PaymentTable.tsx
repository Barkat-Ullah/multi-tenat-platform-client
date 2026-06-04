/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Table, Input, Modal, Button } from "antd";
import { Search } from "lucide-react";
import type { ColumnsType, TableProps } from "antd/es/table";
import Image from "next/image";
import { PaymentData, useGetPaymentByIdQuery } from "@/redux/service/admin/paymentApi";

export interface PaymentTableProps {
  data: PaymentData[];
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (search: string) => void;
  total: number;
  onAction?: (action: string, record: PaymentData) => void;
  title?: string;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  data,
  page,
  setPage,
  search,
  setSearch,
  total,
  title = "Payment History",
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const columns: ColumnsType<PaymentData> = [
    {
      title: "Operator Name",
      dataIndex: ["operator", "user", "profile", "name"],
      key: "operatorName",
      render: (_: any, record: PaymentData) => {
        const name = record?.operator?.user?.profile?.name || "Unknown";
        const avatar = record?.operator?.user?.profile?.avatar;

        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <Image
                  width={32}
                  height={32}
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">👤</span>
              )}
            </div>
            <div className="font-medium text-sm text-gray-900">{name}</div>
          </div>
        );
      },
    },
    {
      title: "Operator Role",
      dataIndex: ["operator", "user", "role"],
      key: "operatorRole",
      render: (role: string) => role || "—",
    },
    {
      title: "Subscription Plan",
      dataIndex: ["subscription", "subscriptionPlan", "name"],
      key: "subscriptionPlan",
      render: (v: string) => v || "—",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `€ ${amount}`,
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date: string) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        return isNaN(parsedDate.getTime())
          ? "—"
          : parsedDate.toLocaleDateString();
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => {
        const statusConfig = {
          SUCCEEDED: { bg: "bg-green-100", text: "text-green-700", label: "Succeeded" },
          PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
          FAILED: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] ||
          { bg: "bg-gray-100", text: "text-gray-700", label: status };

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        );
      },
    },
  ];

  // Note: Since filtering is handled by the API, we don't need client-side filtering
  // But we keep it as a fallback for any additional filtering needs
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;

    return data.filter((item) => {
      const name = item?.operator?.user?.profile?.name || "";
      const role = item?.operator?.user?.role || "";
      const plan = item?.subscription?.subscriptionPlan?.name || "";
      const status = item?.paymentStatus || "";
      const amount = String(item?.amount ?? "");

      return [name, role, plan, status, amount]
        .some(val => val.toLowerCase().includes(q));
    });
  }, [data, search]);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = React.useState<string | null>(null);

  const { data: detailData, isFetching: isDetailFetching } = useGetPaymentByIdQuery(selectedPaymentId!, { skip: !selectedPaymentId });

  const handleViewDetails = (record: PaymentData) => {
    setSelectedPaymentId(record.id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPaymentId(null);
  };

  const extendedColumns: ColumnsType<PaymentData> = [
    ...columns,
    {
      title: "Action",
      key: "action",
      render: (_: any, record: PaymentData) => (
        <button
          onClick={() => handleViewDetails(record)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
      )
    }
  ];

  const tableProps: TableProps<PaymentData> = {
    columns: extendedColumns,
    dataSource: filteredData,
    rowKey: (record) => record.id,
    pagination: {
      current: page,
      pageSize: 10,
      total: total,
      size: "small",
      onChange: (newPage) => setPage(newPage),
      showSizeChanger: false,
      showTotal: (total) => `Total ${total} payment${total !== 1 ? 's' : ''}`,
    },
    scroll: { x: 1200 },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-poppins">{title}</h2>
        <Input
          placeholder="Search payments..."
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
            <div className="text-center py-8 text-gray-500">No payments found</div>
          ) : (
            filteredData.map((record) => {
              const statusConfig = {
                SUCCEEDED: { bg: "bg-green-100", text: "text-green-700", label: "Succeeded" },
                PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
                FAILED: { bg: "bg-red-100", text: "text-red-700", label: "Failed" },
              };
              const config = statusConfig[record.paymentStatus as keyof typeof statusConfig] ||
                { bg: "bg-gray-100", text: "text-gray-700", label: record.paymentStatus };

              return (
                <div key={record.id} className="border rounded-xl p-4 bg-gray-50 space-y-3 relative">
                  <div className="flex items-center gap-3 pr-24">
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {record?.operator?.user?.profile?.avatar ? (
                        <Image
                          width={40}
                          height={40}
                          src={record?.operator?.user?.profile?.avatar}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">👤</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 truncate">
                        {record?.operator?.user?.profile?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">{record?.operator?.user?.role}</div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 text-right">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
                      {config.label}
                    </div>
                    <div className="mt-1 font-bold text-gray-900">
                      {record.amount} {record.currency?.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm pt-2 border-t border-gray-200">
                    <div className="col-span-2">
                      <div className="text-gray-500 text-xs text-left">Subscription Plan</div>
                      <div className="font-medium">{record?.subscription?.subscriptionPlan?.name || "—"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs text-left">Date</div>
                      <div className="font-medium text-xs">
                        {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : "—"}
                      </div>
                    </div>
                    <div className="text-right flex items-end justify-end">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
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

      <Modal
        title="Payment Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {isDetailFetching ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : detailData?.data ? (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium text-gray-900">{detailData.data.id}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-lg text-gray-900">
                €{detailData.data.amount?.toLocaleString()}
              </span>            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">{new Date(detailData.data.paymentDate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-gray-900">{detailData.data.paymentStatus}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">User Email</span>
              <span className="font-medium text-gray-900">{detailData.data.operator?.user?.profile?.name || 'Unknown User'}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No details found.</p>
        )}
      </Modal>
    </div>
  );
};