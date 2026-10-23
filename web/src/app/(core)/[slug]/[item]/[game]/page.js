import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import Breadcrumbs from "@/components/Layout/Breadcrumbs";
import { PAGE_TOP, titleClass } from "@/components/Layout/PageIntro";
import { Markdown } from "@/components/Markdown";
import CasinoListClient from "@/components/casino/CasinoListClient";
import GameDemo from "@/components/games/GameDemo";
import GameBrowser from "@/components/games/GameBrowser";
import { getSection, getCatalogCasinoIds, getEditorialSlugs } from "@/lib/catalog";
import { getCasinoCards } from "@/lib/casinos";
import { getGame, getGameParams, getSimilarGames, gameHref, gameValues, demoUrl, fill, toGameCard } from "@/lib/games";
import { num } from "@/lib/cms";
import { site } from "@/site.config";

export const generateStaticParams = getGameParams;

async function load(params) {
  const { slug, item, game: gameSlug } = await params;
  const section = getSection(slug);
  if (section?.collection !== "games") return null;
  const game = await getGame(item, gameSlug);
  if (!game) return null;
  return { section, game, values: gameValues(game), href: gameHref(game) };
}

export async function generateMetadata({ params }) {
  const data = await load(params);
  if (!data) return {};
  const { game, values, href } = data;
  const title = game.metatitle ? { absolute: game.metatitle } : fill(site.games.title, values);
  const description = game.metadescription || fill(site.games.metaDescription, values);
  const image = toGameCard(game).thumbnail?.src;
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: { title: game.metatitle || fill(site.games.title, values), description, url: href, ...(image ? { images: [image] } : {}) },
    ...(game.index === false ? { robots: { index: false, follow: true } } : {}),
  };
}

const money = (value) =>
  value == null ? null : new Intl.NumberFormat(site.locale, { style: "currency", currency: site.games.demo.currency, maximumFractionDigits: 2 }).format(num(value));

function Fact({ label, children }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-grey-800 bg-grey-900 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">{label}</dt>
      <dd className="m-0 text-[15px] font-semibold text-white">{children}</dd>
    </div>
  );
}

function facts(game, values) {
  const { stats, payTypes } = site.games;
  const pays =
    game.payType === "lines"
      ? { label: stats.paylines, value: game.paylines }
      : game.payType === "ways" || game.payType === "megaways"
        ? { label: stats.ways, value: game.paylines && new Intl.NumberFormat(site.locale).format(game.paylines) }
        : { label: stats.symbolPays, value: game.symbolPays && `${game.symbolPays} (${payTypes[game.payType]?.toLowerCase()})` };
  return [
    { label: stats.rtp, value: values.rtp && `${values.rtp}%` },
    { label: stats.volatility, value: site.games.volatility[game.volatility] },
    { label: stats.maxWin, value: values.maxWin && `${values.maxWin}x` },
    { label: stats.minBet, value: money(game.minBet) },
    { label: stats.maxBet, value: money(game.maxBet) },
    { label: stats.grid, value: game.reels && game.rows && `${game.reels} x ${game.rows}` },
    pays,
    {
      label: stats.released,
      value: game.releaseDate && new Intl.DateTimeFormat(site.locale, { dateStyle: "medium" }).format(new Date(game.releaseDate)),
    },
  ].filter((f) => f.value);
}

function featureList(game) {
  const f = site.games.features;
  return [
    game.hasBuyFeature && (game.maxBonusBuy ? fill(f.bonusBuyUpTo, { value: num(game.maxBonusBuy) }) : f.bonusBuy),
    game.hasAnteBet && f.anteBet,
    game.hasInstantBonus && f.instantBonus,
    game.isJackpot && (game.jackpot || f.jackpot),
    game.hasReplay && f.replay,
    ...(game.mechanics ?? []),
  ].filter(Boolean);
}

export default async function GamePage({ params }) {
  const data = await load(params);
  if (!data) notFound();
  const { section, game, values, href } = data;
  const labels = site.games;
  const card = toGameCard(game);
  const src = demoUrl(game);
  const providerSection = getSection("providers");
  const providerHref = providerSection && game.provider?.slug ? `/${providerSection.path}/${game.provider.slug}` : null;

  const [casinos, similar, editorial] = await Promise.all([
    providerSection && game.provider?.id
      ? getCatalogCasinoIds(providerSection, game.provider.id).then((ids) => (ids.length ? getCasinoCards({ ids, limit: 5 }) : []))
      : [],
    getSimilarGames(game, 12),
    getEditorialSlugs(),
  ]);

  const features = featureList(game);
  const versions = (game.rtpVariants ?? []).map((v) => `${v}%`);

  return (
    <>
      <section className={`landing-container pb-10 ${PAGE_TOP}`}>
        <Breadcrumbs
          items={[
            { name: section.label, url: editorial.includes(section.path) ? `/${section.path}` : undefined },
            { name: game.gameType.name, url: `/${section.path}/${game.gameType.slug}` },
            { name: game.name, url: href },
          ]}
          className="mb-5"
        />

        <header className="max-w-[72ch]">
          <p className="m-0 mb-2.5 text-[13px] font-semibold text-primary">
            {providerHref ? (
              <Link href={providerHref} className="hover:underline">
                {fill(labels.eyebrow, values)}
              </Link>
            ) : (
              fill(labels.eyebrow, values)
            )}
          </p>
          <h1 className={titleClass("lg")}>{game.name}</h1>
          <p className="m-0 mt-3.5 max-w-[64ch] text-[16.5px] leading-relaxed text-grey-200">{game.description || fill(labels.intro, values)}</p>
        </header>

        <div className="mt-7">
          {src ? (
            <GameDemo src={src} name={game.name} thumbnail={card.thumbnail} />
          ) : (
            <p className="m-0 rounded-xl border border-grey-800 bg-grey-900 p-6 text-[15px] text-fg-muted">{labels.noDemo}</p>
          )}
        </div>

        <h2 className="m-0 mt-10 font-heading text-[22px] font-black text-white">{fill(labels.statsHeading, values)}</h2>
        <dl className="m-0 mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {facts(game, values).map((f) => (
            <Fact key={f.label} label={f.label}>
              {f.value}
            </Fact>
          ))}
        </dl>
        {versions.length > 1 && <p className="mb-0 mt-3 text-[13px] text-fg-muted">{fill(labels.rtpVersions, { versions: versions.join(", ") })}</p>}

        {(features.length > 0 || game.themes?.length > 0) && (
          <div className="mt-6 grid gap-5 rounded-2xl border border-grey-800 bg-grey-900 p-5 md:grid-cols-2 lg:p-6">
            {features.length > 0 && (
              <div>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-widest text-fg-muted">{labels.features.heading}</p>
                <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0">
                  {features.map((f) => (
                    <li key={f} className="inline-flex items-center gap-1.5 rounded-md border border-grey-700 bg-grey-950 px-2.5 py-1 text-[12.5px] font-semibold text-grey-100">
                      <Check className="size-3.5 text-primary" strokeWidth={3} aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {game.themes?.length > 0 && (
              <div>
                <p className="m-0 text-[11px] font-semibold uppercase tracking-widest text-fg-muted">{labels.themesLabel}</p>
                <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0">
                  {game.themes.map((t) => (
                    <li key={t} className="rounded-md border border-grey-700 bg-grey-950 px-2.5 py-1 text-[12.5px] font-semibold text-grey-100">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {game.body?.trim() && (
          <article className="article-prose mt-10 max-w-[72ch]">
            <Markdown>{game.body}</Markdown>
          </article>
        )}

        {casinos.length > 0 && (
          <section className="mt-12">
            <h2 className="m-0 mb-4 font-heading text-[22px] font-black text-white">{fill(labels.whereToPlay, values)}</h2>
            <CasinoListClient casinos={casinos} topBadge="" licensedLabel="" showSort={false} />
          </section>
        )}
      </section>

      {similar.length > 0 && (
        <section className="border-t border-grey-800 bg-grey-900 py-10">
          <div className="landing-container">
            <h2 className="m-0 mb-4 font-heading text-[20px] font-black text-white">
              {providerHref ? (
                <Link href={providerHref} className="hover:underline">
                  {fill(labels.moreFrom, values)}
                </Link>
              ) : (
                fill(labels.moreFrom, values)
              )}
            </h2>
            <GameBrowser games={similar} filters={false} initialCount={0} />
          </div>
        </section>
      )}
    </>
  );
}
