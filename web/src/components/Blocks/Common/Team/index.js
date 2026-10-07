import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { pick } from "@/lib/cms";
import { getAuthorCards } from "@/lib/authors";
import Schema from "@/helpers/SEO/Schema";

function initials(name = "") {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ person, size = "md" }) {
  const box = size === "sm" ? "size-12 rounded-xl text-[15px]" : "size-[72px] rounded-2xl text-[24px]";
  if (person.photo) {
    return <Image src={person.photo} alt={person.name} width={144} height={144} className={`${box} shrink-0 object-cover`} />;
  }
  return (
    <span aria-hidden className={`${box} grid shrink-0 place-items-center bg-grey-800 font-heading font-bold text-grey-100`}>
      {initials(person.name)}
    </span>
  );
}

function Fact({ label, value }) {
  if (!value) return null;
  return (
    <div className="border-t border-grey-800 py-3 first:border-t-0 first:pt-0">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">{label}</dt>
      <dd className="m-0 mt-1 text-[14.5px] leading-snug text-grey-100">{value}</dd>
    </div>
  );
}

export default async function Team({
  eyebrow = "Our team",
  title,
  description,
  authors,
  experienceLabel,
  expertiseLabel,
  favouriteLabel,
  tipLabel,
  variant = "cards",
  linkLabel,
  linkUrl,
}) {
  const ids = (Array.isArray(authors) ? authors : [])
    .map((row) => row?.authors_id?.id ?? row?.authors_id)
    .filter((id) => typeof id === "number" || typeof id === "string");
  const people = await getAuthorCards(ids);
  if (people.length === 0) return null;

  const heading = pick(title, "Meet the team.");

  if (variant === "strip") {
    return (
      <section className="landing-container py-14 lg:py-20">
        <SectionHeader eyebrow={eyebrow} title={heading} lead={description} />
        <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p) => (
            <li key={p.id} className="flex gap-3 rounded-xl border border-grey-800 bg-grey-900 p-4">
              <Avatar person={p} size="sm" />
              <div className="min-w-0">
                <p className="m-0 font-heading text-[15.5px] font-bold text-white">{p.name}</p>
                {p.role && <p className="m-0 text-[13px] font-medium text-primary">{p.role}</p>}
                {p.bio && <p className="m-0 mt-1.5 line-clamp-3 text-[13.5px] leading-relaxed text-grey-200">{p.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
        {linkUrl && linkLabel && (
          <Link
            href={linkUrl}
            className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-md border border-grey-700 px-4 text-[14px] font-medium text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
          >
            {linkLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        )}
      </section>
    );
  }
  const labels = {
    experience: pick(experienceLabel, "Experience"),
    expertise: pick(expertiseLabel, "Expertise"),
    favourite: pick(favouriteLabel, "Favourite game"),
    tip: pick(tipLabel, "Top tip"),
  };

  return (
    <section id="team" className="landing-container scroll-mt-24 py-16 lg:py-24">
      {people.map((p) => (
        <Schema key={p.id} type="person" data={p} />
      ))}
      <div className="max-w-[62ch]">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h2 className="m-0 mt-3 font-heading text-[clamp(30px,4.6vw,56px)] font-black leading-[1.02] tracking-[-0.03em] text-white">{heading}</h2>
        {description && <p className="mt-4 text-[17px] leading-relaxed text-fg-muted">{description}</p>}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14 lg:gap-6">
        {people.map((p) => (
          <article key={p.id} className="flex flex-col rounded-3xl border border-grey-800 bg-grey-900 p-6 lg:p-8">
            <header className="flex items-center gap-4">
              <Avatar person={p} />
              <div className="min-w-0">
                <h3 className="m-0 font-heading text-[22px] font-black tracking-[-0.02em] text-white">{p.name}</h3>
                {p.role && <p className="m-0 mt-1 text-[14px] font-semibold text-primary">{p.role}</p>}
                {p.links.length > 0 && (
                  <p className="m-0 mt-1.5 flex flex-wrap gap-x-3 text-[12.5px]">
                    {p.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener me" className="text-fg-muted underline-offset-4 hover:text-white hover:underline">
                        {l.label || l.url}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            </header>

            {p.bio && <p className="mb-0 mt-5 text-[15px] leading-relaxed text-grey-200">{p.bio}</p>}

            <dl className="mb-0 mt-6 grid gap-x-6 rounded-2xl border border-grey-800 bg-grey-950 p-4 sm:grid-cols-[auto_minmax(0,1fr)] [&>div:nth-child(2)]:sm:border-t-0 [&>div:nth-child(2)]:sm:pt-0">
              <Fact label={labels.experience} value={p.experience} />
              <Fact label={labels.expertise} value={p.expertise} />
              <div className="sm:col-span-2">
                <Fact label={labels.favourite} value={p.favourite} />
              </div>
            </dl>

            {p.tip && (
              <blockquote className="mb-0 mt-5 border-l-2 border-accent-2 pl-4">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-widest text-accent-2">{labels.tip}</p>
                <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-white">&ldquo;{p.tip}&rdquo;</p>
              </blockquote>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
