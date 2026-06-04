import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
// import AiToggleButton from "@/components/ui/AiToggleButton/AiToggleButton";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { HeroUiProvider } from "@/lib/providers/HeroUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Compliance Medicals - HGV, Bus, Taxi & Occupational Health Medicals",
  description:
    "Get professional, fast, and compliant medical examinations. Compliance Medicals provides HGV/Bus medicals, Taxi licensing medicals, and comprehensive Occupational Health services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <HeroUiProvider>
        <ReduxProvider>
          <>
            <div className="min-h-screen grid grid-rows-[auto_1fr_auto] max-w-[100vw] overflow-hidden">
              <div className="">
                <Navbar />
              </div>
              <div className="min-h-[80vh]">{children}   <Footer /></div>
            </div>
            <ScrollToTopButton />
            {/* <AiToggleButton /> */}
          </>
        </ReduxProvider>
      </HeroUiProvider>
    </div>
  );
}
