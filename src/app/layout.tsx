import ScrollToTopButton from "@/components/ui/ScrollToTopButton/ScrollToTopButton";
import { HeroUiProvider } from "@/lib/providers/HeroUIProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import type { Metadata } from "next";
import { Inter, Poppins, Ribeye_Marrow } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const ribeyeMarrow = Ribeye_Marrow({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ribeye-marrow",
});

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
    <html lang="en">
      <head></head>
      <body
        suppressHydrationWarning={true}
        className={`${poppins.variable} ${inter.variable} ${ribeyeMarrow.variable} antialiased !bg-white`}
      >
        <HeroUiProvider>
          <ReduxProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#0BA8CC",
                  colorInfo: "#0BA8CC",
                  colorSuccess: "#3ECF8E",
                  colorWarning: "#FAAD14",
                  colorError: "#FF6B6B",

                  colorTextBase: "#1F1F1F",
                  colorBgBase: "#FFFFFF",
                  borderRadius: 8,
                  fontSize: 15,
                  lineHeight: 1.6,
                  controlHeight: 40,
                },
                components: {
                  Button: {
                    colorPrimary: "#0BA8CC",
                    colorPrimaryHover: "#0aa0bd",
                    colorPrimaryActive: "#088aa3",

                    colorSuccess: "#3ECF8E",
                    colorSuccessHover: "#36b87d",
                    colorSuccessActive: "#2fa36e",

                    colorWarning: "#FAAD14",
                    colorWarningHover: "#e89c0f",
                    colorWarningActive: "#c27e0d",

                    colorError: "#FF6B6B",
                    colorErrorHover: "#e95e5e",
                    colorErrorActive: "#c94d4d", 
                  },
                },
              }}
            >
              <>
                <div className="min-h-screen grid grid-rows-[auto_1fr_auto] text-title max-w-[100vw] overflow-hidden">
                  {children}
                </div>
                <ScrollToTopButton />
                <Toaster richColors position="top-right" />
              </>
            </ConfigProvider>
          </ReduxProvider>
        </HeroUiProvider>
      </body>
    </html>
  );
}
