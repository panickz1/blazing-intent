import { site } from "@/site.config";
import { getOrganizationSchema } from "./getOrganizationSchema";

export default function schemaCasinoReview(casino) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${casino.name} review`,
    url: `${site.url}${site.affiliate.reviewPath}/${casino.slug}`,
    ...(casino.date_updated || casino.date_created ? { dateModified: casino.date_updated || casino.date_created } : {}),
    itemReviewed: { "@type": "Organization", name: casino.name },
    reviewRating: { "@type": "Rating", ratingValue: Number(casino.rating) || 0, bestRating: 5, worstRating: 0 },
    ...(casino.summary ? { reviewBody: casino.summary } : {}),
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: getOrganizationSchema(),
  };
}
