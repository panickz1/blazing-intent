import { site } from "@/site.config";

export default function schemaPerson(person) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.role ? { jobTitle: person.role } : {}),
    ...(person.bio ? { description: person.bio } : {}),
    ...(person.photo ? { image: person.photo } : {}),
    ...(person.expertise ? { knowsAbout: person.expertise } : {}),
    ...(person.links?.length ? { sameAs: person.links.map((l) => l.url) } : {}),
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
  };
}
