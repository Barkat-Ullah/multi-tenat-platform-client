"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SuperAdminPaymentSettingsView() {
  const [stripeConnected, setStripeConnected] = useState(true);
  const [paypalConnected, setPaypalConnected] = useState(true);
  const [paypalNeedsUpdate, setPaypalNeedsUpdate] = useState(true);
  const [updatingPaypal, setUpdatingPaypal] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const handleDisconnectStripe = () => {
    setStripeConnected(false);
    toast.error("Stripe processor disconnected.");
  };

  const handleConnectStripe = () => {
    setStripeConnected(true);
    toast.success("Stripe processor connected successfully!");
  };

  const handleDisconnectPaypal = () => {
    setPaypalConnected(false);
    toast.error("PayPal processor disconnected.");
  };

  const handleConnectPaypal = () => {
    setPaypalConnected(true);
    toast.success("PayPal processor connected successfully!");
  };

  const handleUpdatePaypal = () => {
    setUpdatingPaypal(true);
    setTimeout(() => {
      setUpdatingPaypal(false);
      setPaypalNeedsUpdate(false);
      toast.success("PayPal processor updated to the latest version!");
    }, 1500);
  };

  const handleSaveSettings = () => {
    setSavingSettings(true);
    setTimeout(() => {
      setSavingSettings(false);
      toast.success("Payment processor configurations saved successfully!");
    }, 1000);
  };

  // Build the connection state badge text dynamically
  const getConnectionBadgeText = () => {
    if (stripeConnected && paypalConnected) {
      return "Connected to Stripe + PayPal";
    } else if (stripeConnected) {
      return "Connected to Stripe";
    } else if (paypalConnected) {
      return "Connected to PayPal";
    } else {
      return "No Processors Connected";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E4A] font-poppins tracking-tight">
          Payment Settings
        </h1>
      </div>

      {/* Subtitle / Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0F2E4A] font-poppins">
          Payment Processors
        </h2>
        
        {/* Dynamic Connected badge */}
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-poppins border transition-all ${
          stripeConnected || paypalConnected
            ? "bg-[#E8F8F5] text-[#10B981] border-[#10B981]/20"
            : "bg-slate-50 text-slate-400 border-slate-200"
        }`}>
          {(stripeConnected || paypalConnected) && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />}
          {getConnectionBadgeText()}
        </span>
      </div>

      {/* Processors List cards */}
      <div className="space-y-6">
        {/* Stripe Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          <div className="space-y-3.5">
            {/* Stripe Logo Text */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-[#635BFF] font-poppins tracking-tight lowercase">
                stripe
              </span>
            </div>
            
            {/* Status indicator */}
            {stripeConnected ? (
              <div className="flex items-center gap-1.5 text-[#10B981] font-bold text-xs sm:text-sm">
                <CheckCircle size={15} className="stroke-[3]" />
                <span>Connected</span>
              </div>
            ) : (
              <span className="inline-block text-slate-400 font-bold text-xs sm:text-sm">
                Not connected
              </span>
            )}
          </div>

          {/* Action triggers */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0">
            {stripeConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => toast.info("Opening Stripe connection manager...")}
                  className="px-6 py-2 border border-[#00B2D6] text-[#00B2D6] hover:bg-cyan-50/50 active:scale-[0.98] rounded-xl font-bold text-xs sm:text-sm transition-all outline-none bg-white cursor-pointer"
                >
                  Manage
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectStripe}
                  className="text-red-500 hover:text-red-600 font-bold text-xs sm:text-sm transition-all outline-none cursor-pointer border-none bg-transparent"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectStripe}
                className="px-6 py-2 bg-[#00B2D6] hover:bg-[#009cb9] text-white rounded-xl font-bold text-xs sm:text-sm active:scale-[0.98] transition-all outline-none cursor-pointer"
              >
                Connect Stripe
              </button>
            )}
          </div>
        </div>

        {/* PayPal Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
          <div className="space-y-4">
            {/* PayPal Logo Text */}
            <div className="flex items-center gap-1 font-extrabold italic text-lg sm:text-xl font-poppins tracking-tight">
              <span className="text-[#003087]">Pay</span>
              <span className="text-[#0079C1]">Pal</span>
            </div>

            {paypalConnected ? (
              <div className="space-y-4">
                {/* Warning details */}
                {paypalNeedsUpdate ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs sm:text-sm">
                      <AlertTriangle size={15} className="stroke-[2.5]" />
                      <span>Update available</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium max-w-[340px] leading-relaxed">
                      Update to the latest version for performance enhancements.
                    </p>
                    <button
                      type="button"
                      disabled={updatingPaypal}
                      onClick={handleUpdatePaypal}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 disabled:opacity-75"
                    >
                      {updatingPaypal && <Loader2 size={12} className="animate-spin" />}
                      <span>{updatingPaypal ? "Updating..." : "Update"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[#10B981] font-bold text-xs sm:text-sm">
                    <CheckCircle size={15} className="stroke-[3]" />
                    <span>Connected (Up to date)</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="inline-block text-slate-400 font-bold text-xs sm:text-sm">
                Not connected
              </span>
            )}
          </div>

          {/* Action triggers */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0">
            {paypalConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => toast.info("Opening PayPal configuration console...")}
                  className="px-6 py-2 border border-[#00B2D6] text-[#00B2D6] hover:bg-cyan-50/50 active:scale-[0.98] rounded-xl font-bold text-xs sm:text-sm transition-all outline-none bg-white cursor-pointer"
                >
                  Manage
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectPaypal}
                  className="text-red-500 hover:text-red-600 font-bold text-xs sm:text-sm transition-all outline-none cursor-pointer border-none bg-transparent"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectPaypal}
                className="px-6 py-2 bg-[#00B2D6] hover:bg-[#009cb9] text-white rounded-xl font-bold text-xs sm:text-sm active:scale-[0.98] transition-all outline-none cursor-pointer"
              >
                Connect PayPal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global save footer action */}
      <div className="pt-4 flex">
        <button
          type="button"
          disabled={savingSettings}
          onClick={handleSaveSettings}
          className="bg-[#00B2D6] hover:bg-[#009cb9] text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md shadow-cyan-100/50 cursor-pointer border-none outline-none active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
        >
          {savingSettings && <Loader2 size={14} className="animate-spin" />}
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
