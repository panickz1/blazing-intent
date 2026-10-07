import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Suspense } from "react";
import NavigationItem, { ActiveNavigationItem } from "./NavigationItem";
import ThemeToggle from "./ThemeToggle";
import { site, isExternalUrl } from "@/site.config";

export default function Navigation({ options, mainMenu, handleLinkClick }) {
  const ctaExternal = isExternalUrl(site.cta.url);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Logo options={options} onClick={handleLinkClick} />
        <ThemeToggle />
      </div>
      <nav aria-label="Main">
        <menu className="flex flex-col gap-2">
          <Suspense fallback={mainMenu?.map((item, index) => <NavigationItem key={index} {...item} />)}>
            {mainMenu?.map((item, index) => (
              <ActiveNavigationItem key={index} {...item} handleLinkClick={handleLinkClick} />
            ))}
          </Suspense>
        </menu>
      </nav>
      <Link
        href={site.cta.url}
        target={ctaExternal ? "_blank" : undefined}
        rel={ctaExternal ? "noopener noreferrer" : undefined}
        onClick={handleLinkClick}
        className="flex h-12 w-full items-center justify-center rounded-full bg-primary font-heading text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {site.cta.label}
      </Link>
      {site.community.url && (
        <a
          href={site.community.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="flex h-12 w-full items-center justify-center rounded-full border border-grey-700 text-[15px] font-medium text-white"
        >
          {site.community.label}
        </a>
      )}
    </div>
  );
}
