// components/SearchHeader.tsx
"use client";

import { Button, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

interface SearchHeaderProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchText,
  setSearchText,
}) => {
  return (
    <div className="flex justify-between mb-6 items-center sticky top-[70px] bg-gray-50 z-10 py-4">
      <Input
        placeholder="Search properties, ID, city..."
        prefix={<SearchOutlined />}
        className="w-80"
        size="large"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        size="large"
        className="h-11 bg-[#004E60] hover:bg-[#003d4d] border-[#004E60] hover:border-[#003d4d]"
      >
        Add Property
      </Button>
    </div>
  );
};

export default SearchHeader;