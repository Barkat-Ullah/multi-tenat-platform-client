import React, { useState } from "react";
import { Table, Button, Avatar, Tag, Input, Modal, Badge, Divider, Typography, BadgeProps, Select } from "antd";
import { Search, DollarSign, Calendar, CreditCard, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { ColumnsType, TableProps } from "antd/es/table";

export interface PaymentInfo {
  amount: number;
  currency: string;
  date: string;
  status: string;
}

export interface SubscriptionData {
  id?: string
  key: string;
  type: "Agency" | "Investor";
  profile: {
    name: string;
    avatar: string | null;
  };
  userEmail: string;
  country: string;
  payments: PaymentInfo[];
  totalPaid: number;
  paymentCount: number;
  expireDate: string;
}

interface SubscriptionTableProps {
  data: SubscriptionData[];
  page: number;
  setPage: (page: number) => void;
  search: string;
  setSearch: (search: string) => void;
  status: string;
  setStatus: (status: string) => void;
  total: number;
  onViewProfile?: (record: SubscriptionData) => void;
}
const { Text, Title } = Typography;

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  data,
  page,
  setPage,
  search,
  setSearch,
  status,
  setStatus,
  total,
  // onViewProfile,
}) => {
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionData | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  const handleViewPayments = (record: SubscriptionData): void => {
    setSelectedSubscription(record);
    setIsPaymentModalVisible(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const getStatusBadge = (status: string): { color: BadgeProps['status']; text: string; icon: React.ReactNode } => {
    switch (status.toUpperCase()) {
      case 'SUCCEEDED':
        return {
          color: 'success',
          text: 'Success',
          icon: <CheckCircle size={14} className="text-green-500" />
        };
      case 'PENDING':
        return {
          color: 'warning',
          text: 'Pending',
          icon: <AlertCircle size={14} className="text-yellow-500" />
        };
      case 'FAILED':
        return {
          color: 'error',
          text: 'Failed',
          icon: <XCircle size={14} className="text-red-500" />
        };
      default:
        return {
          color: 'default',
          text: status,
          icon: null
        };
    }
  };

  const columns: ColumnsType<SubscriptionData> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag color={type === "Agency" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Profile",
      dataIndex: "profile",
      key: "profile",
      width: 200,
      render: (profile: { name: string; avatar: string | null }) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={profile.avatar || undefined}
            alt={profile.name}
            size={40}
            className="bg-gray-300"
          >
            {profile.name?.charAt(0).toUpperCase()}
          </Avatar>
          <span className="font-medium">{profile.name}</span>
        </div>
      ),
    },
    {
      title: "User Email",
      dataIndex: "userEmail",
      key: "userEmail",
      width: 200,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 120,
      render: () => <span className="text-gray-400">N/A</span>,
    },
    {
      title: "Payments",
      key: "payments",
      width: 200,
      render: (_: unknown, record: SubscriptionData) => (
        <div className="flex flex-row justify-start items-center gap-1">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-gray-400" />
            <span className="font-medium">${record.totalPaid.toLocaleString()}</span>
            <Badge
              count={record.paymentCount}
              style={{ backgroundColor: '#52c41a' }}
              showZero
            />
          </div>
          <Button
            type="link"
            size="small"
            className="text-blue-500 p-0 h-auto"
            onClick={() => handleViewPayments(record)}
          >
            View all payments
          </Button>
        </div>
      ),
    },
    {
      title: "Expire Date",
      dataIndex: "expireDate",
      key: "expireDate",
      width: 120,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   width: 120,
    //   render: (_: unknown, record: SubscriptionData) => (
    //     <Button
    //       type="link"
    //       className="text-red-500 hover:text-red-600 p-0"
    //       onClick={() => handleViewProfile(record)}
    //     >
    //       View Profile
    //     </Button>
    //   ),
    // },
  ];

  const filteredData = data.filter((item) =>
    [item.type, item.profile.name, item.userEmail, String(item.totalPaid)]
      .some((field) =>
        field.toString().toLowerCase().includes(search.toLowerCase())
      )
  );

  const tableProps: TableProps<SubscriptionData> = {
    columns,
    dataSource: filteredData,
    pagination: {
      current: page,
      pageSize: 10,
      total: total,
      size: "small",
      onChange: (newPage) => setPage(newPage),
      showSizeChanger: false,
      showTotal: (total) => `Total ${total} items`,
    },
    scroll: { x: 1300 },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold font-poppins text-gray-800">Subscriptions</h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Select
              value={status}
              style={{ width: 150 }}
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              options={[
                { value: "all", label: "All Status" },
                { value: "ACTIVE", label: "Active" },
                { value: "CANCELLED", label: "Cancelled" },
                { value: "PAST_DUE", label: "Past Due" },
                { value: "PENDING", label: "Pending" },
              ]}
              className="rounded-full h-10"
            />
            <Input
              placeholder="Search by name, email, type..."
              suffix={<Search size={16} className="text-gray-400" />}
              value={search}
              onChange={handleSearchChange}
              className="w-full sm:w-80 rounded-full h-10"
              allowClear
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table {...tableProps} size="small" className="custom-table" />
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden p-4 space-y-4">
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No subscriptions found</div>
          ) : (
            filteredData.map((record) => (
              <div key={record.key} className="border rounded-xl p-4 bg-gray-50 space-y-3 relative">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={record.profile.avatar || undefined}
                    alt={record.profile.name}
                    size={48}
                    className="bg-gray-300 flex-shrink-0"
                  >
                    {record.profile.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 truncate">{record.profile.name}</div>
                    <div className="text-xs text-gray-500 truncate">{record.userEmail}</div>
                    <Tag color={record.type === "Agency" ? "blue" : "green"} className="mt-1">
                      {record.type}
                    </Tag>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-gray-500 text-xs">Total Paid</div>
                    <div className="font-medium text-green-600">${record.totalPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Payments</div>
                    <div className="font-medium">{record.paymentCount} entries</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Expires</div>
                    <div className="font-medium">{record.expireDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Country</div>
                    <div className="font-medium text-gray-400">N/A</div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    block
                    onClick={() => handleViewPayments(record)}
                  >
                    View Payment History
                  </Button>
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

      <Modal
        title={
          <div className="flex items-center gap-3 py-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div>
              <Title level={4} className="!mb-0">Payment History</Title>
              <Text type="secondary">{selectedSubscription?.profile.name}</Text>
            </div>
          </div>
        }
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        footer={null}
        width={650}
        className="payment-modal"
      >
        {selectedSubscription && (
          <div className="py-2">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl">
                <Text type="secondary" className="text-xs uppercase tracking-wider">Total Paid</Text>
                <div className="flex items-baseline gap-1 mt-1">
                  <Text className="text-2xl font-bold text-blue-600">
                    ${selectedSubscription.totalPaid.toLocaleString()}
                  </Text>
                  <Text type="secondary" className="text-sm">USD</Text>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-xl">
                <Text type="secondary" className="text-xs uppercase tracking-wider">Transactions</Text>
                <div className="flex items-baseline gap-1 mt-1">
                  <Text className="text-2xl font-bold text-gray-700">
                    {selectedSubscription.paymentCount}
                  </Text>
                  <Text type="secondary" className="text-sm">payments</Text>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Payment List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {selectedSubscription.payments.length > 0 ? (
                selectedSubscription.payments.map((payment, index) => {
                  const status = getStatusBadge(payment.status);
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <CreditCard size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Text strong className="text-lg">
                                {payment.currency.toUpperCase()} ${payment.amount.toLocaleString()}
                              </Text>
                              <Badge
                                status={status.color}
                                text={status.text}
                                className="ml-2"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar size={14} className="text-gray-400" />
                              <Text type="secondary" className="text-sm">{payment.date}</Text>
                            </div>
                          </div>
                        </div>
                        {status.icon}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CreditCard size={24} className="text-gray-400" />
                  </div>
                  <Text type="secondary">No payment records found</Text>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .subscription-table :global(.ant-table-thead > tr > th) {
          background-color: #f9fafb;
          color: #4b5563;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .subscription-table :global(.ant-table-tbody > tr > td) {
          padding: 16px 8px;
        }
        
        .payment-modal :global(.ant-modal-header) {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .payment-modal :global(.ant-modal-content) {
          border-radius: 16px;
        }
        
        .payment-modal :global(.ant-modal-body) {
          padding-top: 8px;
        }
      `}</style>
    </div>
  );
};