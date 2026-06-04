import Link from "next/link";
import HeroSearchForm from "./HeroSearchForm";

const HeroSection = () => {
  return (
    <div
      className="relative poppins mb-32 flex min-h-[750px] items-center bg-cover bg-center transition-all duration-700 md:mb-28"
      style={{
        backgroundImage: "url('/images/hero-image.png')",
      }}
    >
      {/* Dynamic Overlay: Darker at bottom for search bar contrast, subtle at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

      <div className="container relative z-10 w-full px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#E2C59F] backdrop-blur-md border border-white/10">
            Premium Real Estate Marketplace
          </span>
          
          <h1 className="mb-6 max-w-5xl text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-7xl">
            Italy&apos;s Marketplace for <span className="text-[#E2C59F]">Income-Producing</span> Real Estate
          </h1>
          
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
            Acquire already leased properties with active contracts, defined duration,
            and measurable yield. Purpose-built for serious investors.
          </p>

          {/* Value Props - Horizontal Grid */}
          <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-12">
            {[
              "Exclusively income-generating",
              "Transparent lease structures",
              "Yield-focused ecosystem"
            ].map((prop, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-[#E2C59F]"></div>
                <span className="text-sm font-medium tracking-wide text-white/80 uppercase">{prop}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/all-property"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#004E60] px-10 py-4 font-inter font-bold text-white transition-all duration-300 hover:bg-[#003944] hover:shadow-[0_0_20px_rgba(0,78,96,0.4)]"
            >
              <span className="relative z-10">Explore Assets</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
            </Link>
            
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/5 px-10 py-4 font-inter font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              List as an Agency
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Floating Search Bar */}
      <div className="absolute bottom-0 left-1/2 w-full max-w-5xl -translate-x-1/2 translate-y-1/2 px-4">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default HeroSection;
