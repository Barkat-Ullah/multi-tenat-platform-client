"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw, Sparkles } from "lucide-react";
import { useGetPrivacyPoliciesQuery } from "@/redux/service/privacy/privacyApi";

export default function PrivacyPolicyClient() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPrivacyPoliciesQuery();

  const policy = data || null;
  const isBusy = (isLoading || isFetching) && !data;

  return (
    <div className="min-h-screen bg-[#FCFDFE] poppins">
      <section className="border-b border-slate-100 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1 text-[13px] font-bold tracking-wide text-[#1F2937] sm:text-[14px]"
          >
            <Link
              href="/"
              className="font-extrabold text-[#1F2937] transition-colors hover:text-[#00B2D6]"
            >
              Home
            </Link>
            <span className="mx-1 select-none opacity-80">&raquo;</span>
            <span className="font-extrabold opacity-90">Privacy Policy</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
                <div className="h-[1.5px] w-8 bg-gradient-to-r from-[#00B2D6] to-[#00B2D6]/20 sm:w-16" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00B2D6] sm:text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Compliance Medicals</span>
              </div>
              <div className="flex items-center">
                <div className="h-[1.5px] w-8 bg-gradient-to-l from-[#00B2D6] to-[#00B2D6]/20 sm:w-16" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#00B2D6]" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F2E4A] sm:text-4xl lg:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-[#55697A] sm:text-base">
              Find out how we collect, use, and store your personal information.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        {isBusy ? (
          <div
            className="space-y-4 rounded-3xl border border-slate-200/60 bg-white p-8 md:p-12"
            role="status"
            aria-label="Loading Privacy Policy"
          >
            <div className="h-6 w-64 animate-pulse rounded-full bg-slate-200" />
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className={`h-3 animate-pulse rounded-full bg-slate-100 ${
                  index % 4 === 0 ? "w-3/4" : "w-full"
                }`}
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-100 bg-white p-12 text-center">
            <p className="text-sm font-semibold text-red-500">
              Failed to load the Privacy Policy.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#00B2D6] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#009cb9]"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        ) : policy?.text ? (
          <article
            className="public-privacy-content rounded-3xl border border-slate-200/60 bg-white p-6 text-sm font-medium leading-relaxed text-[#55697A] shadow-[0_4px_30px_rgba(15,46,74,0.01)] sm:p-8 md:p-12 md:text-base"
            dangerouslySetInnerHTML={{ __html: policy.text }}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500">
            The Privacy Policy is not available yet.
          </div>
        )}
      </section>

      <style jsx global>{`
        .public-privacy-content h1,
        .public-privacy-content h2,
        .public-privacy-content h3 {
          margin: 1.75rem 0 0.75rem;
          color: #0f2e4a;
          font-weight: 800;
          line-height: 1.3;
        }
        .public-privacy-content h2 {
          font-size: 1.25rem;
        }
        .public-privacy-content p {
          margin: 0.75rem 0;
        }
        .public-privacy-content ul,
        .public-privacy-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .public-privacy-content ul {
          list-style: disc;
        }
        .public-privacy-content ol {
          list-style: decimal;
        }
        .public-privacy-content li {
          margin: 0.4rem 0;
        }
      `}</style>
    </div>
  );
}
