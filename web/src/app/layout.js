import "./globals.css";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ThemeContextProvider from "@/context/ThemeContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getGeneralThemeData, getFooterData, getMenus } from "@/helpers/api";
import Schema from "@/helpers/SEO/Schema";
import getMenu from "@/helpers/functions/getMenu";
import { viewport as getViewport } from "./viewport";
import { metadata as getMetadata } from "./metadata";
import { sans, heading } from "./fonts";
import { site } from "@/site.config";
import NavigationBar from "@/components/Layout/Navigation/NavigationBar";
import ComplianceBar from "@/components/Layout/ComplianceBar";
import CookieConsentBanner from "@/components/Layout/CookieConsentBanner";
import LeadModal from "@/components/lead/LeadModal";
import NavigationProgress from "@/components/Layout/NavigationProgress";
import ScrollToTopOnNavigate from "@/components/Layout/ScrollToTopOnNavigate";
import AppLinkForwarder from "@/components/Layout/AppLinkForwarder";
import Analytics from "@/components/Layout/Analytics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpeedInsights } from "@vercel/speed-insights/next";

const Footer = dynamic(() => import("@/components/Layout/Footer"));

export const viewport = getViewport();
export const metadata = getMetadata();

export default async function RootLayout({ children }) {
  const [menus, footerData, messages, generalData] = await Promise.all([
    getMenus(),
    getFooterData(),
    getMessages(),
    getGeneralThemeData(),
  ]);
  const mainMenu = await getMenu(menus, "main-menu");

  return (
    <html lang={site.locale} suppressHydrationWarning className={`dark ${sans.variable} ${heading.variable}`}>
      <body className="h-screen overflow-hidden bg-background">
        <ThemeContextProvider attribute="data-theme" defaultTheme={site.theme.default} themes={["dark", "light"]} enableSystem={false} disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            <Schema type="global" />
            <ScrollArea className="h-screen w-full" viewportClassName="overflow-x-hidden">
              <ComplianceBar />
              <NavigationBar mainMenu={mainMenu?.entrys} options={generalData} />
              <main>
                {children}
                <Footer footerData={footerData} generalData={generalData} menus={menus} />
              </main>
            </ScrollArea>
            <CookieConsentBanner />
            <LeadModal />
            <Suspense fallback={null}>
              <NavigationProgress />
              <ScrollToTopOnNavigate />
            </Suspense>
            <AppLinkForwarder />
            <Analytics />
            <Suspense fallback={null}>
              <SpeedInsights />
            </Suspense>
          </NextIntlClientProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
