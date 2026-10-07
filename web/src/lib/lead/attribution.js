import { site } from "@/site.config";

const STORAGE_KEY = `${site.attribution.storageKey}.lead`;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function readStored() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return {};

  const existing = readStored();
  if (existing) return existing;

  const params = new URLSearchParams(window.location.search);
  const attribution = { captured_at: new Date().toISOString() };

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) attribution[key] = value;
  }

  const ref = params.get("ref") ?? params.get("r");
  if (ref) attribution.ref = ref;

  if (document.referrer) {
    try {
      attribution.referrer = new URL(document.referrer).host;
    } catch {}
  }

  attribution.landing_page = window.location.pathname + window.location.search;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {}
  return attribution;
}

export function describeAttribution(a) {
  if (a.ref) return `ref: ${a.ref}`;
  if (a.utm_source) return [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  if (a.referrer) return a.referrer;
  return "direct";
}
