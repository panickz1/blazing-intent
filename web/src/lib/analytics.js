import { site } from "@/site.config";

export const GA_MEASUREMENT_ID = site.analytics.gaMeasurementId;

function consentDeclined() {
  try {
    return /(?:^|;\s*)cookieConsent=false(?:;|$)/.test(document.cookie);
  } catch {
    return true;
  }
}

function onProductionHost() {
  const hosts = site.analytics.productionHosts;
  return hosts.length === 0 || hosts.includes(window.location.hostname);
}

export function analyticsAllowed() {
  return Boolean(GA_MEASUREMENT_ID) && onProductionHost() && !consentDeclined();
}

export function disableAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
