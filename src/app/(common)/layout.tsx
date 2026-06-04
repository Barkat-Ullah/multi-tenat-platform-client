import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
// import AiToggleButton from "@/components/ui/AiToggleButton/AiToggleButton";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { HeroUiProvider } from "@/lib/providers/HeroUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "IRendity - A Real Estate Company",
  description: " A Real Estate Company, Providing you with the best properties in the world. We are a team of professionals who are passionate about helping you find the perfect property for your needs.",
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
