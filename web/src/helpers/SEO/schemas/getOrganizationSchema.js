import { site } from "@/site.config";

export function getOrganizationSchema() {
  const env = process.env;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
  };

  if (env.ORG_LEGAL_NAME) schema.legalName = env.ORG_LEGAL_NAME;

  if (env.SITE_LOGO_URL) {
    schema.logo = {
      "@type": "ImageObject",
      url: env.SITE_LOGO_URL,
      width: env.SITE_LOGO_WIDTH || "1200",
      height: env.SITE_LOGO_HEIGHT || "630",
    };
  }

  if (env.ORG_FOUNDING_DATE) schema.foundingDate = env.ORG_FOUNDING_DATE;

  if (env.ORG_FOUNDER_NAME) {
    schema.founders = [
      {
        "@type": "Person",
        name: env.ORG_FOUNDER_NAME,
        ...(env.ORG_FOUNDER_URL ? { sameAs: [env.ORG_FOUNDER_URL] } : {}),
      },
    ];
  }

  if (env.ORG_VAT_ID) schema.vatID = env.ORG_VAT_ID;

  if (env.ORG_ADDRESS_LOCALITY || env.ORG_ADDRESS_STREET) {
    schema.address = {
      "@type": "PostalAddress",
      ...(env.ORG_ADDRESS_STREET ? { streetAddress: env.ORG_ADDRESS_STREET } : {}),
      ...(env.ORG_ADDRESS_LOCALITY ? { addressLocality: env.ORG_ADDRESS_LOCALITY } : {}),
      ...(env.ORG_ADDRESS_REGION ? { addressRegion: env.ORG_ADDRESS_REGION } : {}),
      ...(env.ORG_ADDRESS_POSTAL_CODE ? { postalCode: env.ORG_ADDRESS_POSTAL_CODE } : {}),
      ...(env.ORG_ADDRESS_COUNTRY ? { addressCountry: env.ORG_ADDRESS_COUNTRY } : {}),
    };
  }

  if (env.ORG_CONTACT_EMAIL) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: env.ORG_CONTACT_EMAIL,
    };
  }

  if (env.ORG_SAME_AS) {
    schema.sameAs = env.ORG_SAME_AS.split(",").map((s) => s.trim()).filter(Boolean);
  }

  return schema;
}
