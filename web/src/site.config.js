const env = (value, fallback) => (typeof value === "string" && value.trim() !== "" ? value.trim() : fallback);

const name = env(process.env.NEXT_PUBLIC_BRAND_NAME, "Acme Casinos");

export const site = {
  name,
  tagline: "Licensed online casinos, tested and ranked.",
  description: "Independent reviews and rankings of licensed online casinos: bonuses, payouts, games and support compared.",
  locale: env(process.env.NEXT_PUBLIC_SITE_LANGUAGE, "en"),
  url: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  twitter: "",
  themeColor: "#29BB5E",

  theme: {
    default: "dark",
    switcher: true,
    toggleLabel: "Switch colour theme",
  },
  backgroundColor: "#0A0F17",

  cta: {
    label: "Top casinos",
    url: env(process.env.NEXT_PUBLIC_CTA_URL, "/casinos"),
  },

  compliance: {
    topBar: "18+ | Play responsibly | This site contains affiliate links",
    defaultTerms: "18+ | New customers only | T&Cs apply",
    ageBadge: "18+",
  },

  affiliate: {
    reviewPath: "/review",
    goPath: "/go",
    visitLabel: "Visit",
    reviewLabel: "Review",
    claimLabel: "Claim bonus",
    paymentMethodsLabel: "Payment methods",
    bonusLabel: "Welcome bonus",
    listHeading: "Best online casinos ranked",
    showAllLabel: "Show all {count} casinos",
    sortLabel: "Sort by",
    sortOptions: { recommended: "Recommended", new: "Newest", bonus: "Bonus" },
  },

  community: {
    label: "Join the community",
    url: env(process.env.NEXT_PUBLIC_COMMUNITY_URL, ""),
  },

  contact: {
    email: "hello@example.com",
    replyTime: "We usually reply within one business day.",
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
    legalLinks: [
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
  },

  analytics: {
    gaMeasurementId: env(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, ""),
    productionHosts: env(process.env.NEXT_PUBLIC_PRODUCTION_HOSTS, "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean),
  },

  leadForm: {
    path: "/contact",
    title: "Talk to us",
    description: "Tell us a little about you and we'll get back to you by email.",
    submitLabel: "Send",
    successTitle: "Thanks, we got it.",
    successDescription: "We read every message and reply by email, usually within one business day.",
  },

  attribution: {
    storageKey: "site.attribution",
    forwardParams: [
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "gclid", "gbraid", "wbraid", "fbclid", "ttclid", "msclkid", "twclid"],
      ["ref", "referral_code"],
    ],
  },
};

export const isExternalUrl = (href) => /^(https?:)?\/\//i.test(href || "") || /^(mailto|tel):/i.test(href || "");
