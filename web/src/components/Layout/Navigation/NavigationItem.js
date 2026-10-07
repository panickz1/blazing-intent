"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import IconComponent from "@/helpers/functions/getIcon";
import isActivePath from "@/helpers/functions/isActivePath";

const subscribeToNothing = () => () => {};

const useIsHydrated = () => useSyncExternalStore(subscribeToNothing, () => true, () => false);

export function ActiveNavigationItem(props) {
  const pathname = usePathname();
  const isHydrated = useIsHydrated();
  return <NavigationItem {...props} isActive={isHydrated && isActivePath(pathname, props.url)} />;
}

export default function NavigationItem({ anchor, url, icon, target, rel, handleLinkClick, showIcon = true, isActive = false }) {
  return (
    <li className="group relative">
      <Link
        className={`relative flex w-full items-center gap-2 rounded-lg px-4 py-3 font-heading text-[15px] transition-colors lg:py-2 ${
          isActive ? "font-black text-white" : "font-semibold text-fg-muted transition-all duration-200 hover:bg-grey-800/75 hover:text-white"
        }`}
        onClick={handleLinkClick}
        href={url}
        target={target === "_BLANK" ? "_blank" : "_self"}
        rel={rel}
        data-active={isActive}
      >
        {showIcon && icon && (
          <IconComponent
            iconName={icon}
            className={`!text-[17px] transition-colors ${isActive ? "text-primary" : "text-fg-muted group-hover:text-white"}`}
          />
        )}
        <span>{anchor}</span>
        {isActive && <span aria-hidden className="absolute inset-x-3 -bottom-1 hidden h-[2px] rounded-full bg-primary lg:block" />}
      </Link>
    </li>
  );
}
