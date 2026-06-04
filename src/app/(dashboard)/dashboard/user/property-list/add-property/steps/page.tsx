/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BasicPropertyInfo, { BasicPropertyInfoHandle } from "@/components/AgentDashboard/Basic-property-info";
import LeaseInfo from "@/components/AgentDashboard/LeaseInfo";
import FinancialInfo from "@/components/AgentDashboard/Financial-info";
import Complince from "@/components/AgentDashboard/Complince&Documents.tsx";
import ReservedProperty from "@/components/AgentDashboard/ReservedProperty";
import OptionalInvestment, {
  OptionalInvestmentHandle,
} from "@/components/AgentDashboard/OptionalInvestment";

import { useEffect, useRef, useState } from "react";
import { appAlert } from "@/utils/appAlert";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Clear local storage when starting a new property listing
  useEffect(() => {
    const keysToRemove = [
      "createdPropertyId",
      "basicPropertyInfo",
      "financialInfo",
      "leaseInfo",
      "complianceInfo",
      "reservedPropertyInfo",
      "optionalInvestmentInfo"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);

  // Create refs for each step component
  const basicInfoRef = useRef<BasicPropertyInfoHandle | null>(null);
  const leaseInfoRef = useRef(null);
  const financialInfoRef = useRef(null);
  const complianceRef = useRef(null);
  const reservedPropertyRef = useRef(null);
  const optionalRef = useRef<OptionalInvestmentHandle | null>(null);

  const steps = [
    { id: 1, label: "01", title: "Basic Property Info" },
    { id: 2, label: "02", title: "Lease & Tenant Info" },
    { id: 3, label: "03", title: "Additional Details" },
    { id: 4, label: "04", title: "Documentation" },
    { id: 5, label: "05", title: "Review" },
    { id: 6, label: "06", title: "Approval" },
  ];

  const isLastStep = currentStep === steps.length - 1;

  const getCurrentStepRef = () => {
    switch (currentStep) {
      case 0:
        return basicInfoRef;
      case 1:
        return leaseInfoRef;
      case 2:
        return financialInfoRef;
      case 3:
        return complianceRef;
      case 4:
        return reservedPropertyRef;
      case 5:
        return optionalRef;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    const currentRef = getCurrentStepRef();

    if (currentRef?.current && 'submit' in currentRef.current) {
      setIsSubmitting(true);
      try {
        // Call the submit method of the current step
        const success = await (currentRef.current as any).submit();

        if (success) {
          // Move to next step
          setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
        }
        // If not successful, stay on current step (error handled by component)
      } catch (error) {
        console.error("Error submitting step:", error);
        appAlert.fire({
          title: "Error!",
          text: "Failed to save data. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // If component doesn't have submit method, just move to next step
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleFinalSubmit = async () => {
    const success = await optionalRef.current?.submit();

    if (success) {
      await toast.success("Property created successfully!")
      router.push("/dashboard/user/property-list");
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicPropertyInfo ref={basicInfoRef} />;
      case 1:
        return <LeaseInfo ref={leaseInfoRef} />;
      case 2:
        return <FinancialInfo ref={financialInfoRef} />;
      case 3:
        return <Complince ref={complianceRef} />;
      case 4:
        return <ReservedProperty ref={reservedPropertyRef} />;
      case 5:
        return <OptionalInvestment ref={optionalRef} />;
      default:
        return null;
    }
  };

  return (
    <div className=" px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto  rounded-lg shadow-lg p-8">
        {/* Step Counter */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-[#171B26]">
            Step 0{currentStep + 1} Out of 0{steps.length}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center items-center gap-6 mb-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center">
              {index > 0 && (
                <div
                  className={`absolute left-[-32px] top-1/2 w-[64px] h-0.5 transform -translate-y-1/2 ${index <= currentStep ? "bg-[#D2B48C]" : "bg-[#D4D4D4]"
                    }`}
                  style={{ pointerEvents: "none" }}
                />
              )}

              <button
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold transition-all duration-200 z-10 ${index === currentStep
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

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 items-center mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
            className="px-6 py-4 flex items-center gap-2 justify-center text-[#223355] border-[#223355] border-2 bg-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.96032 5.66625L8.58099 7.28625L7.87433 7.99358L5.75299 5.87291L5.28166 5.40158C5.21917 5.33907 5.18406 5.2543 5.18406 5.16591C5.18406 5.07753 5.21917 4.99276 5.28166 4.93025L7.87433 2.33691L8.58099 3.04425L6.95899 4.66625H10.0003C11.0612 4.66625 12.0786 5.08767 12.8288 5.83782C13.5789 6.58797 14.0003 7.60538 14.0003 8.66625C14.0003 9.72711 13.5789 10.7445 12.8288 11.4947C12.0786 12.2448 11.0612 12.6662 10.0003 12.6662H2.66699V11.6662H10.0003C10.796 11.6662 11.559 11.3502 12.1216 10.7876C12.6843 10.225 13.0003 9.4619 13.0003 8.66625C13.0003 7.8706 12.6843 7.10754 12.1216 6.54493C11.559 5.98232 10.796 5.66625 10.0003 5.66625H6.96032Z" fill="#2B2B2B" />
            </svg> Previous
          </button>

          {!isLastStep ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-4 flex items-center gap-2 justify-center bg-[#223355] text-white rounded-lg font-medium hover:bg-[#223355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Next"}
              {!isSubmitting && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_3335_17962)">
                    <path
                      d="M9.80467 3.75724L13.576 7.52857C13.701 7.65359 13.7712 7.82313 13.7712 7.9999C13.7712 8.17668 13.701 8.34622 13.576 8.47124L9.80467 12.2426C9.67893 12.364 9.51053 12.4312 9.33573 12.4297C9.16093 12.4282 8.99373 12.3581 8.87012 12.2344C8.74652 12.1108 8.6764 11.9436 8.67488 11.7688C8.67337 11.594 8.74056 11.4256 8.862 11.2999L11.4953 8.66657H2.66667C2.48986 8.66657 2.32029 8.59633 2.19526 8.47131C2.07024 8.34628 2 8.17671 2 7.9999C2 7.82309 2.07024 7.65352 2.19526 7.5285C2.32029 7.40347 2.48986 7.33324 2.66667 7.33324H11.4953L8.862 4.6999C8.79833 4.63841 8.74754 4.56484 8.7126 4.48351C8.67766 4.40217 8.65927 4.31469 8.6585 4.22617C8.65773 4.13765 8.6746 4.04986 8.70812 3.96793C8.74164 3.886 8.79114 3.81157 8.85374 3.74897C8.91633 3.68638 8.99077 3.63688 9.0727 3.60336C9.15463 3.56983 9.24241 3.55297 9.33093 3.55374C9.41945 3.55451 9.50693 3.5729 9.58827 3.60784C9.66961 3.64277 9.74317 3.69356 9.80467 3.75724Z"
                      fill="#F8F8F6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3335_17962">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-4 flex items-center gap-2 justify-center bg-[#223355] text-white rounded-lg font-medium hover:bg-[#223355] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}