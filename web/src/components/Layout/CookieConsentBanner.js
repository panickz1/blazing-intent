"use client";

import { CookieConsent } from "@/components/Blocks/cookie-consent";
import { disableAnalytics } from "@/lib/analytics";

export default function CookieConsentBanner() {
  return (
    <CookieConsent variant="mini" onDeclineCallback={disableAnalytics} />
  );
}
