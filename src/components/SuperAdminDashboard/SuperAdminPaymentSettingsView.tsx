"use client";

import React from "react";
import { CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  type PaymentMethodType,
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
} from "@/redux/service/admin/paymentMethodsApi";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== "object" || error === null) return fallback;
  const apiError = error as {
    data?: { message?: string };
    error?: string;
    message?: string;
  };

  return apiError.data?.message || apiError.error || apiError.message || fallback;
};

const PaymentMethodSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 2 }, (_, index) => (
      <div
        key={index}
        className="flex animate-pulse flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] sm:flex-row sm:items-center sm:p-8"
      >
        <div className="space-y-4">
          <div className="h-7 w-24 rounded-full bg-slate-200" />
          <div className="h-4 w-28 rounded-full bg-slate-100" />
        </div>
        <div className="space-y-3 sm:text-right">
          <div className="h-9 w-24 rounded-xl bg-slate-200" />
          <div className="h-3 w-20 rounded-full bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

const MethodLogo = ({ type }: { type: string }) => {
  if (type.toLowerCase() === "paypal") {
    return (
      <div className="flex items-center gap-1 font-poppins text-lg font-extrabold italic tracking-tight sm:text-xl">
        <span className="text-[#003087]">Pay</span>
        <span className="text-[#0079C1]">Pal</span>
      </div>
    );
  }

  return (
    <span className="font-poppins text-2xl font-extrabold lowercase tracking-tight text-[#635BFF]">
      stripe
    </span>
  );
};

const PaymentMethodCard = ({
  method,
  isUpdating,
  onToggle,
}: {
  method: PaymentMethodType;
  isUpdating: boolean;
  onToggle: (method: PaymentMethodType) => void;
}) => {
  const isActive = method.isActive;

  return (
    <div className="flex min-h-[120px] flex-col justify-between gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center sm:p-8">
      <div className="flex min-w-0 flex-col items-start gap-3.5">
        <MethodLogo type={method.type} />

        {isActive ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981] sm:text-sm">
            <CheckCircle size={15} className="stroke-[3]" />
            <span>Connected</span>
          </div>
        ) : (
          <span className="inline-block text-xs font-bold text-slate-400 sm:text-sm">
            Not connected
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center sm:justify-end">
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onToggle(method)}
          className={`inline-flex min-w-[120px] items-center justify-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
            isActive
              ? "border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600"
              : "bg-[#00B2D6] text-white hover:bg-[#009cb9]"
          }`}
        >
          {isUpdating && <Loader2 size={13} className="animate-spin" />}
          {isActive ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
};

export default function SuperAdminPaymentSettingsView() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPaymentMethodsQuery();
  const [updatePaymentMethod, { isLoading: isUpdating }] =
    useUpdatePaymentMethodMutation();

  const methods = data?.data || [];
  const connectedMethods = methods.filter((method) => method.isActive);
  const isBusy = isLoading || isFetching;

  const getConnectionBadgeText = () => {
    if (connectedMethods.length === 0) return "No Processors Connected";
    return `Connected to ${connectedMethods.map((method) => method.type).join(" + ")}`;
  };

  const handleToggleMethod = async (method: PaymentMethodType) => {
    try {
      const response = await updatePaymentMethod(method.id).unwrap();
      toast.success(
        response.message ||
          `${method.type} ${method.isActive ? "disconnected" : "connected"} successfully.`,
      );
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to update ${method.type}.`));
    }
  };

  return (
    <div className="w-full space-y-8 p-4 md:p-6 lg:p-8">
      <h1 className="font-poppins text-2xl font-extrabold tracking-tight text-[#0F2E4A] sm:text-3xl">
        Payment Settings
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <h2 className="font-poppins text-base font-bold text-[#0F2E4A] sm:text-lg">
          Payment Processors
        </h2>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-poppins text-xs font-bold transition-all ${
            connectedMethods.length > 0
              ? "border-[#10B981]/20 bg-[#E8F8F5] text-[#10B981]"
              : "border-slate-200 bg-slate-50 text-slate-400"
          }`}
        >
          {connectedMethods.length > 0 && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10B981]" />
          )}
          {getConnectionBadgeText()}
        </span>
      </div>

      {isBusy ? (
        <PaymentMethodSkeleton />
      ) : isError ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-3xl border border-red-100 bg-white p-8 text-center">
          <p className="text-sm font-bold text-red-500">
            Failed to load payment methods.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#009cb9]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      ) : methods.length === 0 ? (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-400">
          No payment methods found.
        </div>
      ) : (
        <div className="space-y-6">
          {methods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              isUpdating={isUpdating}
              onToggle={handleToggleMethod}
            />
          ))}
        </div>
      )}
    </div>
  );
}
