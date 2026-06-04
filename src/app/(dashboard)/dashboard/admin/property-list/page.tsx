/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Table, Button, Input, Menu, Modal, List, Empty, Skeleton, Spin } from "antd";

import s4 from "@/assets/tableIcon/s4.png";
import s3 from "@/assets/tableIcon/s3.png";
import s2 from "@/assets/tableIcon/s2.png";
import s1 from "@/assets/tableIcon/s1.png";
import location from "@/assets/tableIcon/location.png";

import {
  MoreOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { useGetAgencyPropertiesQuery, useGetPropertyMessagesQuery } from "@/redux/service/agent/propertiesApi";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { appAlert } from "@/utils/appAlert";
import { useToggleShareMutation } from "@/redux/service/admin/propertiesApi";


const FILTERS = {
  ALL: { status: "", favorites: false, label: "All Properties" },
  ACTIVE: { status: "ACTIVE", favorites: false, label: "Active" },
  INACTIVE: { status: "INACTIVE", favorites: false, label: "Inactive" },
  DRAFT: { status: "DRAFT", favorites: false, label: "Draft" },
  ARCHIVED: { status: "ARCHIVED", favorites: false, label: "Archived" },
  BOOKED: { status: "BOOKED", favorites: false, label: "Booked" },
  FAVORITES: { status: "", favorites: true, label: "Favorites" },
} as const;


type FilterKey = keyof typeof FILTERS;

export default function Home() {
  const router = useRouter();
  const limit = 10;

  // Simple state - just one filter key and page
  const [currentFilter, setCurrentFilter] = useState<FilterKey>("ALL");
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  // Message modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [displayMessages, setDisplayMessages] = useState<any[] | null>(null);
  const [showActions, setShowActions] = useState(false);

  // Get current filter values - simple and clean
  const activeFilter = FILTERS[currentFilter];

  // API call - just pass the filter values directly
  const { data: getAllProperty, isLoading } = useGetAgencyPropertiesQuery({
    page,
    limit,
    search: searchText || undefined,
    status: activeFilter.status || undefined,
    favorites: activeFilter.favorites,
  });
  const [toggleShare] = useToggleShareMutation();
  // Handle filter change - one function for everything
  const handleFilterChange = (filterKey: FilterKey) => {
    setCurrentFilter(filterKey);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  // Message modal handlers
  const openMessagesModal = (propertyId: string) => {
    setDisplayMessages(null);
    setSelectedPropertyId(propertyId);
    setIsMessageModalOpen(true);
  };

  const closeMessagesModal = () => {
    setIsMessageModalOpen(false);
    setSelectedPropertyId(null);
  };

  // Fetch messages
  const { data: messagesRes, isLoading: isMessagesLoading, isFetching: isMessagesFetching, error: isMessagesError } = useGetPropertyMessagesQuery(
    { propertyId: selectedPropertyId as string, page: 1, limit: 10 },
    { skip: !isMessageModalOpen || !selectedPropertyId }
  );

  useEffect(() => {
    if (messagesRes?.data) {
      setDisplayMessages(messagesRes.data);
    }
  }, [messagesRes?.data]);

  const handleShare = async (id: string) => {
    // 1. Construct the URL
    const shareUrl = `${window.location.origin}/all-property/${id}`;

    try {
      // 2. Hit the Toggle API
      const res = await toggleShare(id).unwrap();

      if (res.success) {
        // 3. Copy to Clipboard
        await navigator.clipboard.writeText(shareUrl);

        // 4. Show Success Message
        appAlert.fire({
          icon: "success",
          title: "Link Copied!",
          text: "Property link copied to clipboard and share count updated.",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error: any) {
      appAlert.fire({
        icon: "error",
        title: "Oops...",
        text: error?.data?.message || "Failed to process share request.",
      });
    }
  };

  // Transform API data to table format
  const mappedProperties = getAllProperty?.data?.map((item: any, index: number) => ({
    key: item?.id,
    id: item?.id,
    name: item?.title,
    image: item?.images?.[0] || "/images/no-image.png",
    visitors: item?.totalVisitors || 0,
    favorites: item?.totalFavorites || 0,
    shares: item?.shares || 0,
    region: item?.address,
    area: item?.useableArea,
    price: item?.financialInfos?.askingPrice || 0,
    capRate: item?.financialInfos?.grossYield || 0,
    annualIncome: item?.financialInfos?.netAnnualIncome || 0,
    status: item?.status,
    isFavorite: item?.isFavorite || false,
    index: index + ((page - 1) * limit) + 1,
  })) || [];

  const columns = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      // width: 280,
      fixed: 'left' as const,
      render: (_: any, mappedProperties: any, index: number) => (
        <div className="flex items-center gap-3">
          <span className="text-gray-500 font-robotomono font-semibold min-w-[20px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="w-16 h-16 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              width={64}
              height={64}
              src={mappedProperties.image}
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-base text-[#2B2B2B] font-poppins mb-1">
              {mappedProperties.name}
            </div>
            <div className="mb-1.5 font-normal text-base text-[#2B2B2B] font-poppins">
              ID: {mappedProperties.id}
            </div>

          </div>
        </div>
      ),
    },
    {
      title: "Statistics",
      dataIndex: "statistics",
      key: "statistics",
      // width: 240,
      align: "start" as const,
      render: (_: any, record: any) => (
        <div className="text-xs space-y-1 flex justify-start items-start gap-4">
          <div>
            <div className="flex items-center gap-1">
              <Image src={s4} width={20} height={20} alt="visitors" />
              <span className="text-base font-normal text-[#3bb273] font-robotomono">
                {record.visitors} Visitor
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Image src={s3} width={20} height={20} alt="favorites" />
              <span className="text-base font-normal text-[#3bb273] font-robotomono">
                {record.favorites} Favorite
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Image src={s2} width={20} height={20} alt="shares" />
              <span className="text-base font-normal text-[#3bb273] font-robotomono">
                {record.shares} Share
              </span>
            </div>
            {/* <div className="flex items-center gap-1">
              <Image src={s1} width={20} height={20} alt="alert" />
              <span className="text-base font-normal text-[#3bb273] font-robotomono">
                Smart Alert
              </span>
            </div> */}
          </div>
        </div>
      ),
    },

    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center" as const,
      // width: 200,
      render: (_: any, mappedProperties: any) => (
        <div className="text-xs">
          <div className="font-medium mb-1">
            <h1 className="font-robotomono flex font-normal text-black text-base items-center gap-2">
              <Image src={location} width={20} height={20} alt="location" />
              {mappedProperties.region}
            </h1>
          </div>
        </div>
      ),
    },
    {
      title: "Area",
      dataIndex: "area",
      key: "area",
      width: 100,
      align: "center" as const,
      render: (area: number) => (
        <span className="font-medium flex items-center gap-2 font-robotomono text-[#3BB273]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* ... SVG content ... */}
          </svg>{" "}
          {area} <span className="text-[#2B2B2B] text-xs">SF</span>
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center" as const,
      render: (price: number) => (
        <span className="font-bold items-center text-base text-center font-robotomono text-black">
          ${price.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Cap Rate",
      dataIndex: "capRate",
      key: "capRate",
      width: 130,
      align: "center" as const,
      render: (rate: number) => (
        <span className="font-bold items-center text-base font-robotomono text-black">
          {rate}%
        </span>
      ),
    },
    {
      title: "Annual Income",
      dataIndex: "annualIncome",
      key: "annualIncome",
      width: 170,
      align: "center" as const,
      render: (income: number) => (
        <span className="font-bold items-center text-base font-robotomono text-black">
          ${income.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Position",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as const,
      render: (status: string) => (
        <button className="m-0 border text-base font-semibold font-robotomono text-[#F8F8F6] bg-[#D2B48C] p-1 px-4 mx-auto rounded-lg flex items-center gap-2">
          {status}
        </button>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      // width: 160,
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="text-xs">
          <div className="font-robotomono flex font-normal text-black text-base items-center gap-2">
            {/* ... SVG content ... */}
            <span>{record.contacts || 0} Persons</span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // width: 200,
      align: "center" as const,
      render: (_: any, record: any) => (
        <div className="text-xs">
          <button className="m-0 border text-base font-normal font-robotomono text-white bg-[#3BB273] p-1 px-4 rounded flex items-center gap-2">
            {record?.status}
          </button>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: any) => {
        return (
          <div className="flex items-center justify-center">
            {/* Hidden buttons that slide out */}
            <div
              className={`
          flex items-center gap-1 transition-all duration-300 ease-in-out
          ${showActions ? "opacity-100 translate-x-0 w-auto mr-2" : "opacity-0 translate-x-full w-0 overflow-hidden"}
        `}
            >

              {/* View Property button */}
              <Link href={`/all-property/${record.id}`} passHref>
                <Button
                  type="text"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_3678_2756)">
                        <path
                          d="M19.8729 9.6106C19.6942 9.36618 15.4371 3.62598 9.9999 3.62598C4.56274 3.62598 0.305391 9.36618 0.126914 9.61036C-0.0423048 9.84224 -0.0423048 10.1567 0.126914 10.3886C0.305391 10.633 4.56274 16.3732 9.9999 16.3732C15.4371 16.3732 19.6942 10.633 19.8729 10.3888C20.0423 10.157 20.0423 9.84224 19.8729 9.6106ZM9.9999 15.0546C5.99486 15.0546 2.52606 11.2447 1.49922 9.99915C2.52473 8.75255 5.98626 4.94465 9.9999 4.94465C14.0048 4.94465 17.4733 8.75388 18.5006 10.0001C17.4751 11.2466 14.0135 15.0546 9.9999 15.0546Z"
                          fill="#003944"
                        />
                        <path
                          d="M9.99903 6.04395C7.8177 6.04395 6.04297 7.81868 6.04297 10C6.04297 12.1813 7.8177 13.9561 9.99903 13.9561C12.1804 13.9561 13.9551 12.1813 13.9551 10C13.9551 7.81868 12.1804 6.04395 9.99903 6.04395ZM9.99903 12.6374C8.54473 12.6374 7.36168 11.4543 7.36168 10C7.36168 8.54575 8.54477 7.36266 9.99903 7.36266C11.4533 7.36266 12.6364 8.54575 12.6364 10C12.6364 11.4543 11.4533 12.6374 9.99903 12.6374Z"
                          fill="#003944"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3678_2756">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                  size="small"
                  className="hover:bg-blue-50"
                />
              </Link>
              {/* Update Property button */}

              <Link href={`/dashboard/user/property-list/edit-property/${record.id}`} passHref>
                <Button
                  type="text"
                  size="small"
                  className="hover:bg-green-50"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_3678_2763)">
                        <path
                          d="M18.4592 12.5635C18.1841 12.5635 17.9611 12.7865 17.9611 13.0616V17.4843C17.9601 18.3092 17.2918 18.9778 16.4668 18.9786H2.49052C1.66553 18.9778 0.99718 18.3092 0.996207 17.4843V4.50419C0.99718 3.6794 1.66553 3.01085 2.49052 3.00988H6.91313C7.18826 3.00988 7.41124 2.7869 7.41124 2.51178C7.41124 2.23685 7.18826 2.01367 6.91313 2.01367H2.49052C1.11567 2.01523 0.00155657 3.12935 0 4.50419V17.4845C0.00155657 18.8593 1.11567 19.9734 2.49052 19.975H16.4668C17.8416 19.9734 18.9558 18.8593 18.9573 17.4845V13.0616C18.9573 12.7865 18.7343 12.5635 18.4592 12.5635Z"
                          fill="#003944"
                        />
                        <path
                          d="M18.7617 0.732706C17.8863 -0.142673 16.4671 -0.142673 15.5917 0.732706L6.70523 9.61919C6.64433 9.68009 6.60036 9.75558 6.5774 9.83847L5.4088 14.0574C5.36074 14.2303 5.40958 14.4156 5.53644 14.5426C5.6635 14.6695 5.84873 14.7183 6.0217 14.6705L10.2406 13.5017C10.3235 13.4787 10.399 13.4347 10.4599 13.3738L19.3462 4.48716C20.2202 3.6112 20.2202 2.19316 19.3462 1.3172L18.7617 0.732706ZM7.79055 9.94295L15.0634 2.66986L17.409 5.01542L10.1359 12.2885L7.79055 9.94295ZM7.32202 10.8831L9.19594 12.7572L6.60386 13.4754L7.32202 10.8831ZM18.6418 3.78281L18.1136 4.31107L15.7678 1.96532L16.2963 1.43706C16.7825 0.95082 17.5709 0.95082 18.0571 1.43706L18.6418 2.02155C19.1273 2.50837 19.1273 3.29619 18.6418 3.78281Z"
                          fill="#003944"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3678_2763">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  }
                />
              </Link>
              {/* Property massege button */}
              <Button
                type="text"
                onClick={() => openMessagesModal(record.id)}
                icon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.1128 13.6409V1.84375C18.1122 1.52072 17.9835 1.21111 17.7551 0.982693C17.5267 0.754276 17.2171 0.625661 16.8941 0.625H3.10938C2.78635 0.625661 2.47674 0.754276 2.24832 0.982693C2.0199 1.21111 1.89129 1.52072 1.89062 1.84375V3.60906V3.61375V3.61813V13.6409C1.89137 13.9639 2.02001 14.2735 2.24841 14.5019C2.47681 14.7303 2.78637 14.8589 3.10938 14.8597H6.23438L5.07406 17.5469C4.95707 17.81 4.93799 18.1062 5.02028 18.3822C5.10258 18.6581 5.28081 18.8955 5.52281 19.0516C5.63794 19.1195 5.76631 19.162 5.89926 19.1761C6.03221 19.1901 6.16664 19.1755 6.29344 19.1331C6.43477 19.0839 6.56407 19.0053 6.67281 18.9024C6.78156 18.7996 6.8673 18.6749 6.92438 18.5366L8.51 14.8609H8.97375V18.3491C8.97137 18.4853 8.99615 18.6206 9.04663 18.7471C9.09711 18.8737 9.17229 18.9889 9.26778 19.0861C9.36327 19.1832 9.47715 19.2604 9.60279 19.3131C9.72843 19.3658 9.8633 19.3929 9.99953 19.3929C10.1358 19.3929 10.2706 19.3658 10.3963 19.3131C10.5219 19.2604 10.6358 19.1832 10.7313 19.0861C10.8268 18.9889 10.9019 18.8737 10.9524 18.7471C11.0029 18.6206 11.0277 18.4853 11.0253 18.3491V14.8609H11.4919L13.0756 18.5381C13.1336 18.6765 13.2201 18.8011 13.3294 18.9038C13.4388 19.0065 13.5686 19.0849 13.7103 19.1341C13.8365 19.1759 13.9702 19.1902 14.1024 19.1759C14.2346 19.1617 14.3622 19.1193 14.4766 19.0516C14.7201 18.8966 14.8995 18.6589 14.9818 18.3822C15.064 18.1056 15.0437 17.8085 14.9244 17.5456L13.7662 14.8609H16.8931C17.2165 14.8605 17.5266 14.7318 17.7552 14.5031C17.9839 14.2744 18.1125 13.9643 18.1128 13.6409ZM3.10938 1.25H16.8931C17.0504 1.25049 17.2012 1.31321 17.3124 1.42445C17.4237 1.53569 17.4864 1.68643 17.4869 1.84375V3.30125H2.51437V1.84375C2.51487 1.68621 2.57776 1.53529 2.68927 1.42401C2.80078 1.31273 2.95184 1.25016 3.10938 1.25ZM6.35031 18.2894C6.32798 18.3465 6.29391 18.3982 6.25031 18.4413C6.2067 18.4843 6.15454 18.5178 6.09719 18.5394C6.0545 18.5537 6.00923 18.5586 5.96446 18.5538C5.91969 18.549 5.87649 18.5346 5.83781 18.5116C5.72856 18.4317 5.65011 18.3167 5.61563 18.1858C5.58114 18.0549 5.59273 17.9162 5.64844 17.7928L6.91344 14.8606H7.82969L6.35031 18.2894ZM10.4003 18.3491C10.4018 18.4026 10.3925 18.456 10.3731 18.5059C10.3536 18.5558 10.3243 18.6014 10.287 18.6398C10.2496 18.6782 10.2049 18.7087 10.1555 18.7296C10.1062 18.7504 10.0531 18.7612 9.99953 18.7612C9.94594 18.7612 9.89289 18.7504 9.84352 18.7296C9.79415 18.7087 9.74946 18.6782 9.7121 18.6398C9.67473 18.6014 9.64545 18.5558 9.62598 18.5059C9.60651 18.456 9.59725 18.4026 9.59875 18.3491V14.8609H10.4003V18.3491ZM14.3509 17.7938C14.4083 17.9166 14.4209 18.0557 14.3867 18.1869C14.3525 18.3181 14.2735 18.4333 14.1634 18.5125C14.1252 18.5359 14.0823 18.5506 14.0378 18.5556C13.9932 18.5606 13.9481 18.5558 13.9056 18.5416C13.8479 18.5201 13.7953 18.4867 13.7513 18.4437C13.7073 18.4006 13.6728 18.3488 13.65 18.2916L12.175 14.8634H13.0869L14.3509 17.7938ZM16.8931 14.2359H3.10938C2.95205 14.2354 2.80132 14.1727 2.69008 14.0615C2.57883 13.9502 2.51612 13.7995 2.51563 13.6422V3.9275H17.4878V13.6409C17.4876 13.7986 17.4249 13.9498 17.3135 14.0614C17.202 14.1729 17.0508 14.2357 16.8931 14.2359Z" fill="#003944" />
                    <path d="M4.53906 9.11426H5.87406C5.95694 9.11426 6.03643 9.08133 6.09503 9.02273C6.15364 8.96412 6.18656 8.88464 6.18656 8.80176V6.98145C6.18656 6.89857 6.15364 6.81908 6.09503 6.76047C6.03643 6.70187 5.95694 6.66895 5.87406 6.66895H4.53906C4.45618 6.66895 4.3767 6.70187 4.31809 6.76047C4.25949 6.81908 4.22656 6.89857 4.22656 6.98145V8.80176C4.22656 8.88464 4.25949 8.96412 4.31809 9.02273C4.3767 9.08133 4.45618 9.11426 4.53906 9.11426ZM4.85156 7.29395H5.56156V8.48926H4.85156V7.29395Z" fill="#003944" />
                    <path d="M7.04688 9.11441H8.38062C8.46351 9.11441 8.54299 9.08149 8.6016 9.02288C8.6602 8.96428 8.69312 8.88479 8.69312 8.80191V5.7666C8.69312 5.68372 8.6602 5.60424 8.6016 5.54563C8.54299 5.48703 8.46351 5.4541 8.38062 5.4541H7.04688C6.96399 5.4541 6.88451 5.48703 6.8259 5.54563C6.7673 5.60424 6.73438 5.68372 6.73438 5.7666V8.80191C6.73438 8.88479 6.7673 8.96428 6.8259 9.02288C6.88451 9.08149 6.96399 9.11441 7.04688 9.11441ZM7.35938 6.0791H8.06812V8.48941H7.35938V6.0791Z" fill="#003944" />
                    <path d="M10.8848 4.83789H9.55078C9.4679 4.83789 9.38842 4.87081 9.32981 4.92942C9.27121 4.98802 9.23828 5.06751 9.23828 5.15039V8.80164C9.23828 8.88452 9.27121 8.96401 9.32981 9.02261C9.38842 9.08122 9.4679 9.11414 9.55078 9.11414H10.8848C10.9677 9.11414 11.0472 9.08122 11.1058 9.02261C11.1644 8.96401 11.1973 8.88452 11.1973 8.80164V5.15039C11.1973 5.06751 11.1644 4.98802 11.1058 4.92942C11.0472 4.87081 10.9677 4.83789 10.8848 4.83789ZM10.5723 8.48914H9.86328V5.46289H10.5723V8.48914Z" fill="#003944" />
                    <path d="M13.7052 8.80156V6.65625C13.7052 6.57337 13.6722 6.49388 13.6136 6.43528C13.555 6.37667 13.4755 6.34375 13.3927 6.34375H12.0586C11.9757 6.34375 11.8962 6.37667 11.8376 6.43528C11.779 6.49388 11.7461 6.57337 11.7461 6.65625V8.80063C11.7461 8.88351 11.779 8.96299 11.8376 9.0216C11.8962 9.0802 11.9757 9.11313 12.0586 9.11313H13.3927C13.4754 9.11313 13.5547 9.08033 13.6133 9.02193C13.6719 8.96353 13.7049 8.88428 13.7052 8.80156ZM13.0802 8.48906H12.3711V6.96875H13.0802V8.48906Z" fill="#003944" />
                    <path d="M14.5625 9.11375H15.8969C15.9798 9.11375 16.0592 9.08083 16.1178 9.02222C16.1765 8.96362 16.2094 8.88413 16.2094 8.80125V4.89062C16.2094 4.80774 16.1765 4.72826 16.1178 4.66965C16.0592 4.61105 15.9798 4.57812 15.8969 4.57812H14.5625C14.4796 4.57812 14.4001 4.61105 14.3415 4.66965C14.2829 4.72826 14.25 4.80774 14.25 4.89062V8.80125C14.25 8.88413 14.2829 8.96362 14.3415 9.02222C14.4001 9.08083 14.4796 9.11375 14.5625 9.11375ZM14.875 5.20312H15.5844V8.48875H14.875V5.20312Z" fill="#003944" />
                    <path d="M10.38 10.1416H4.26562C4.18274 10.1416 4.10326 10.1745 4.04465 10.2331C3.98605 10.2917 3.95312 10.3712 3.95312 10.4541V12.96C3.95312 13.0429 3.98605 13.1224 4.04465 13.181C4.10326 13.2396 4.18274 13.2725 4.26562 13.2725H10.38C10.4629 13.2725 10.5424 13.2396 10.601 13.181C10.6596 13.1224 10.6925 13.0429 10.6925 12.96V10.4541C10.6925 10.3712 10.6596 10.2917 10.601 10.2331C10.5424 10.1745 10.4629 10.1416 10.38 10.1416ZM10.0675 12.6475H4.57812V10.7666H10.0675V12.6475Z" fill="#003944" />
                    <path d="M16.4608 10.1416H13.0039C12.921 10.1416 12.8415 10.1745 12.7829 10.2331C12.7243 10.2917 12.6914 10.3712 12.6914 10.4541C12.6914 10.537 12.7243 10.6165 12.7829 10.6751C12.8415 10.7337 12.921 10.7666 13.0039 10.7666H16.4608C16.5437 10.7666 16.6231 10.7337 16.6818 10.6751C16.7404 10.6165 16.7733 10.537 16.7733 10.4541C16.7733 10.3712 16.7404 10.2917 16.6818 10.2331C16.6231 10.1745 16.5437 10.1416 16.4608 10.1416Z" fill="#003944" />
                    <path d="M16.4616 11.3945H12.5078C12.4249 11.3945 12.3454 11.4275 12.2868 11.4861C12.2282 11.5447 12.1953 11.6242 12.1953 11.707C12.1953 11.7899 12.2282 11.8694 12.2868 11.928C12.3454 11.9866 12.4249 12.0195 12.5078 12.0195H16.4616C16.5444 12.0195 16.6239 11.9866 16.6825 11.928C16.7411 11.8694 16.7741 11.7899 16.7741 11.707C16.7741 11.6242 16.7411 11.5447 16.6825 11.4861C16.6239 11.4275 16.5444 11.3945 16.4616 11.3945Z" fill="#003944" />
                    <path d="M16.4616 12.6475H12.5078C12.4249 12.6475 12.3454 12.6804 12.2868 12.739C12.2282 12.7976 12.1953 12.8771 12.1953 12.96C12.1953 13.0428 12.2282 13.1223 12.2868 13.1809C12.3454 13.2395 12.4249 13.2725 12.5078 13.2725H16.4616C16.5444 13.2725 16.6239 13.2395 16.6825 13.1809C16.7411 13.1223 16.7741 13.0428 16.7741 12.96C16.7741 12.8771 16.7411 12.7976 16.6825 12.739C16.6239 12.6804 16.5444 12.6475 16.4616 12.6475Z" fill="#003944" />
                    <path d="M8.09172 2.3871C8.10109 2.40585 8.11047 2.4246 8.11953 2.44022C8.13153 2.45809 8.14512 2.47482 8.16016 2.49022C8.18905 2.51837 8.22311 2.54065 8.26047 2.55585C8.2991 2.57161 8.34032 2.58009 8.38203 2.58085C8.46376 2.57925 8.54187 2.54689 8.60078 2.49022C8.6158 2.4749 8.6293 2.45815 8.64109 2.44022C8.65253 2.42363 8.66207 2.40581 8.66953 2.3871C8.67764 2.36794 8.68392 2.34806 8.68828 2.32772C8.6918 2.30812 8.69379 2.28826 8.69422 2.26835C8.69418 2.20663 8.67577 2.14632 8.64131 2.09512C8.60686 2.04391 8.55794 2.00413 8.50078 1.98085C8.46295 1.96386 8.42194 1.95508 8.38047 1.95508C8.33899 1.95508 8.29799 1.96386 8.26016 1.98085C8.20292 2.00405 8.1539 2.0438 8.11939 2.09502C8.08487 2.14623 8.06642 2.20658 8.06641 2.26835C8.06679 2.28828 8.06888 2.30815 8.07266 2.32772C8.07922 2.3496 8.08547 2.36835 8.09172 2.3871Z" fill="#003944" />
                    <path d="M9.7125 2.38785C9.71872 2.40706 9.72823 2.42504 9.74063 2.44098C9.75156 2.45779 9.76412 2.47349 9.77813 2.48785C9.79293 2.50219 9.80847 2.51575 9.82469 2.52848C9.84225 2.54026 9.86126 2.54972 9.88125 2.5566C9.89896 2.56563 9.91792 2.57195 9.9375 2.57535C9.95817 2.57884 9.97905 2.58093 10 2.5816C10.0834 2.58068 10.1631 2.54701 10.2219 2.48785C10.2359 2.47349 10.2484 2.45779 10.2594 2.44098C10.2717 2.42497 10.2812 2.40701 10.2875 2.38785C10.297 2.36928 10.3033 2.34919 10.3059 2.32848C10.3098 2.30891 10.312 2.28905 10.3125 2.2691C10.3113 2.18638 10.2789 2.10715 10.2219 2.04723C10.1913 2.01911 10.1565 1.99592 10.1188 1.97848C10.0614 1.95575 9.99871 1.95015 9.93825 1.96236C9.87778 1.97456 9.82216 2.00404 9.77813 2.04723C9.74921 2.07658 9.72684 2.11173 9.7125 2.15035C9.69649 2.18792 9.68799 2.22827 9.6875 2.2691C9.68803 2.28903 9.69012 2.30888 9.69375 2.32848C9.69665 2.34918 9.70298 2.36925 9.7125 2.38785Z" fill="#003944" />
                    <path d="M11.3981 2.49039C11.4126 2.50438 11.4284 2.51694 11.4453 2.52789C11.4613 2.54028 11.4792 2.54979 11.4984 2.55601C11.517 2.56553 11.5371 2.57186 11.5578 2.57476C11.5774 2.57839 11.5973 2.58048 11.6172 2.58101C11.6589 2.58025 11.7001 2.57177 11.7387 2.55601C11.7761 2.54087 11.8102 2.51858 11.8391 2.49039C11.8982 2.43161 11.9319 2.35191 11.9328 2.26851C11.9329 2.24735 11.9298 2.22629 11.9237 2.20601C11.9199 2.18688 11.9146 2.16807 11.9078 2.14976C11.8987 2.1303 11.8883 2.1115 11.8766 2.09351C11.8658 2.07656 11.8532 2.06084 11.8391 2.04664C11.8095 2.01849 11.7757 1.99528 11.7387 1.97789C11.6811 1.95571 11.6184 1.95029 11.5578 1.96226C11.5376 1.96557 11.5177 1.9708 11.4984 1.97789C11.4797 1.98643 11.4619 1.9969 11.4453 2.00914C11.4277 2.01908 11.4118 2.03173 11.3981 2.04664C11.3839 2.06155 11.3704 2.0772 11.3578 2.09351C11.346 2.11093 11.3365 2.12984 11.3297 2.14976C11.3219 2.16796 11.3156 2.18678 11.3109 2.20601C11.3072 2.22664 11.3051 2.24754 11.3047 2.26851C11.3052 2.30935 11.3137 2.34969 11.3297 2.38726C11.3455 2.42579 11.3688 2.46083 11.3981 2.49039Z" fill="#003944" />
                  </svg>

                }
                size="small"
                className="hover:bg-green-50"
              />

              {/* shere Property button */}
              <Button
                onClick={() => handleShare(record?.id)}
                type="text"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_3678_2780)">
                      <path
                        d="M19.8248 5.81597L14.4082 0.191032C14.2315 0.0077761 13.9606 -0.0497489 13.7249 0.0451597C13.4882 0.140984 13.3332 0.370168 13.3332 0.62514V3.33354H13.1249C8.64498 3.33354 5 6.97852 5 11.4585V12.7084C5 12.9984 5.20416 13.24 5.4866 13.306C5.53253 13.3176 5.5783 13.3226 5.62408 13.3226C5.85998 13.3226 6.0858 13.1842 6.1949 12.9668C7.36661 10.6226 9.72239 9.16676 12.3432 9.16676H13.3332V11.875C13.3332 12.1301 13.4882 12.3593 13.7249 12.4542C13.9591 12.5501 14.2315 12.4918 14.4082 12.3084L19.8248 6.68342C20.0581 6.44096 20.0581 6.05934 19.8248 5.81597Z"
                        fill="#003944"
                      />
                      <path
                        d="M17.4998 20.0004H2.49997C1.12166 20.0004 0 18.8789 0 17.5004V5.83396C0 4.45565 1.12166 3.33398 2.49997 3.33398H4.99994C5.46075 3.33398 5.83322 3.70645 5.83322 4.16726C5.83322 4.62807 5.46075 5.00053 4.99994 5.00053H2.49997C2.03992 5.00053 1.66655 5.37391 1.66655 5.83396V17.5004C1.66655 17.9604 2.03992 18.3338 2.49997 18.3338H17.4998C17.9597 18.3338 18.3331 17.9604 18.3331 17.5004V10.8339C18.3331 10.3731 18.7055 10.0005 19.1663 10.0005C19.6273 10.0005 19.9998 10.3731 19.9998 10.8339V17.5004C19.9998 18.8789 18.8781 20.0004 17.4998 20.0004Z"
                        fill="#003944"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3678_2780">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                }
                size="small"
                className="hover:bg-green-50"
              />
            </div>

            {/* Three-dot button */}
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              onClick={() => setShowActions(!showActions)}
              className="hover:bg-gray-100"
            />

            {/* Massege Modal */}

            <Modal
              title="Property Messages"
              open={isMessageModalOpen}
              onCancel={closeMessagesModal}
              footer={null}
              width={700}
              styles={{
                mask: {
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                  // backdropFilter: "blur(4px)",
                },
                body: {
                  maxHeight: "70vh",
                  overflowY: "auto",
                  paddingRight: 8,
                },
              }}
            >
              {isMessagesLoading || isMessagesFetching ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton active title paragraph={{ rows: 2 }} />
                    </div>
                  ))}
                </div>
              ) : isMessagesError ? (
                <div className="py-6 text-center text-red-500">
                  Failed to load messages.
                </div>
              ) : !messagesRes?.data?.length ? (
                <Empty description="No messages found for this property." />
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={messagesRes?.data}
                  renderItem={(item) => (
                    <List.Item key={item.id}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-[#2B2B2B]">
                              {item.subject}
                            </h3>
                            <p className="text-sm text-gray-600">
                              From: <span className="font-medium">{item.customer?.name}</span>{" "}
                              <span className="text-gray-500">({item.customer?.email})</span>
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Modal>

          </div >
        );
      },
    },
  ];
  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col overflow-hidden bg-gray-50" style={{ height: "calc(100vh - 64px)" }}>
      {/* ─── MOBILE / TABLET (< lg) ─── */}
      <div className="flex lg:hidden flex-col h-full overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0 flex items-center gap-2">
          <Input
            placeholder="Search properties..."
            className="flex-1 rounded-2xl border border-gray-200"
            size="middle"
            value={searchText}
            onChange={handleSearchChange}
            allowClear
            suffix={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15.8 15.8M15.8 15.8A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z" stroke="#C4BBBB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <Button href="/dashboard/admin/property-list/add-property" type="primary" size="middle" className="bg-[#004E60] flex-shrink-0">
            + Add
          </Button>
        </div>

        {/* Horizontal filter chips */}
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex-shrink-0 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Object.entries(FILTERS).map(([key, filter]) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key as FilterKey)}
                className={`px-3 py-1 rounded-full text-sm font-poppins font-medium transition-colors whitespace-nowrap ${currentFilter === key ? "bg-[#004E60] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards */}
        <div className="flex-1 overflow-y-auto p-4">
          {mappedProperties.length === 0 ? (
            <div className="flex items-center justify-center h-full"><Empty description="No properties found" /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mappedProperties.map((record: any) => {
                  return (
                    <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative w-full h-40 bg-gray-200">
                        <Image src={record.image} alt={record.name} fill className="object-cover" />
                        <span className="absolute top-2 right-2 bg-[#3BB273] text-white text-xs font-poppins px-2 py-0.5 rounded-full shadow">
                          {record.status}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-[#2B2B2B] font-poppins truncate mb-0.5">{record.name}</p>
                        <p className="text-xs text-gray-500 font-poppins truncate mb-2 flex items-center gap-1">
                          <Image src={location} width={12} height={12} alt="loc" />{record.region}
                        </p>
                        <div className="flex gap-3 mb-2">
                          <span className="text-xs text-[#3bb273] font-robotomono flex items-center gap-1"><Image src={s4} width={14} height={14} alt="v" />{record.visitors}</span>
                          <span className="text-xs text-[#3bb273] font-robotomono flex items-center gap-1"><Image src={s3} width={14} height={14} alt="f" />{record.favorites}</span>
                          <span className="text-xs text-[#3bb273] font-robotomono flex items-center gap-1"><Image src={s2} width={14} height={14} alt="s" />{record.shares}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <div><p className="text-xs text-gray-400 font-poppins">Price</p><p className="text-sm font-bold text-[#2B2B2B] font-robotomono">${record.price.toLocaleString()}</p></div>
                          <div><p className="text-xs text-gray-400 font-poppins">Cap Rate</p><p className="text-sm font-bold text-[#2B2B2B] font-robotomono">{record.capRate}%</p></div>
                          <div><p className="text-xs text-gray-400 font-poppins">Income/yr</p><p className="text-sm font-bold text-[#2B2B2B] font-robotomono">${record.annualIncome.toLocaleString()}</p></div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                          <Link href={`/all-property/${record.id}`} className="flex-1"><button className="w-full text-xs py-1.5 px-2 rounded border border-[#003944] text-[#003944] font-poppins hover:bg-[#003944] hover:text-white transition-colors">View</button></Link>
                          <Link href={`/dashboard/admin/property-list/edit-property/${record.id}`} className="flex-1"><button className="w-full text-xs py-1.5 px-2 rounded border border-[#004E60] text-[#004E60] font-poppins hover:bg-[#004E60] hover:text-white transition-colors">Edit</button></Link>
                          <button onClick={() => openMessagesModal(record.id)} className="flex-1 text-xs py-1.5 px-2 rounded border border-gray-300 text-gray-600 font-poppins hover:bg-gray-100 transition-colors">Msgs</button>
                          <button onClick={() => handleShare(record.id)} className="flex-1 text-xs py-1.5 px-2 rounded border border-gray-300 text-gray-600 font-poppins hover:bg-gray-100 transition-colors">Share</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Mobile pagination */}
              <div className="flex justify-center mt-4 pb-4">
                <div className="flex items-center gap-2">
                  <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2.5 py-1 rounded border border-gray-200 text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50 font-poppins">← Prev</button>
                  <span className="text-xs text-gray-500 font-poppins px-2">{page} / {Math.ceil((getAllProperty?.pagination?.total ?? 0) / limit) || 1}</span>
                  <button disabled={page >= Math.ceil((getAllProperty?.pagination?.total ?? 0) / limit)} onClick={() => setPage((p) => p + 1)} className="px-2.5 py-1 rounded border border-gray-200 text-xs text-gray-600 disabled:opacity-40 hover:bg-gray-50 font-poppins">Next →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── DESKTOP (lg+) ─── */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width, scrollable if needed */}
        <div className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            <Button
              type="primary"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 8V16"
                    stroke="#F8F8F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.69893 10.2997C2.47488 10.5235 2.29714 10.7893 2.17587 11.0818C2.05461 11.3744 1.99219 11.688 1.99219 12.0047C1.99219 12.3214 2.05461 12.635 2.17587 12.9275C2.29714 13.2201 2.47488 13.4859 2.69893 13.7097L10.2889 21.2997C10.5128 21.5237 10.7785 21.7015 11.0711 21.8227C11.3637 21.944 11.6772 22.0064 11.9939 22.0064C12.3106 22.0064 12.6242 21.944 12.9168 21.8227C13.2093 21.7015 13.4751 21.5237 13.6989 21.2997L21.2889 13.7097C21.513 13.4859 21.6907 13.2201 21.812 12.9275C21.9333 12.635 21.9957 12.3214 21.9957 12.0047C21.9957 11.688 21.9333 11.3744 21.812 11.0818C21.6907 10.7893 21.513 10.5235 21.2889 10.2997L13.6989 2.70968C13.4751 2.48562 13.2093 2.30788 12.9168 2.18662C12.6242 2.06535 12.3106 2.00293 11.9939 2.00293C11.6772 2.00293 11.3637 2.06535 11.0711 2.18662C10.7785 2.30788 10.5128 2.48562 10.2889 2.70968L2.69893 10.2997Z"
                    stroke="#F8F8F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12H16"
                    stroke="#F8F8F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              href="/dashboard/admin/property-list/add-property"
              block
              size="large"
              className="mb-6 h-11 bg-[#004E60] hover:bg-[#005a63] border-[#006d75]"
            >
              Add Property
            </Button>

            <Menu
              mode="inline"
              selectedKeys={[currentFilter]}
              onClick={({ key }) => handleFilterChange(key as FilterKey)}
              className="border-none"
              items={Object.entries(FILTERS).map(([key, filter]) => ({
                key,
                label: filter.label,
              }))}
            />
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Add Button - Fixed */}
          <div className="flex-shrink-0 px-6 pt-6 pb-4">
            <div className="flex justify-between items-center">
              <Input
                placeholder="Search"
                suffix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21.0008 20.9998L15.8038 15.8028M15.8038 15.8028C17.2104 14.3962 18.0006 12.4885 18.0006 10.4993C18.0006 8.51011 17.2104 6.60238 15.8038 5.19581C14.3972 3.78923 12.4895 2.99902 10.5003 2.99902C8.51108 2.99902 6.60336 3.78923 5.19678 5.19581C3.79021 6.60238 3 8.51011 3 10.4993C3 12.4885 3.79021 14.3962 5.19678 15.8028C6.60336 17.2094 8.51108 17.9996 10.5003 17.9996C12.4895 17.9996 14.3972 17.2094 15.8038 15.8028Z"
                      stroke="#C4BBBB"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                className="w-80 rounded-3xl border border-gray-200"
                size="large"
                value={searchText}
                onChange={handleSearchChange}
                allowClear
              />
              <Button
                href="/dashboard/admin/property-list/add-property"
                type="primary"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 8V16"
                      stroke="#F8F8F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.69893 10.2997C2.47488 10.5235 2.29714 10.7893 2.17587 11.0818C2.05461 11.3744 1.99219 11.688 1.99219 12.0047C1.99219 12.3214 2.05461 12.635 2.17587 12.9275C2.29714 13.2201 2.47488 13.4859 2.69893 13.7097L10.2889 21.2997C10.5128 21.5237 10.7785 21.7015 11.0711 21.8227C11.3637 21.944 11.6772 22.0064 11.9939 22.0064C12.3106 22.0064 12.6242 21.944 12.9168 21.8227C13.2093 21.7015 13.4751 21.5237 13.6989 21.2997L21.2889 13.7097C21.513 13.4859 21.6907 13.2201 21.812 12.9275C21.9333 12.635 21.9957 12.3214 21.9957 12.0047C21.9957 11.688 21.9333 11.3744 21.812 11.0818C21.6907 10.7893 21.513 10.5235 21.2889 10.2997L13.6989 2.70968C13.4751 2.48562 13.2093 2.30788 12.9168 2.18662C12.6242 2.06535 12.3106 2.00293 11.9939 2.00293C11.6772 2.00293 11.3637 2.06535 11.0711 2.18662C10.7785 2.30788 10.5128 2.48562 10.2889 2.70968L2.69893 10.2997Z"
                      stroke="#F8F8F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 12H16"
                      stroke="#F8F8F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                size="large"
                className="h-11 bg-[#004E60]"
              >
                Add Property
              </Button>
            </div>
          </div>

          {/* Table Container - Scrollable */}
          <div className="flex-1 px-6 pb-6 overflow-hidden">
            <div className="bg-white rounded-lg h-full overflow-hidden">
              <Table
                columns={columns}
                dataSource={mappedProperties}
                rowKey="id"
                pagination={{
                  current: page,
                  pageSize: limit,
                  total: getAllProperty?.pagination?.total,
                  size: "small",
                  onChange: setPage,
                  showSizeChanger: false,
                }}
                components={{
                  header: {
                    cell: (props: any) => (
                      <th
                        {...props}
                        style={{
                          ...props.style,
                          fontSize: "18px",
                          fontWeight: "600",
                          textAlign: "center",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      />
                    ),
                  },
                }}
                scroll={{
                  x: "max-content",
                  y: "calc(100vh - 280px)",
                }}
                className="custom-table [&_.ant-table-thead>tr>th]:text-lg [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-gray-800 [&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-thead>tr>th]:border-none [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-dotted [&_.ant-table-tbody>tr>td]:border-gray-300 [&_.ant-table-tbody>tr:last-child>td]:border-b-0 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50"
                sticky={{
                  offsetHeader: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}