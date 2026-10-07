const createNextIntlPlugin = require("next-intl/plugin");
const redirects = require("./redirects");

const withNextIntl = createNextIntlPlugin();

const remoteFrom = (value) => {
  try {
    const url = new URL(value);
    return { protocol: url.protocol.replace(":", ""), hostname: url.hostname, ...(url.port ? { port: url.port } : {}) };
  } catch {
    return null;
  }
};

const cmsUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || "";
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "";
const imageHosts = [remoteFrom(cmsUrl), remoteFrom(cdnUrl)].filter(Boolean);

const origin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
};
const cmsOrigin = origin(cmsUrl);
const cdnOrigin = origin(cdnUrl);

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.vercel-insights.com https://*.vercel-scripts.com https://*.youtube.com https://*.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: ${cmsOrigin} ${cdnOrigin} https://*.google-analytics.com https://*.googletagmanager.com;
  font-src 'self' https://fonts.gstatic.com data:;
  connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.vercel-insights.com https://*.vercel-scripts.com;
  frame-src 'self' https://*.youtube.com;
  frame-ancestors 'self' ${cmsOrigin};
`;

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim() },
];

module.exports = withNextIntl({
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./src/i18n/request.js",
    },
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: imageHosts,
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
  cacheComponents: true,
  experimental: {
    optimizeCss: true,
    inlineCss: true,
  },
  redirects,
});
