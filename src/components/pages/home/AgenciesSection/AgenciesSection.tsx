import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import React from "react";

const AgenciesSection = () => {
  const items = [
    {
      title: "Targeted exposure",
      text: "Connect with investors specifically looking for income properties.",
    },
    {
      title: "Premium positioning",
      text: "Standalone marketplace for structured real estate investments.",
    },
    {
      title: "Investor-qualified audience",
      text: "Skip the noise and reach professional and institutional capital.",
    },
  ];

  return (
    <section className="overflow-hidden bg-[#0A2540] py-20 text-white md:py-32">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            For Agencies Specializing in <br className="hidden md:block" /> Income Assets
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-blue-100/80 md:text-xl">
            iRendity provides a vertical environment where leased properties are
            presented directly to yield-oriented investors.
          </p>

          <div className="grid grid-cols-1 gap-5 py-6 md:grid-cols-3 md:gap-6">
            {items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
              >
                <CheckCircle2 className="mx-auto mb-4 h-7 w-7 text-[#3BB273]" />
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-blue-100/60">{item.text}</p>
              </div>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-10 py-3.5 font-bold text-[#0A2540] shadow-xl transition-all duration-300 hover:bg-blue-50"
          >
            Become a Partner Agency
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgenciesSection;
