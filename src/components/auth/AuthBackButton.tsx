"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthBackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      title="Back"
      className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0F2E4A] shadow-sm transition-colors hover:border-[#00B2D6] hover:text-[#00B2D6]"
    >
      <ArrowLeft size={17} />
    </button>
  );
}
