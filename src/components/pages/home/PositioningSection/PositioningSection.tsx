import React from 'react';

const PositioningSection = () => {
  return (
    <section className="py-12 md:py-16 bg-[#F8F9FA]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 max-w-3xl mx-auto">
          Not a real estate portal. <br className="hidden md:block" /> A vertical investment marketplace.
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl text-gray-700 leading-relaxed">
            Traditional portals list properties. <br />
            <span className="font-bold text-[#3BB273]">iRendity structures income.</span>
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every asset published on iRendity is already leased — enabling investors to evaluate opportunities based on cash flow, not assumptions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PositioningSection;
