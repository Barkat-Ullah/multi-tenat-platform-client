// components/PropertyTable.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Table, Button, Tag, Space } from "antd";
import type { TableProps } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  FireOutlined,
  RiseOutlined,
  TrophyOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { mockPropertyData, PropertyData } from "./FilterSidebar";


interface PropertyTableProps {
  activeTab: string;
  activeFilter: string;
  searchText: string;
}

const PropertyTable: React.FC<PropertyTableProps> = ({
  activeTab,
  activeFilter,
  searchText,
}) => {
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns: TableProps<PropertyData>["columns"] = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      width: 320,
      fixed: "left" as const,
      render: (_, record, index) => (
        <div className="flex items-center gap-3">
          <span className="text-gray-500 font-semibold min-w-[20px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              width={64}
              height={64}
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23cccccc'/%3E%3C/svg%3E"
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1">{record.name}</div>
            <div className="text-xs text-gray-500 mb-1.5">ID: {record.id}</div>
            <Tag color="green" className="m-0">
              {record.statusLabel}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Statistics",
      dataIndex: "statistics",
      key: "statistics",
      width: 180,
      render: (_, record) => (
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-1">
            <UserOutlined className="text-blue-500" />
            <span className="whitespace-nowrap">{record.visitors}</span>
          </div>
          <div className="flex items-center gap-1">
            <HeartOutlined className="text-red-500" />
            <span className="whitespace-nowrap">{record.favorites}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShareAltOutlined className="text-green-500" />
            <span className="whitespace-nowrap">{record.shares}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Promote",
      dataIndex: "promote",
      key: "promote",
      width: 140,
      render: () => (
        <Space direction="vertical" size={4}>
          <Tag color="gold" className="whitespace-nowrap">⭐ Premium Listing</Tag>
          <Tag color="orange" className="whitespace-nowrap">🏷️ Promoted Ad</Tag>
        </Space>
      ),
    },
    {
      title: "Location & Region",
      dataIndex: "location",
      key: "location",
      width: 220,
      render: (_, record) => (
        <div className="text-xs">
          <div className="font-medium mb-1 whitespace-nowrap">
            <EnvironmentOutlined className="mr-1" />
            {record.city}
          </div>
          <div className="text-gray-500 whitespace-normal">{record.region}</div>
        </div>
      ),
    },
    {
      title: "Area (Square Feet)",
      dataIndex: "area",
      key: "area",
      width: 150,
      render: (area) => (
        <span className="font-medium whitespace-nowrap">
          {area.toLocaleString()} <span className="text-gray-500 text-xs">SF</span>
        </span>
      ),
    },
    {
      title: "Price (USD)",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <span className="font-bold whitespace-nowrap">${price.toLocaleString()}</span>
      ),
    },
    {
      title: "Cap Rate (%)",
      dataIndex: "capRate",
      key: "capRate",
      width: 130,
      render: (rate) => <span className="font-medium">{rate}%</span>,
    },
    {
      title: "Annual Income (USD)",
      dataIndex: "annualIncome",
      key: "annualIncome",
      width: 160,
      render: (income) => (
        <span className="font-medium whitespace-nowrap">${income.toLocaleString()}</span>
      ),
    },
    {
      title: "Visibility & Improvement",
      dataIndex: "visibility",
      key: "visibility",
      width: 180,
      render: (visibility) => (
        <Space direction="vertical" size={4}>
          <Tag color="orange" icon={<FireOutlined />} className="whitespace-nowrap">
            Visibility: {visibility}%
          </Tag>
          <Tag color="orange" icon={<RiseOutlined />} className="whitespace-nowrap">
            Needs Improvement
          </Tag>
        </Space>
      ),
    },
    {
      title: "Match Rate",
      dataIndex: "match",
      key: "match",
      width: 120,
      render: (match) => (
        <Tag color="green" className="rounded-full whitespace-nowrap">
          ✓ Match: {match}%
        </Tag>
      ),
    },
    {
      title: "Position Rank",
      dataIndex: "position",
      key: "position",
      width: 140,
      render: (position) => (
        <Tag color="gold" className="rounded-full whitespace-nowrap">
          <TrophyOutlined /> Position: {position}
        </Tag>
      ),
    },
    {
      title: "Last Modified & Contacts",
      dataIndex: "message",
      key: "message",
      width: 200,
      render: (_, record) => (
        <div className="text-xs">
          <div className="font-medium mb-1 whitespace-nowrap">Last Modification</div>
          <div className="text-gray-500 mb-2 whitespace-nowrap">📅 {record.lastModified}</div>
          <div className="whitespace-nowrap">
            <MessageOutlined className="mr-1" />
            <span>{record.contacts} Contact Persons</span>
          </div>
        </div>
      ),
    },
    {
      title: "Actions & More Options",
      key: "action",
      width: 200,
      fixed: "right" as const,
      render: () => (
        <Space size={8}>
          <Button type="primary" icon={<EyeOutlined />} size="small" className="bg-blue-500">
            View
          </Button>
          <Button type="default" icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, []);

  const updateScrollButtons = () => {
    if (tableContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
      const hasHorizontalScroll = scrollWidth > clientWidth;
      
      setShowLeftScroll(hasHorizontalScroll && scrollLeft > 10);
      setShowRightScroll(hasHorizontalScroll && scrollLeft < scrollWidth - clientWidth - 10);
      
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const scrollLeft = () => {
    if (tableContainerRef.current) {
      const scrollAmount = Math.min(800, tableContainerRef.current.scrollLeft);
      tableContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 350);
    }
  };

  const scrollRight = () => {
    if (tableContainerRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = tableContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const remainingScroll = maxScroll - scrollLeft;
      const scrollAmount = Math.min(800, remainingScroll);
      tableContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 350);
    }
  };

  const scrollToPercentage = (percentage: number) => {
    if (tableContainerRef.current) {
      const { scrollWidth, clientWidth } = tableContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const targetScroll = (percentage / 100) * maxScroll;
      tableContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      setTimeout(updateScrollButtons, 350);
    }
  };

  const scrollToPosition = (position: 'start' | 'end') => {
    if (tableContainerRef.current) {
      if (position === 'start') {
        tableContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const { scrollWidth, clientWidth } = tableContainerRef.current;
        tableContainerRef.current.scrollTo({ 
          left: scrollWidth - clientWidth, 
          behavior: 'smooth' 
        });
      }
      setTimeout(updateScrollButtons, 350);
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  const filteredData = mockPropertyData.filter((property: PropertyData) => {
    if (searchText) {
      return (
        property.name.toLowerCase().includes(searchText.toLowerCase()) ||
        property.id.toLowerCase().includes(searchText.toLowerCase()) ||
        property.city.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (activeTab === "archive") return property.status === "archived";
    if (activeFilter === "active") return property.status === "active";
    if (activeFilter === "favorites") return property.isFavorite;
    if (activeFilter === "drafts") return property.status === "draft";
    if (activeFilter === "archived") return property.status === "archived";
    if (activeFilter === "sold") return property.status === "sold";
    return true;
  });

  const tableWidth = columns.reduce((sum, col) => sum + (col.width as number || 100), 0);

  return (
    <div className="relative">
      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 ${showLeftScroll ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
        style={{ left: '-20px' }}
        aria-label="Scroll left"
        disabled={!showLeftScroll}
      >
        <LeftOutlined className={`${showLeftScroll ? 'text-gray-700' : 'text-gray-400'}`} />
      </button>

      {/* Table Container */}
      <div 
        ref={tableContainerRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto relative"
        onScroll={handleScroll}
        style={{ maxHeight: '600px' }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={false}
          scroll={{ x: tableWidth }}
          className="property-table"
          bordered={false}
          size="middle"
        />
        
        {/* Scroll Progress Bar */}
        <div className="sticky bottom-0 left-0 right-0 h-2 bg-gray-100 z-10">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ 
              width: `${scrollProgress}%`,
              left: 0 
            }}
          />
        </div>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 border border-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 ${showRightScroll ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
        style={{ right: '-20px' }}
        aria-label="Scroll right"
        disabled={!showRightScroll}
      >
        <RightOutlined className={`${showRightScroll ? 'text-gray-700' : 'text-gray-400'}`} />
      </button>

      {/* Enhanced Scroll Navigation */}
      <div className="flex flex-col space-y-3 mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Scroll Progress Indicator */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Scroll Position: {Math.round(scrollProgress)}%</span>
            <span>Table Width: {Math.round(tableWidth)}px</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>

        {/* Scroll Control Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              size="small" 
              icon={<LeftOutlined />}
              onClick={() => scrollToPosition('start')}
              disabled={!showLeftScroll}
              className="hover:border-[#004E60] hover:text-[#004E60]"
            >
              Start
            </Button>
            <Button 
              size="small" 
              icon={<LeftOutlined />}
              onClick={scrollLeft}
              disabled={!showLeftScroll}
              className="hover:border-[#004E60] hover:text-[#004E60]"
            >
              ← 25%
            </Button>
            <Button 
              size="small" 
              onClick={scrollRight}
              disabled={!showRightScroll}
              className="hover:border-[#004E60] hover:text-[#004E60]"
            >
              25% →
            </Button>
            <Button 
              size="small" 
              icon={<RightOutlined />}
              onClick={() => scrollToPosition('end')}
              disabled={!showRightScroll}
              className="hover:border-[#004E60] hover:text-[#004E60]"
            >
              End
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing {filteredData.length} properties • 
            <span className="ml-2 font-medium">Use: Buttons | Shift+Wheel | Drag scrollbar</span>
          </div>
        </div>

        {/* Quick Navigation Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 25, 50, 75, 100].map((position) => (
            <button
              key={position}
              onClick={() => scrollToPercentage(position)}
              className={`w-3 h-3 rounded-full transition-all ${
                Math.abs(scrollProgress - position) < 5 
                  ? 'bg-[#004E60] scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Scroll to ${position}%`}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold">{filteredData.length}</span> of {mockPropertyData.length} properties
          </div>
          <div className="flex space-x-2">
            <Button size="small" className="hover:border-[#004E60] hover:text-[#004E60]">Previous</Button>
            <Button type="primary" size="small" className="bg-[#004E60] hover:bg-[#003d4d] border-[#004E60]">1</Button>
            <Button size="small" className="hover:border-[#004E60] hover:text-[#004E60]">2</Button>
            <Button size="small" className="hover:border-[#004E60] hover:text-[#004E60]">3</Button>
            <Button size="small" className="hover:border-[#004E60] hover:text-[#004E60]">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTable;