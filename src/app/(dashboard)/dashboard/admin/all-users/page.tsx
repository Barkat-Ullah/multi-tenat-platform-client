"use client";

import { UsersTable } from "@/components/table/UsersTableProps";
import { useGetAllUsersQuery } from "@/redux/service/admin/userApi";
import Spinner from "@/components/ui/Spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/utils/types";

const AllUsers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const limit = 10;
  const router = useRouter();

  const { data, isLoading } = useGetAllUsersQuery({
    page,
    limit,
    search,
    role: role === "ALL" ? undefined : role,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <UsersTable
      data={data?.data ?? []}
      currentPage={data?.pagination?.page ?? page}
      total={data?.pagination?.total ?? 0}
      pageSize={data?.pagination?.limit ?? limit}
      setPage={setPage}
      setSearch={(value) => {
        setPage(1);
        setSearch(value);
      }}
      setRole={(value) => {
        setPage(1);
        setRole(value);
      }}
      selectedRole={role}
      onAction={(action, record) => {
        if (action === "view") {
          router.push(`/dashboard/admin/view-details/${record?.id}`);
        }
      }}
    />
  );
};

export default AllUsers;