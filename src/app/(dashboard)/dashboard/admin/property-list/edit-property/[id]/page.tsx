"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { appAlert } from "@/utils/appAlert";


import {
  OptionalInvestmentHandle,
} from "@/components/AgentDashboard/OptionalInvestment";
import EditBasicPropertyInfo from "@/components/AgentDashboard/Edit-Basic-Property-info";
import EditLeaseInfo from "@/components/AgentDashboard/EditLEaseInfo";
import EditFinancialInfo from "@/components/AgentDashboard/EditFinancialInfo";
import EditCompliance from "@/components/AgentDashboard/EditComplince";
import EditReservedProperty from "@/components/AgentDashboard/EditReservedProperty";
import EditOptionalInvestment from "@/components/AgentDashboard/EditOptionInvestment";
import { useGetSinglePropertyDetailsQuery } from "@/redux/service/agent/propertiesApi";



export default function EditHome() {
const propertyId = useParams().id as string;

  console.log(propertyId, "propertyId");
  

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const optionalRef = useRef<OptionalInvestmentHandle | null>(null);

  // ✅ LOAD PROPERTY DATA ONCE INTO REDUX
  const { data: propertyData, isLoading: propertyLoading } = useGetSinglePropertyDetailsQuery(propertyId, {
    skip: !propertyId,
  });


  console.log(propertyData, "propertyData");
  


  const steps = [
    { id: 1, label: "01", title: "Edit Basic Property Info" },
    { id: 2, label: "02", title: "Edit Lease & Tenant Info" },
    { id: 3, label: "03", title: "Edit Additional Details" },
    { id: 4, label: "04", title: "Edit Documentation" },
    { id: 5, label: "05", title: "Edit Review" },
    { id: 6, label: "06", title: "Edit Approval" },
  ];

  const isLastStep = currentStep === steps.length - 1;

  const renderContent = () => {
    // ✅ SHOW LOADING FIRST
    if (propertyLoading) {
      return (
        <div className="text-center py-12">
          <div className="text-xl font-semibold text-gray-600">Loading property data...</div>
          <p className="text-sm text-gray-500 mt-2">Property ID: {propertyId}</p>
        </div>
      );
    }

    switch (currentStep) {
      case 0:
        return <EditBasicPropertyInfo propertyData={propertyData} />;
      case 1:
        return <EditLeaseInfo propertyData={propertyData} />;
      case 2:
        return <EditFinancialInfo propertyData={propertyData} />;
      case 3:
        return <EditCompliance propertyData={propertyData} />;
      case 4:
        return <EditReservedProperty propertyData={propertyData} />;
      case 5:
        return <EditOptionalInvestment propertyData={propertyData} ref={optionalRef} />;
      default:
        return null;
    }
  };

  const handleFinalSubmit = async () => {
    const ok = await optionalRef.current?.submit();

    if (ok) {
      await appAlert.fire({
        title: "Success!",
        text: "Property updated successfully!", // ✅ Changed from "created"
        icon: "success",
        confirmButtonText: "OK",
      });
      router.push("/dashboard/admin/all-properties");
    } else {
      appAlert.fire({
        title: "Error!",
        text: "Failed to submit Optional Investment data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const isSubmitting = optionalRef.current?.isSubmitting ?? false;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto rounded-lg shadow-lg p-8 max-w-6xl">
        {/* ✅ PROPERTY HEADER */}
        {propertyData?.data && (
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-[#223355]">
                  Editing: {propertyData.data.title}
                </h1>
                <p className="text-sm text-gray-600">ID: {propertyId}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {propertyData.data.status}
              </span>
            </div>
          </div>
        )}

        {/* Step Counter */}
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-[#171B26]">
            Step 0{currentStep + 1} Out of 0{steps.length}
          </p>
        </div>

        {/* Step Indicators - UNCHANGED */}
        <div className="flex justify-center items-center gap-6 mb-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center">
              {index > 0 && (
                <div
                  className={`absolute left-[-32px] top-1/2 w-[64px] h-0.5 transform -translate-y-1/2 ${
                    index <= currentStep ? "bg-[#D2B48C]" : "bg-[#D4D4D4]"
                  }`}
                  style={{ pointerEvents: "none" }}
                />
              )}
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-200 z-10 ${
                  index === currentStep
                    ? "bg-[#D2B48C] text-white text-lg hover:bg-[#D2B48C]"
                    : index < currentStep
                    ? "bg-[#D2B48C] text-white"
                    : "bg-[#D4D4D4] text-[#2B2B2B] hover:bg-gray-400"
                }`}
              >
                {step.label}
              </button>
            </div>
          ))}
        </div>

        {/* Content */}
        <div>{renderContent()}</div>

        {/* Navigation Buttons - UNCHANGED */}
        <div className="flex justify-end gap-4 items-center mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0 || isSubmitting}
            className="px-6 py-4 flex items-center gap-2 justify-center text-[#223355] border-[#223355] border-2 bg-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.96032 5.66625L8.58099 7.28625L7.87433 7.99358L5.75299 5.87291L5.28166 5.40158C5.21917 5.33907 5.18406 5.2543 5.18406 5.16591C5.18406 5.07753 5.21917 4.99276 5.28166 4.93025L7.87433 2.33691L8.58099 3.04425L6.95899 4.66625H10.0003C11.0612 4.66625 12.0786 5.08767 12.8288 5.83782C13.5789 6.58797 14.0003 7.60538 14.0003 8.66625C14.0003 9.72711 13.5789 10.7445 12.8288 11.4947C12.0786 12.2448 11.0612 12.6662 10.0003 12.6662H2.66699V11.6662H10.0003C10.796 11.6662 11.559 11.3502 12.1216 10.7876C12.6843 10.225 13.0003 9.4619 13.0003 8.66625C13.0003 7.8706 12.6843 7.10754 12.1216 6.54493C11.559 5.98232 10.796 5.66625 10.0003 5.66625H6.96032Z" fill="#2B2B2B" />
            </svg>
            Previous
          </button>

          {!isLastStep ? (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={isSubmitting}
              className="px-6 py-4 flex items-center gap-2 justify-center bg-[#223355] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                {/* SVG unchanged */}
              </svg>
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-4 flex items-center gap-2 justify-center bg-[#223355] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
