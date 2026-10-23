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

  breadcrumbs: { home: "Home", blog: "Guides", casinos: "Casinos", help: "Help Center" },

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
    pickLabel: "Our pick",
    paymentMethodsLabel: "Payment methods",
    bonusLabel: "Welcome bonus",
    listHeading: "Best online casinos ranked",
    showAllLabel: "Show all {count} casinos",
    sortLabel: "Sort by",
    sortOptions: { recommended: "Recommended", new: "Newest", bonus: "Bonus" },
  },

  review: {
    eyebrow: "Casino review",
    updated: "Updated {date}",
    since: "Since {year}",
    verdict: "Our verdict",
    grades: [
      { min: 4.5, label: "Excellent" },
      { min: 4, label: "Very good" },
      { min: 3.5, label: "Good" },
      { min: 0, label: "Fair" },
    ],
    scores: { scorePayouts: "Payouts", scoreSafety: "Safety", scoreBonus: "Bonus", scoreGames: "Games", scoreSupport: "Support", scoreMobile: "Mobile" },
    facts: { payout: "Payout speed", deposit: "Min. deposit", wagering: "Bonus wagering", games: "Games", live: "incl. live casino" },
    fast: "Fast",
    fastPayout: /instant|minute|same.day|under (1|2|6|12|24) hours?/i,
    payWith: "Pay with",
    more: "+{count} more",
    offer: "Welcome offer",
    moreOffers: "+{count} more offers",
    moreOffer: "+1 more offer",
    pros: "What we like",
    cons: "What could be better",
    prosCons: "Pros and cons",
    bonusesHeading: "{name} bonuses",
    paymentsNote: "Every method takes a {amount} minimum deposit.",
    withdrawals: "Withdrawals",
    specs: "At a glance",
    licenceNumber: "Licence no.",
    otherCasinos: "Other top casinos",
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

  games: {
    jurisdictions: env(process.env.NEXT_PUBLIC_GAME_JURISDICTIONS, "Portugal")
      .split(",")
      .map((j) => j.trim())
      .filter(Boolean),
    demo: {
      lang: env(process.env.NEXT_PUBLIC_DEMO_LANGUAGE, "en"),
      currency: env(process.env.NEXT_PUBLIC_DEMO_CURRENCY, "EUR"),
      urls: {
        "pragmatic-play": "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol={symbol}&lang={lang}&cur={currency}&jurisdiction=99&lobbyUrl={lobbyUrl}",
      },
    },
    title: "{name} demo and review",
    metaDescription: "Play the {name} demo for free. RTP {rtp}%, {volatility} volatility and a max win of {maxWin}x, by {provider}.",
    intro: "{name} is a {volatility} volatility game by {provider} with an RTP of {rtp}% and wins of up to {maxWin}x your bet.",
    eyebrow: "{provider} {type}",
    playLabel: "Play free demo",
    demoNote: "Demo mode with play money. 18+, play responsibly.",
    fullscreenLabel: "Full screen",
    closeLabel: "Close demo",
    noDemo: "There is no free demo for this game.",
    statsHeading: "{name} at a glance",
    stats: {
      rtp: "RTP",
      volatility: "Volatility",
      maxWin: "Max win",
      minBet: "Min. bet",
      maxBet: "Max. bet",
      grid: "Grid",
      paylines: "Paylines",
      ways: "Ways",
      symbolPays: "Symbols to win",
      released: "Released",
    },
    volatility: { low: "Low", medium: "Medium", high: "High" },
    volatilityLabel: "{level} volatility",
    rtpTiers: [
      { key: "high", min: 96.5, label: "High RTP" },
      { key: "medium", min: 95, label: "Medium RTP" },
      { key: "low", min: 0, label: "Low RTP" },
    ],
    payTypes: { lines: "Lines", ways: "Ways", megaways: "Megaways", cluster: "Cluster pays", anywhere: "Pay anywhere" },
    features: {
      heading: "Features",
      bonusBuy: "Bonus buy",
      bonusBuyUpTo: "Bonus buy up to {value}x",
      anteBet: "Ante bet",
      instantBonus: "Instant bonus",
      replay: "Replay",
      jackpot: "Jackpot",
    },
    themesLabel: "Themes",
    rtpVersions: "Casinos can run this game at {versions} RTP. Check the game info screen before you play.",
    whereToPlay: "Where to play {name}",
    moreFrom: "More {provider} games",
    listHeading: "{type} with a free demo",
    providerHeading: "{provider} games with a free demo",
    searchPlaceholder: "Search games",
    sortLabel: "Sort by",
    sortOptions: { newest: "Newest", rtp: "Highest RTP", maxWin: "Biggest max win", name: "A to Z" },
    allVolatility: "All",
    typeLabel: "Game type",
    allTypes: "All game types",
    providerLabel: "Provider",
    allProviders: "All providers",
    bonusBuyFilter: "Bonus buy",
    resultsLabel: "{count} games",
    showMoreLabel: "Show more games",
    empty: "No games match your search.",
    initialCount: 24,
  },

  bonuses: {
    columns: { casino: "Casino", wagering: "Wagering", deposit: "Min. deposit", bonus: "Bonus" },
    howToClaim: "How to claim",
    info: "General information",
    code: "Code",
    copyLabel: "Tap to copy",
    copiedLabel: "Copied",
    freeSpins: "Free spins",
    maxWin: "Max win",
    maxBet: "Max bet",
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
