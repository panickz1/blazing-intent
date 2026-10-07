"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import Logo from "@/components/ui/Logo";
import Navigation from "./Navigation";
import NavigationItem, { ActiveNavigationItem } from "./NavigationItem";
import ThemeToggle from "./ThemeToggle";
import { CommunityIcon } from "@/components/ui/SocialIcons";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from "@/components/ui/drawer";
import { site, isExternalUrl } from "@/site.config";

export default function NavigationBar({ options, mainMenu }) {
  const t = useTranslations("nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLinkClick = () => setIsMenuOpen(false);
  const ctaExternal = isExternalUrl(site.cta.url);

  return (
    <nav className="sticky top-0 z-30 border-b border-grey-800 bg-grey-950/75 py-4 backdrop-blur-xl">
      <div className="relative flex items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Logo onClick={handleLinkClick} options={options} />

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          <menu className="flex flex-row items-center gap-1">
            <Suspense fallback={mainMenu?.map((item, index) => <NavigationItem key={index} {...item} showIcon={false} />)}>
              {mainMenu?.map((item, index) => (
                <ActiveNavigationItem key={index} {...item} showIcon={false} handleLinkClick={handleLinkClick} />
              ))}
            </Suspense>
          </menu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle className="hidden sm:grid" />
          {site.community.url && (
            <a
              href={site.community.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center gap-2 rounded-full border border-grey-700 px-4 text-[14px] font-medium text-white transition-colors hover:bg-grey-800 sm:flex"
            >
              <CommunityIcon url={site.community.url} className="size-4" />
              {site.community.label}
            </a>
          )}
          <Link
            href={site.cta.url}
            target={ctaExternal ? "_blank" : undefined}
            rel={ctaExternal ? "noopener noreferrer" : undefined}
            onClick={handleLinkClick}
            className="flex h-10 items-center whitespace-nowrap rounded-full bg-primary px-4 font-heading sm:px-5 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {site.cta.label}
          </Link>

          <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DrawerTrigger asChild>
              <button aria-label={t("openMenu")} className="-mr-1 p-2 text-white/90 transition-colors hover:text-white lg:hidden">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </DrawerTrigger>
            <DrawerContent className="px-6 pb-10 lg:hidden">
              <DrawerTitle className="sr-only">{t("menu")}</DrawerTitle>
              <div className="flex flex-col gap-8 pt-2">
                <Navigation options={options} mainMenu={mainMenu} handleLinkClick={handleLinkClick} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
