/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import { useGetSubscriptionPlansQuery } from "@/redux/service/admin/subscriptionPlan";
import Spinner from "@/components/ui/Spinner";
import { useCheckoutSessionMutation } from "@/redux/service/admin/subscription";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { appAlert } from "@/utils/appAlert";


type Duration = "QUARTER" | "SEMI_ANNUAL" | "ANNUAL";

interface ApiSubscriptionPlan {
  id: string;
  plan: "THREE_MONTH" | "SIX_MONTH" | "ONE_YEAR"; // internal code
  planName: Duration; // e.g., "QUARTER"
  name: string; // e.g., "Pro", "Pro Plus", "Elite"
  description: string;
  features: string[];
  price: number;
  status: "ACTIVE" | "INACTIVE";
}



// Map duration code to display title
const getDurationTitle = (planName: Duration): string => {
  switch (planName) {
    case "QUARTER": return "Quarterly";
    case "SEMI_ANNUAL": return "Semi-Annual";
    case "ANNUAL": return "Annual";
    default: return planName;
  }
};

export default function SubscriptionManagement() {
  const { data, isLoading } = useGetSubscriptionPlansQuery();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Simply use all active plans from the API
  const currentPlans = useMemo(() => {
    return (data?.data || []) as ApiSubscriptionPlan[];
  }, [data]);

  const [createCheckoutSession, { isLoading: isCheckoutLoading }] =
    useCheckoutSessionMutation();

  const handleBuyPlan = async (planId: string) => {
    if (!accessToken) {
      appAlert.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to purchase a subscription plan.',
        showCancelButton: true,
        confirmButtonText: 'Login Now',
        confirmButtonColor: '#004E60',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    try {
      const res = await createCheckoutSession({ subscriptionPlanId: planId }).unwrap();

      const checkoutUrl = res?.data?.url;
      if (!checkoutUrl) throw new Error("Checkout URL missing from response");

      // Redirect user to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (e: any) {
      console.error("Checkout error:", e);
      appAlert.fire({
        icon: 'error',
        title: 'Error',
        text: e?.data?.message || e?.message || "Failed to create checkout session",
      });
    }
  };

  if (isLoading || isCheckoutLoading) {
    return (
      <Spinner></Spinner>
    );
  }

  if (currentPlans.length === 0) {
    return (
      <div className="bg-[#F8F8F6] py-10 md:py-14">
        <div className="container mx-auto px-4 text-center text-red-500">
          No subscription plans.
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#F8F8F6] py-10 md:py-14">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Subscription Management</h2>




        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {currentPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`flex flex-col rounded-lg overflow-hidden transition-transform shadow-md hover:shadow-xl ${index === 1 ? "bg-[#004E60] text-white shadow-lg" : "bg-white text-gray-900"
                }`}
            >
              {/* Card Header */}
              <div className={`px-6 pt-6 ${index === 1 ? "bg-[#004E60]" : "bg-white border-gray-200"}`}>
                <h3 className="font-semibold text-2xl">{getDurationTitle(plan.planName)}</h3>
              </div>

              {/* Price */}
              <div className="px-6 pt-2 pb-5">
                <div className="text-3xl font-bold mb-2">
                  {plan.price} <span className="text-lg font-normal">Euro</span>
                </div>
              </div>

              {/* Features */}
              <div className={`px-6 pb-5 space-y-4 ${index === 1 ? "divide-white/20" : "divide-gray-200"}`}>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex gap-3 border-b pb-3 border-[#E7F6F6]">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${index === 1 ? "text-white" : "text-teal-800"}`} />
                    <span className={`text-sm ${index === 1 ? "text-white" : "text-gray-700"}`}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="px-6 pb-5 mt-auto">
                {/* <button
                  className={`w-full font-inter font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md mx-auto block mb-4 ${index === 1 ? "bg-white text-teal-800 hover:bg-gray-100" : "bg-[#004E60] text-white hover:bg-teal-900"
                    }`}
                >
                  Buy Plan
                </button> */}


                <button
                  onClick={() => handleBuyPlan(plan.id)}
                  disabled={isCheckoutLoading}
                  className={`w-full font-inter font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md mx-auto block mb-4
    ${index === 1 ? "bg-white text-teal-800 hover:bg-gray-100" : "bg-[#004E60] text-white hover:bg-teal-900"}
    ${isCheckoutLoading ? "opacity-60 cursor-not-allowed" : ""}
  `}
                >
                  {isCheckoutLoading ? "Redirecting..." : "Buy Plan"}
                </button>




              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
