/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { PropertyData, PropertyTable } from "@/components/table/PropertyTable";
import Spinner from "@/components/ui/Spinner";
import { useGetAdminPropertiesQuery } from "@/redux/service/admin/propertiesApi";
import { useMemo, useState } from "react";

const AllProperty: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [verified, setVerified] = useState<"Verified" | "Unverified" | null>(null);
  const limit = 10;

  const statusParam =
    verified === "Verified"
      ? true
      : verified === "Unverified"
      ? false
      : undefined;

  const { data: allProperties, isLoading, refetch } = useGetAdminPropertiesQuery({
    page,
    limit,
    search: searchTerm,
    verified: statusParam,
  });

  const propertyData: PropertyData[] = useMemo(() => {
    if (!allProperties?.data) return [];

    return allProperties.data.map((property: any) => ({
      key: property.id,
      propertyId: property.id,
      uuid: property.uuid,
      title: property.title,
      image: property.images?.[0] || "/placeholder-image.jpg",
      date: property.createdAt
        ? new Date(property.createdAt).toLocaleDateString("en-GB")
        : "—",
      listerName: property.operator?.name || "Unknown Operator",
      propertyType: property.type || "N/A",
      location: property.address || "No Address",
      price: property.price ?? 0,

      // important
      verified: !!property.verified,
      blocked: !!property.blocked,

      // keep this because your action menu also uses record.status
      status: property.verified ? "Verified" : "Unverified",
    }));
  }, [allProperties]);

  const handleAction = async (action: string, record: PropertyData) => {
    console.log(`Action: ${action}`, record);
    await refetch();
  };

  if (isLoading) return <Spinner />;

  return (
    <PropertyTable
      data={propertyData}
      onAction={handleAction}
      title="All Properties"
      statusDropdown={true}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      verifiedStatus={verified}
      setVerified={(value) => {
        setVerified(value);
        setPage(1);
      }}
      setPage={setPage}
      currentPage={page}
      total={allProperties?.pagination?.total || 0}
    />
  );
};

export default AllProperty;