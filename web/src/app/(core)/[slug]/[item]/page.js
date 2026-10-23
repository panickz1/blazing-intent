import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Layout/Breadcrumbs";
import { PAGE_TOP, titleClass } from "@/components/Layout/PageIntro";
import Schema from "@/helpers/SEO/Schema";
import { Markdown } from "@/components/Markdown";
import CasinoListClient from "@/components/casino/CasinoListClient";
import BonusTable from "@/components/bonus/BonusTable";
import AttributeChip from "@/components/catalog/AttributeChip";
import GameBrowser from "@/components/games/GameBrowser";
import { getSection, getEditorialSlugs, toAttribute, getCatalogItem, getCatalogItems, getCatalogCasinoIds, getCatalogParams } from "@/lib/catalog";
import { getCasinoCards } from "@/lib/casinos";
import { getBonusRows } from "@/lib/bonuses";
import { getGameCards, fill } from "@/lib/games";
import assetUrl from "@/helpers/functions/assetUrl";
import { site } from "@/site.config";

export const generateStaticParams = getCatalogParams;

function gamesFor(section, item) {
  if (section.collection === "games") return getGameCards({ type: item.id });
  if (section.collection === "providers") return getGameCards({ provider: item.id });
  return [];
}

async function load(params) {
  const { slug, item: itemSlug } = await params;
  const section = getSection(slug);
  if (!section) return null;
  const item = await getCatalogItem(section.collection, itemSlug);
  if (!item) return null;
  const editorial = await getEditorialSlugs();
  if (editorial.includes(item.slug)) return { redirect: `/${item.slug}` };
  const isBonus = section.collection === "bonusTypes";
  const bonuses = isBonus ? await getBonusRows({ type: item.id, sortBy: "recommended" }) : [];
  const casinos = isBonus ? [] : await getCasinoCards({ ids: await getCatalogCasinoIds(section, item.id) });
  const games = await gamesFor(section, item);
  const count = isBonus ? bonuses.length : casinos.length;
  const thin = !item.body?.trim() && count < site.catalog.minCasinosToIndex && games.length === 0;
  return {
    section,
    item,
    bonuses,
    casinos,
    games,
    isBonus,
    sectionHref: editorial.includes(section.path) ? `/${section.path}` : undefined,
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
  const { section, item, bonuses, casinos, games, isBonus, sectionHref, title, href } = data;
  const siblings = (await getCatalogItems(section.collection))
    .filter((i) => i.id !== item.id)
    .map((i) => ({ ...toAttribute(section.collection, i), href: `/${section.path}/${i.slug}` }));

  return (
    <>
      {!isBonus && casinos.length > 0 && (
        <Schema type="itemList" data={{ name: title, items: casinos.map((c) => ({ name: c.name, url: c.reviewHref })) }} />
      )}

      <section className={`landing-container pb-6 ${PAGE_TOP}`}>
        <Breadcrumbs items={[{ name: section.label, url: sectionHref }, { name: item.name, url: href }]} className="mb-5" />

        <header className="flex max-w-[72ch] flex-col gap-4 sm:flex-row sm:gap-6">
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
            <p className="m-0 mb-2.5 text-[13px] font-semibold text-primary">{section.eyebrow}</p>
            <h1 className={titleClass("lg")}>
              {title}
            </h1>
            {item.description && <p className="m-0 mt-3.5 max-w-[64ch] text-[16.5px] leading-relaxed text-grey-200">{item.description}</p>}
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

      {games.length > 0 && (
        <section className="landing-container pb-12">
          <h2 className="m-0 mb-4 font-heading text-[22px] font-black text-white">
            {fill(section.collection === "providers" ? site.games.providerHeading : site.games.listHeading, { type: item.name, provider: item.name })}
          </h2>
          <GameBrowser games={games} />
        </section>
      )}

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
                  <AttributeChip item={s} className="bg-grey-950 px-3 py-1.5 text-[13.5px]" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
