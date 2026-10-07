import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Schema from "@/helpers/SEO/Schema";
import { Markdown } from "@/components/Markdown";
import CasinoListClient from "@/components/casino/CasinoListClient";
import BonusTable from "@/components/bonus/BonusTable";
import { getSection, getEditorialSlugs, getCatalogItem, getCatalogItems, getCatalogCasinoIds, getCatalogParams } from "@/lib/catalog";
import { getCasinoCards } from "@/lib/casinos";
import { getBonusRows } from "@/lib/bonuses";
import assetUrl from "@/helpers/functions/assetUrl";
import { site } from "@/site.config";

export const generateStaticParams = getCatalogParams;

async function load(params) {
  const { slug, item: itemSlug } = await params;
  const section = getSection(slug);
  if (!section) return null;
  const item = await getCatalogItem(section.collection, itemSlug);
  if (!item) return null;
  if ((await getEditorialSlugs()).includes(item.slug)) return { redirect: `/${item.slug}` };
  const isBonus = section.collection === "bonusTypes";
  const bonuses = isBonus ? await getBonusRows({ type: item.id, sortBy: "recommended" }) : [];
  const casinos = isBonus ? [] : await getCasinoCards({ ids: await getCatalogCasinoIds(section, item.id) });
  const count = isBonus ? bonuses.length : casinos.length;
  const thin = !item.body?.trim() && count < site.catalog.minCasinosToIndex;
  return {
    section,
    item,
    bonuses,
    casinos,
    isBonus,
    title: section.title.replace("{name}", item.name),
    href: `/${section.path}/${item.slug}`,
    indexable: item.index !== false && !thin,
  };
}

export async function generateMetadata({ params }) {
  const data = await load(params);
  if (!data || data.redirect) return {};
  const { item, title, href, indexable } = data;
  const description = item.metadescription || item.description;
  return {
    title: item.metatitle ? { absolute: item.metatitle } : title,
    description,
    alternates: { canonical: href },
    openGraph: { title, description, url: href },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CatalogPage({ params }) {
  const data = await load(params);
  if (!data) notFound();
  if (data.redirect) permanentRedirect(data.redirect);
  const { section, item, bonuses, casinos, isBonus, title, href } = data;
  const siblings = (await getCatalogItems(section.collection)).filter((i) => i.id !== item.id);

  return (
    <>
      <Schema
        type="breadcrumb"
        data={{ items: [{ name: "Home", url: "/" }, { name: section.label, url: href }, { name: item.name, url: href }] }}
      />
      {!isBonus && casinos.length > 0 && (
        <Schema type="itemList" data={{ name: title, items: casinos.map((c) => ({ name: c.name, url: c.reviewHref })) }} />
      )}

      <section className="landing-container pb-6 pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-fg-muted">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden>/</span>
          <span>{section.label}</span>
          <span aria-hidden>/</span>
          <span className="text-grey-200">{item.name}</span>
        </nav>

        <header className="flex max-w-[72ch] flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {item.logo?.filename_disk && (
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl border border-grey-800 bg-grey-900 p-3">
              <Image
                src={assetUrl(item.logo)}
                alt={item.name}
                width={item.logo.width || 80}
                height={item.logo.height || 80}
                className="max-h-full w-auto object-contain"
              />
            </span>
          )}
          <div>
            <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{section.eyebrow}</p>
            <h1 className="m-0 mt-2 font-heading text-[clamp(30px,4.4vw,52px)] font-black leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance]">
              {title}
            </h1>
            {item.description && <p className="m-0 mt-4 text-[17px] leading-relaxed text-fg-muted">{item.description}</p>}
          </div>
        </header>
      </section>

      <section className="landing-container pb-10">
        {isBonus ? (
          <BonusTable bonuses={bonuses} initialCount={10} />
        ) : casinos.length > 0 ? (
          <CasinoListClient casinos={casinos} topBadge="" licensedLabel="" showSort={casinos.length > 3} initialCount={10} />
        ) : (
          <p className="m-0 rounded-xl border border-grey-800 bg-grey-900 p-6 text-[15px] text-fg-muted">{site.catalog.emptyLabel}</p>
        )}
      </section>

      {item.body?.trim() && (
        <section className="landing-container pb-12">
          <div className="article-prose max-w-[72ch]">
            <Markdown>{item.body}</Markdown>
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="border-t border-grey-800 bg-grey-900 py-10">
          <div className="landing-container">
            <h2 className="m-0 font-heading text-[20px] font-black text-white">{site.catalog.moreLabel.replace("{label}", section.label.toLowerCase())}</h2>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
              {siblings.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/${section.path}/${s.slug}`}
                    className="inline-flex rounded-md border border-grey-700 bg-grey-950 px-3 py-1.5 text-[13.5px] font-semibold text-grey-100 transition-colors hover:border-grey-500 hover:text-white"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
