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

  catalog: {
    minCasinosToIndex: 3,
    emptyLabel: "No casinos listed yet.",
    moreLabel: "More {label}",
    sections: {
      payments: { collection: "paymentMethods", field: "paymentMethods", enabled: true, label: "Payment methods", title: "Casinos that accept {name}", eyebrow: "Payment method" },
      providers: { collection: "providers", field: "providers", enabled: true, label: "Game providers", title: "Casinos with {name} games", eyebrow: "Game provider" },
      games: { collection: "games", field: "games", enabled: true, label: "Games", title: "Best online casinos for {name}", eyebrow: "Games" },
      sports: { collection: "sports", field: "sports", enabled: true, label: "Sports", title: "Betting sites for {name}", eyebrow: "Sports betting" },
      licences: { collection: "licences", field: "licences", enabled: true, label: "Licences", title: "Casinos licensed by {name}", eyebrow: "Regulator" },
      bonuses: { collection: "bonusTypes", enabled: true, label: "Bonus types", title: "{name} offers", eyebrow: "Bonuses" },
      support: { collection: "support", field: "support", enabled: false, label: "Support", title: "Casinos with {name} support", eyebrow: "Customer support" },
      regions: { collection: "regions", field: "regions", enabled: false, label: "Regions", title: "Online casinos in {name}", eyebrow: "Region" },
      languages: { collection: "languages", field: "languages", enabled: false, label: "Languages", title: "Casinos in {name}", eyebrow: "Language" },
      operators: { collection: "organizations", field: "organization", single: true, enabled: false, label: "Operator", title: "Casinos run by {name}", eyebrow: "Operator" },
    },
  },

  bonuses: {
    columns: { casino: "Casino", wagering: "Wagering", deposit: "Min. deposit", bonus: "Bonus" },
    howToClaim: "How to claim",
    info: "General information",
    code: "Code",
    freeSpins: "Free spins",
    maxWin: "Max win",
    minOdds: "Min. odds",
    validUntil: "Valid until",
    none: "None",
    searchLabel: "Search bonuses",
    searchPlaceholder: "Search casinos",
    empty: "No bonuses match your search.",
    showAllLabel: "Show all {count} bonuses",
    detailsLabel: "Details",
    allHeading: "All {name} bonuses",
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
