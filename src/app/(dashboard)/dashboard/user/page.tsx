/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { AgentPropertyTable } from "@/components/table/AgentPropertyTable";
import Spinner from "@/components/ui/Spinner";
import { useGetAgencySellStatisticsQuery } from "@/redux/service/admin/dashboardApi";
import { useGetAgencyStatisticsQuery } from "@/redux/service/agent/dashboardapi";
// import { propertiesData, useGetAgencyPropertiesQuery } from "@/redux/service/agent/propertiesApi";
import React from "react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
export default function Page() {

  return (
    <div>
      <DashboardOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PropertyChart />
        <EngagementChart />
      </div>
      {/* <AnnunciDashboard /> */}

      <AgentPropertyTable />
    </div>
  );
}

function DashboardOverview() {

  const { data: agencyStats, isLoading: statsLoading } = useGetAgencyStatisticsQuery();

  const stats = [
    {
      label: "Total Property",
      value: agencyStats?.data.properties || "0",
      color: "bg-orange-500",
      svg: "property", // Add your property SVG here
    },
    {
      label: "Total Booked",
      value: agencyStats?.data.bookedProperties || "0",
      color: "bg-slate-700",
      svg: "booked", // Add your booked SVG here
    },
    {
      label: "Total Visitors",
      value: agencyStats?.data.visitors || "0",
      color: "bg-red-500",
      svg: "visitors", // Add your visitors SVG here
    },
    {
      label: "Total Favorites",
      value: agencyStats?.data.favorites || "0",
      color: "bg-gray-400",
      svg: "favorites", // Add your favorites SVG here
    },
  ];

  // console.log("Agency Stats Data:", agencyStats);

  if (statsLoading) {
    return (
      <Spinner />
    );
  }

  return (
    <div className="w-full    py-12">
      <h2 className="text-[#BDBDBD] text-sm md:text-base  font-semibold mb-6">
        Dashboard Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg p-6  border border-[#F9EEE4] bg-[#F8F8F6] shadow-[0_2px_8px_0_rgba(0,0,0,0.10)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-md mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`${stat.color} rounded-full p-4 flex items-center justify-center`}
              >
                {/* Replace with your specific SVG for each stat */}
                {stat.svg === "property" && (
                  // Your property SVG here
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M25.3707 4.19259H22.4757V2.89747C22.4757 2.47845 22.0186 2.28801 21.5996 2.28801H19.3522C18.8189 0.764314 17.4857 0.00246642 15.962 0.00246642C14.455 -0.0541855 13.0844 0.869816 12.5717 2.28801H10.3624C9.94338 2.28801 9.52436 2.47845 9.52436 2.89747V4.19259H6.62928C4.91368 4.21089 3.51014 5.56427 3.4295 7.27804V29.1049C3.4295 30.781 4.9532 31.9999 6.62928 31.9999H25.3707C27.0468 31.9999 28.5705 30.781 28.5705 29.1049V7.27811C28.4898 5.56427 27.0863 4.21089 25.3707 4.19259ZM11.048 3.8117H13.1431C13.5088 3.76708 13.8026 3.48885 13.8669 3.12605C14.0925 2.14365 14.9543 1.43845 15.962 1.41191C16.9603 1.44217 17.8092 2.14955 18.0189 3.12605C18.0872 3.50139 18.4004 3.7832 18.7808 3.8117H20.9521V6.85909H11.048V3.8117ZM27.0468 29.105C27.0468 29.943 26.2087 30.4763 25.3707 30.4763H6.62928C5.79124 30.4763 4.9532 29.943 4.9532 29.105V7.27811C5.03092 6.40581 5.75362 5.73233 6.62928 5.71636H9.52428V7.65907C9.56453 8.08589 9.93419 8.40517 10.3623 8.38286H21.5995C22.0355 8.4067 22.4168 8.0918 22.4756 7.65907V5.71629H25.3706C26.2462 5.73233 26.969 6.40573 27.0467 7.27804V29.105H27.0468Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M13.0669 17.0305C12.7811 16.7293 12.3068 16.7123 12.0002 16.9924L9.56231 19.316L8.53383 18.2494C8.24809 17.9482 7.77373 17.9313 7.46721 18.2113C7.17214 18.5205 7.17214 19.0069 7.46721 19.316L9.02897 20.9159C9.16415 21.0673 9.3594 21.151 9.56224 21.1445C9.76318 21.1416 9.95487 21.0595 10.0955 20.9159L13.0667 18.0971C13.3613 17.8269 13.381 17.369 13.1107 17.0745C13.0968 17.0591 13.0822 17.0445 13.0669 17.0305Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M23.9994 18.668H15.2382C14.8175 18.668 14.4764 19.009 14.4764 19.4298C14.4764 19.8506 14.8175 20.1917 15.2382 20.1917H23.9994C24.4202 20.1917 24.7613 19.8506 24.7613 19.4298C24.7613 19.009 24.4202 18.668 23.9994 18.668Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M13.0669 10.9348C12.7811 10.6336 12.3068 10.6166 12.0003 10.8967L9.56234 13.2203L8.53386 12.1537C8.24812 11.8525 7.77376 11.8355 7.46724 12.1156C7.17217 12.4248 7.17217 12.9112 7.46724 13.2203L9.029 14.8202C9.16418 14.9716 9.35943 15.0553 9.56227 15.0488C9.76321 15.0459 9.9549 14.9638 10.0955 14.8202L13.0667 12.0014C13.3613 11.7312 13.381 11.2733 13.1107 10.9788C13.0969 10.9634 13.0822 10.9488 13.0669 10.9348Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M23.9994 12.5723H15.2382C14.8175 12.5723 14.4764 12.9133 14.4764 13.3341C14.4764 13.7549 14.8175 14.096 15.2382 14.096H23.9994C24.4202 14.096 24.7613 13.7549 24.7613 13.3341C24.7613 12.9133 24.4202 12.5723 23.9994 12.5723Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M13.0669 23.1242C12.7811 22.823 12.3068 22.8061 12.0002 23.0861L9.56231 25.4097L8.53383 24.3431C8.24809 24.0419 7.77373 24.025 7.46721 24.3051C7.17214 24.6142 7.17214 25.1006 7.46721 25.4097L9.02897 27.0096C9.16415 27.161 9.3594 27.2447 9.56224 27.2382C9.76318 27.2354 9.95487 27.1532 10.0955 27.0096L13.0667 24.1908C13.3613 23.9206 13.381 23.4627 13.1107 23.1682C13.0968 23.1529 13.0822 23.1383 13.0669 23.1242Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M23.9994 24.7617H15.2382C14.8175 24.7617 14.4764 25.1028 14.4764 25.5236C14.4764 25.9443 14.8175 26.2854 15.2382 26.2854H23.9994C24.4202 26.2854 24.7613 25.9443 24.7613 25.5236C24.7613 25.1028 24.4202 24.7617 23.9994 24.7617Z"
                      fill="#F8F8F6"
                    />
                  </svg>
                )}
                {stat.svg === "booked" && (
                  // Your booked SVG here
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_3497_4523)">
                      <path
                        d="M15.77 15.4145C17.8877 15.4145 19.7212 14.655 21.2197 13.1565C22.7178 11.6582 23.4775 9.82493 23.4775 7.70702C23.4775 5.58983 22.718 3.75634 21.2195 2.25756C19.7209 0.75952 17.8875 0 15.77 0C13.6521 0 11.8188 0.75952 10.3206 2.25781C8.82227 3.7561 8.0625 5.58959 8.0625 7.70702C8.0625 9.82493 8.82227 11.6584 10.3206 13.1567C11.8193 14.6548 13.6528 15.4145 15.77 15.4145ZM11.6467 3.58373C12.7964 2.43408 14.145 1.87524 15.77 1.87524C17.3948 1.87524 18.7437 2.43408 19.8936 3.58373C21.0432 4.73363 21.6023 6.08251 21.6023 7.70702C21.6023 9.33201 21.0432 10.6806 19.8936 11.8305C18.7437 12.9804 17.3948 13.5393 15.77 13.5393C14.1455 13.5393 12.7969 12.9802 11.6467 11.8305C10.4968 10.6809 9.93774 9.33201 9.93774 7.70702C9.93774 6.08251 10.4968 4.73363 11.6467 3.58373Z"
                        fill="#F8F8F6"
                      />
                      <path
                        d="M29.2581 24.6081C29.2148 23.9846 29.1274 23.3044 28.9988 22.5862C28.8689 21.8625 28.7017 21.1785 28.5015 20.5532C28.2944 19.907 28.0134 19.2688 27.6655 18.6572C27.3049 18.0225 26.8811 17.4697 26.4055 17.0149C25.9082 16.5391 25.2993 16.1565 24.5952 15.8774C23.8936 15.5999 23.116 15.4592 22.2842 15.4592C21.9575 15.4592 21.6416 15.5933 21.0315 15.9905C20.656 16.2354 20.2168 16.5186 19.7266 16.8318C19.3074 17.0989 18.7395 17.3491 18.0381 17.5757C17.3538 17.7971 16.6589 17.9094 15.9729 17.9094C15.2874 17.9094 14.5925 17.7971 13.9077 17.5757C13.207 17.3494 12.6389 17.0991 12.2205 16.832C11.7349 16.5217 11.2954 16.2385 10.9143 15.9902C10.3047 15.593 9.98877 15.459 9.66211 15.459C8.83008 15.459 8.05273 15.5999 7.35132 15.8777C6.64771 16.1562 6.03857 16.5388 5.54077 17.0151C5.06519 17.4702 4.64136 18.0227 4.28101 18.6572C3.93359 19.2688 3.65234 19.9067 3.44531 20.5535C3.24536 21.1787 3.07812 21.8625 2.94824 22.5862C2.81934 23.3035 2.73218 23.9839 2.68896 24.6089C2.64648 25.22 2.625 25.8559 2.625 26.4985C2.625 28.1689 3.15601 29.5212 4.20312 30.5185C5.2373 31.5027 6.60547 32.0017 8.26978 32.0017H23.678C25.3418 32.0017 26.71 31.5027 27.7444 30.5185C28.7917 29.5219 29.3228 28.1692 29.3228 26.4983C29.3225 25.8535 29.3008 25.2175 29.2581 24.6081ZM26.4514 29.1599C25.7681 29.8103 24.8608 30.1264 23.6777 30.1264H8.26978C7.08643 30.1264 6.1792 29.8103 5.49609 29.1601C4.82593 28.5222 4.50024 27.6513 4.50024 26.4985C4.50024 25.8989 4.52002 25.3069 4.55957 24.7385C4.59814 24.1809 4.677 23.5683 4.79395 22.9175C4.90942 22.2746 5.0564 21.6714 5.2312 21.1252C5.39893 20.6016 5.62769 20.083 5.91138 19.5835C6.18213 19.1074 6.49365 18.699 6.8374 18.3699C7.15894 18.062 7.56421 17.8101 8.04175 17.6211C8.4834 17.4463 8.97974 17.3506 9.51855 17.3362C9.58423 17.3711 9.70117 17.4377 9.89062 17.5613C10.2761 17.8125 10.7205 18.0991 11.2117 18.4128C11.7654 18.7659 12.4788 19.0847 13.3311 19.3599C14.2024 19.6416 15.0911 19.7847 15.9731 19.7847C16.8552 19.7847 17.7441 19.6416 18.615 19.3601C19.468 19.0845 20.1812 18.7659 20.7356 18.4123C21.2383 18.0911 21.6702 17.8127 22.0557 17.5613C22.2451 17.438 22.3621 17.3711 22.4277 17.3362C22.9668 17.3506 23.4631 17.4463 23.905 17.6211C24.3823 17.8101 24.7876 18.0623 25.1091 18.3699C25.4529 18.6987 25.7644 19.1072 26.0352 19.5837C26.3191 20.083 26.5481 20.6018 26.7156 21.125C26.8906 21.6719 27.0378 22.2749 27.1531 22.9172C27.2698 23.5693 27.3489 24.1821 27.3875 24.7388V24.7392C27.4272 25.3054 27.4473 25.8972 27.4475 26.4985C27.4473 27.6516 27.1216 28.5222 26.4514 29.1599Z"
                        fill="#F8F8F6"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3497_4523">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                {stat.svg === "visitors" && (
                  // Your visitors SVG here
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M31.7966 15.3762C31.5108 14.9851 24.6993 5.80078 15.9998 5.80078C7.30039 5.80078 0.488626 14.9851 0.203063 15.3758C-0.0676876 15.7468 -0.0676876 16.25 0.203063 16.621C0.488626 17.0121 7.30039 26.1964 15.9998 26.1964C24.6993 26.1964 31.5108 17.012 31.7966 16.6213C32.0678 16.2504 32.0678 15.7468 31.7966 15.3762ZM15.9998 24.0865C9.59177 24.0865 4.0417 17.9907 2.39875 15.9979C4.03957 14.0033 9.57802 7.91066 15.9998 7.91066C22.4076 7.91066 27.9573 14.0054 29.6009 15.9993C27.9601 17.9938 22.4217 24.0865 15.9998 24.0865Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M16.0016 9.67188C12.5114 9.67188 9.67188 12.5114 9.67188 16.0016C9.67188 19.4917 12.5114 22.3313 16.0016 22.3313C19.4917 22.3313 22.3313 19.4917 22.3313 16.0016C22.3313 12.5114 19.4917 9.67188 16.0016 9.67188ZM16.0016 20.2213C13.6747 20.2213 11.7818 18.3284 11.7818 16.0016C11.7818 13.6748 13.6748 11.7818 16.0016 11.7818C18.3284 11.7818 20.2213 13.6748 20.2213 16.0016C20.2213 18.3284 18.3285 20.2213 16.0016 20.2213Z"
                      fill="#F8F8F6"
                    />
                  </svg>
                )}
                {stat.svg === "favorites" && (
                  // Your favorites SVG here
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M25.6224 16.5475C25.3678 16.5008 25.1235 16.6693 25.0768 16.924C25.0302 17.1786 25.1987 17.4229 25.4533 17.4696C28.1028 17.9554 30.0257 20.2642 30.0257 22.9596C30.0257 25.6688 28.0853 27.9331 25.5214 28.4364C25.5163 28.4373 25.5112 28.4376 25.5062 28.4385C25.1539 28.5066 24.7965 28.5412 24.444 28.5412C21.3663 28.5412 18.8623 26.0373 18.8623 22.9596C18.8623 20.2291 20.8288 17.9473 23.4347 17.4696C23.6893 17.4229 23.8579 17.1786 23.8112 16.924C23.7645 16.6693 23.5199 16.5006 23.2657 16.5475C21.7716 16.8214 20.4763 17.5926 19.5351 18.6704L16.6205 17.5416V15.9149C17.6767 15.1063 18.405 13.8911 18.5703 12.5051C19.8257 12.4494 20.7603 11.445 20.7603 10.2509C20.7603 9.69756 20.557 9.16981 20.1957 8.76244V6.70512C20.1958 3.00787 17.1879 0 13.4908 0C9.79366 0 6.78572 3.00787 6.78572 6.70506V8.81563C6.42022 9.21956 6.22128 9.72 6.22128 10.2508C6.22128 11.4436 7.15403 12.4492 8.41097 12.5049C8.57566 13.8997 9.31184 15.1654 10.4713 15.9934V17.5416L3.88416 20.0953C3.88122 20.0964 3.87828 20.0976 3.87534 20.0988C3.75941 20.1465 1.03516 21.3031 1.03516 24.4872V30.9381C1.03516 31.5236 1.51147 32 2.09703 32C2.38766 32 24.6983 32 25.0072 32C25.5898 32 26.0639 31.526 26.0639 30.9433V29.2751C28.8775 28.553 30.9632 25.9954 30.9632 22.9597C30.9632 19.8116 28.717 17.1149 25.6224 16.5475ZM17.9917 19.0779L16.303 22.4622C16.2801 22.446 15.8564 22.145 14.2247 20.9861C15.4228 19.5072 15.0215 20.0025 16.301 18.4231L17.9917 19.0779ZM14.7552 22.5131L14.2724 23.2397H12.8232L12.3405 22.5131L13.5478 21.6556L14.7552 22.5131ZM11.4089 17.6922V16.5222C12.0423 16.7947 12.7937 16.9538 13.5572 16.9538C14.2929 16.9538 15.0214 16.7926 15.6831 16.4839V17.6966L13.5478 20.3324L11.4089 17.6922ZM19.3694 11.2412C19.1563 11.4245 18.894 11.5337 18.6075 11.5621V8.93987C19.8081 9.05612 20.2272 10.5034 19.3694 11.2412ZM8.37428 11.5621C7.65353 11.4908 7.15891 10.9136 7.15891 10.2509C7.15891 9.58644 7.73578 9.06588 8.37428 8.96119V11.5621ZM8.38959 8.01388C8.17116 8.03381 7.91147 8.09831 7.72328 8.17163V6.70506C7.72328 3.52487 10.3105 0.937563 13.4907 0.937563C16.6708 0.937563 19.2582 3.52481 19.2582 6.70506V8.1305C19.0514 8.05694 18.8332 8.01237 18.6075 7.999C18.6075 7.43563 18.676 7.59594 17.0427 5.84369C16.9121 5.70356 16.7589 5.498 16.4349 5.42994C16.2096 5.38256 15.9677 5.42275 15.7624 5.55694C13.9203 6.76025 11.6087 7.43575 9.38834 7.29025C8.84572 7.25444 8.47322 7.563 8.38959 8.01388ZM9.31184 11.9036C9.31184 11.5109 9.31184 8.63231 9.31184 8.22506C11.6972 8.38481 14.214 7.67869 16.2442 6.36194C17.0913 7.27213 17.547 7.7445 17.67 7.90294C17.67 12.579 17.671 11.7469 17.6673 12.0064C17.6127 14.2163 15.801 16.0162 13.5572 16.0162C11.061 16.0163 9.31184 14.0916 9.31184 11.9036ZM10.7918 18.4243L12.8686 20.9878C12.192 21.4683 11.1446 22.2124 10.7925 22.4624L9.10384 19.0781L10.7918 18.4243ZM6.31234 31.0625V25.4865C6.31234 25.2276 6.10253 25.0177 5.84359 25.0177C5.58466 25.0177 5.37484 25.2276 5.37484 25.4865V31.0625H2.09703C2.02847 31.0625 1.97272 31.0067 1.97272 30.9382V24.4873C1.97272 21.9653 4.10284 21.0209 4.22897 20.9673L8.22559 19.4179L9.98372 22.9414C9.98372 22.9414 9.98372 22.9414 9.98378 22.9414C10.0987 23.1717 10.3078 23.3396 10.5575 23.4021C11.0144 23.5163 11.2865 23.2616 11.5756 23.0562L12.0787 23.8134L10.8517 31.0625H6.31234ZM20.787 31.0624H16.2439L15.8232 28.5764C15.78 28.3212 15.5388 28.1495 15.2828 28.1924C15.0275 28.2356 14.8557 28.4776 14.8988 28.7328L15.2932 31.0624H11.8027L12.968 24.1772H14.1278L14.5286 26.5451C14.5717 26.8004 14.8133 26.9723 15.069 26.9291C15.3243 26.8859 15.4962 26.6439 15.453 26.3888L15.0171 23.8134L15.5202 23.0562L15.8153 23.2659C16.2556 23.5787 16.871 23.4241 17.1118 22.9415C17.1119 22.9415 17.1119 22.9415 17.1119 22.9415L18.8699 19.4182L18.9499 19.4491C18.2983 20.4686 17.9249 21.6821 17.9249 22.9597C17.9249 25.2001 19.061 27.1799 20.7871 28.3539L20.787 31.0624ZM25.1265 30.9433C25.1265 31.0091 25.073 31.0625 25.0073 31.0625H21.7246V28.8838C22.5528 29.2655 23.474 29.4789 24.4442 29.4789C24.6746 29.4789 24.9022 29.4667 25.1265 29.4433L25.1265 30.9433Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M26.6647 21.5752C26.484 21.3898 26.1873 21.3859 26.0018 21.5667L24.1588 23.3631L23.3868 22.6063C23.2019 22.4251 22.9051 22.4281 22.7238 22.613C22.5426 22.7979 22.5456 23.0947 22.7305 23.2759L23.8298 24.3532C23.9209 24.4426 24.0394 24.4872 24.1579 24.4872C24.276 24.4872 24.394 24.4429 24.4851 24.3542L26.6561 22.2381C26.8416 22.0573 26.8453 21.7606 26.6647 21.5752Z"
                      fill="#F8F8F6"
                    />
                    <path
                      d="M24.4445 18.0898C21.759 18.0898 19.5742 20.2747 19.5742 22.9602C19.5742 25.6457 21.759 27.8305 24.4445 27.8305C27.13 27.8305 29.3148 25.6457 29.3148 22.9602C29.3148 20.2747 27.13 18.0898 24.4445 18.0898ZM24.4445 26.8928C22.276 26.8928 20.5118 25.1286 20.5118 22.9601C20.5118 20.7916 22.276 19.0273 24.4445 19.0273C26.613 19.0273 28.3773 20.7916 28.3773 22.9601C28.3773 25.1286 26.613 26.8928 24.4445 26.8928Z"
                      fill="#F8F8F6"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyChart() {
  const [activeTab, setActiveTab] = useState("Attivi");

  const { data: agencySellStats, isLoading: statsLoading } =
    useGetAgencySellStatisticsQuery();

  // Simple color map (stable colors per type)
  const TYPE_COLORS: Record<string, string> = {
    RESIDENTIAL: "#1E5A6E",
    BUILDINGS: "#E63946",
    FLAT: "#FF6B9D",
    SHOPS: "#4ECDC4",
    GARAGE: "#95E1D3",
    OFFICES: "#F38181",
    LAND: "#FFA07A",
    WAREHOUSES: "#C0C0C0",
    OTHERS: "#F7DC6F",
    COMMERCIAL: "#7DCEA0",
    HOSPITALITY: "#AF7AC5",
  };

  // Optional: label mapping (if you want Italian-friendly names)
  const TYPE_LABELS: Record<string, string> = {
    RESIDENTIAL: "Residenzial",
    BUILDINGS: "Industrial Buildings",
    FLAT: "Flat",
    SHOPS: "Shops",
    GARAGE: "Garages",
    OFFICES: "Offices",
    LAND: "Land",
    WAREHOUSES: "Warehouses",
    OTHERS: "Others",
    COMMERCIAL: "Commercial",
    HOSPITALITY: "Hospitality",
  };

  const breakdown = agencySellStats?.data?.breakdown ?? [];

  //  Pie chart uses REAL totals
  const chartData = breakdown.map((item) => ({
    name: TYPE_LABELS[item.type] ?? item.type,
    value: item.total ?? 0,
    color: TYPE_COLORS[item.type] ?? "#999999",
  }));

  //  Table uses REAL totals/sell/rent
  const tableData = breakdown.map((item) => ({
    type: TYPE_LABELS[item.type] ?? item.type,
    color: TYPE_COLORS[item.type] ?? "#999999",
    totali: item.total ?? 0,
    vendita: item.sell ?? 0,
    affitto: item.rent ?? 0,
  }));

  //  Total in center: use API totalProperties (or fallback to sum)
  const totalProperty =
    agencySellStats?.data?.totalProperties ??
    chartData.reduce((sum, item) => sum + item.value, 0);

  // Optional: show loading state (keeps UI clean)
  if (statsLoading) {
    return (
      <Spinner></Spinner>
    );
  }

  return (
    <div className="w-full rounded-lg p-6">
      {/* Header */}
      {/* <div className="flex items-center gap-4 mb-6">
        <h2 className="text-sm md:text-lg font-semibold text-black">Annunci</h2>
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="appearance-none bg-transparent px-4 py-2 pr-8 text-sm md:text-[18px] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer rounded-[16px] border border-[#D4D4D4] shadow-md h-full"
          >
            <option value="Attivi">Attivi</option>
            <option value="Inattivi">Inattivi</option>
            <option value="Tutti">Tutti</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <div className="flex flex-col items-center justify-center relative">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={4}
                dataKey="value"
                label={({ value }) => value}
                labelLine={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-xs md:text-lg font-semibold text-black">
              Total Property
            </p>
            <p className="text-xs md:text-lg font-semibold text-black">
              {totalProperty}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden text-sm font-normal font-poppins">
          <table className="w-full table-auto">
            <thead className="text-sm font-normal">
              <tr className="border-b border-[#D4D4D4]">
                <th className="w-2/6 text-left py-3 px-2 text-[#2B2B2B]">
                  Tipologia
                </th>
                <th className="w-1/6 text-center py-3 px-2 text-[#2B2B2B]">
                  Totali
                </th>
                <th className="w-1/6 text-center py-3 px-2 text-[#2B2B2B]">
                  Vendita
                </th>
                <th className="w-1/6 text-center py-3 px-2 text-[#2B2B2B]">
                  Affitto
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-[#D4D4D4] hover:bg-gray-50"
                >
                  <td className="w-2/6 py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 flex-shrink-0"
                        style={{ backgroundColor: row.color }}
                      ></div>
                      <span className="text-gray-700">{row.type}</span>
                    </div>
                  </td>
                  <td className="w-1/6 text-center py-3 px-2 text-[#2B2B2B]">
                    {row.totali}
                  </td>
                  <td className="w-1/6 text-center py-3 px-2 text-[#2B2B2B]">
                    {row.vendita}
                  </td>
                  <td className="w-1/6 text-center py-3 px-2 text-[#2B2B2B]">
                    {row.affitto}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EngagementChart() {
  const data = [
    { name: "Mon", visitors: 45, favorites: 12 },
    { name: "Tue", visitors: 52, favorites: 18 },
    { name: "Wed", visitors: 38, favorites: 15 },
    { name: "Thu", visitors: 65, favorites: 25 },
    { name: "Fri", visitors: 48, favorites: 20 },
    { name: "Sat", visitors: 80, favorites: 35 },
    { name: "Sun", visitors: 70, favorites: 30 },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-fit">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Engagement</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              cursor={{ fill: "#f8fafc" }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Bar dataKey="visitors" name="Visitors" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="favorites" name="Favorites" fill="#1E293B" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


function AnnunciDashboard() {
  return (
    <div className="w-full  p-6 bg-[#F8F8F6] rounded-lg ">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="md:text-3xl text-xl font-semibold text-gray-900">
          Annunci
        </h2>
        <span className="bg-[#3BB273] text-white text-lg font-medium px-3 py-1 rounded-[5px]">
          90% Quality
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* First card */}
        <div className=" p-4 rounded-lg border border-[#D4D4D4]">
          <h3 className="text-lg font-semibold text-[#000000] mb-3 text-center">
            User page listings
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-black pb-2">
                  SALE
                </th>
                <th className="text-right text-sm font-medium text-black pb-2">
                  RENT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left text-lg font-semibold text-black pt-2">
                  Unlimited
                </td>
                <td className="text-right text-lg font-semibold text-black pt-2">
                  Unlimited
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Second card */}
        <div className=" p-4 rounded-lg border border-[#D4D4D4]">
          <h3 className="text-lg font-semibold text-[#000000] mb-3 text-center">
            Premium
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-black pb-2">
                  SALE
                </th>
                <th className="text-right text-sm font-medium text-black pb-2">
                  RENT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left text-lg font-semibold text-black pt-2">
                  25 of 40
                </td>
                <td className="text-right text-lg font-semibold text-black pt-2">
                  4 of 40
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 3rd card */}
        {/* Secret Property */}
        <div className=" p-4 rounded-lg border border-[#D4D4D4]">
          <h3 className="text-lg font-semibold text-[#000000] mb-3 text-center">
            Secret Property
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {/* <th className="text-left text-sm font-medium text-black pb-2">
                  SALE
                </th>
                <th className="text-right text-sm font-medium text-black pb-2">
                  RENT
                </th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center text-lg font-semibold text-black pt-2">
                  0 of 1
                </td>
                {/* <td className="text-right text-lg font-semibold text-black pt-2">
                  Unlimited
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra visibility Section */}
      <div className="flex justify-between w-full gap-10">
        <div className=" w-[30%] p-5  border-t border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Extra visibility
          </h3>

          <div className="space-y-3">
            {/* Vetrina */}
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Vetrina</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm font-medium text-gray-900">3</span>
                <span className="text-sm text-gray-600">30/12/2025</span>
              </div>
            </div>

            {/* Star */}
            <div className="flex items-center justify-between py-2 ">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Star</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm text-gray-400">--</span>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Activate
                </button>
              </div>
            </div>

            {/* Top */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Top</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm text-gray-400">--</span>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Activate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        <div className=" md:w-[30%] my-8 p-4 rounded-lg items-center text-center border border-[#D4D4D4]">
          <h3 className="text-lg font-semibold text-[#000000] mb-3 text-center">
            Wallet
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className=" pb-2 text-lg font-normal text-[#000000] mb-3 text-center">
                  Available: €0.00
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <button className=" border px-4 mt-5 rounded-lg border-[#D4D4D4] py-2  text-lg font-semibold text-[#000000] mb-3 text-center">
                  Recharge
                </button>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
