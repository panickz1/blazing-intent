import Link from "next/link";
import { useTranslations } from "next-intl";
import Logo from "@/components/ui/Logo";
import FooterMenuColumn from "./FooterMenuColumn";
import FooterSocials from "./FooterSocials";
import { site } from "@/site.config";

const FOOTER_MENU_KEY = /^footer-menu-(\d+)$/;
const SOCIALS_TITLE = /social/i;
const LEGAL_TITLE = /legal/i;

function footerMenus(menus) {
  return (Array.isArray(menus) ? menus : [])
    .filter((m) => FOOTER_MENU_KEY.test(m?.key ?? ""))
    .sort((a, b) => Number(a.key.match(FOOTER_MENU_KEY)[1]) - Number(b.key.match(FOOTER_MENU_KEY)[1]));
}

export default function Footer({ generalData, footerData, menus }) {
  const t = useTranslations("footer");
  const mapped = footerMenus(menus);
  const socialsMenu = mapped.find((m) => SOCIALS_TITLE.test(m?.title ?? ""));
  const legalMenu = mapped.find((m) => LEGAL_TITLE.test(m?.title ?? ""));
  const textMenus = mapped.filter((m) => m && m !== socialsMenu && m !== legalMenu);

  const bottomLegal =
    legalMenu?.entrys?.length > 0
      ? legalMenu.entrys.map((e) => ({
          label: e.anchor,
          href: e.url,
          target: e.target === "_BLANK" ? "_blank" : undefined,
          rel: e.rel,
        }))
      : site.footer.legalLinks;

  const longestMenu = textMenus.reduce(
    (a, b) => ((b?.entrys?.length ?? 0) > (a?.entrys?.length ?? 0) ? b : a),
    textMenus[0]
  );

  return (
    <footer className="border-t border-grey-800 bg-grey-950 py-10">
      <div className="landing-container flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:items-start lg:gap-x-12 lg:gap-y-8">
          <div className="flex max-w-[260px] shrink-0 flex-col gap-3 lg:pt-0.5">
            <Logo isFooter options={generalData} />
            <p className="text-sm leading-relaxed text-fg-muted">{site.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:flex lg:gap-x-12 lg:gap-y-8">
            {textMenus.map((menu, i) => (
              <FooterMenuColumn
                key={i}
                menuData={menu}
                className={menu === longestMenu ? "order-last sm:order-none" : undefined}
              />
            ))}
          </div>
        </div>
        <FooterSocials menuData={socialsMenu} />
      </div>

      {(footerData?.disclaimer || site.compliance?.ageBadge) && (
        <div className="landing-container mt-8 flex items-start gap-4 border-t border-grey-800 pt-6">
          {site.compliance?.ageBadge && (
            <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-destructive text-[12px] font-black text-white">
              {site.compliance.ageBadge}
            </span>
          )}
          {footerData?.disclaimer && (
            <p className="m-0 font-mono text-[11.5px] leading-[1.7875] text-fg-muted opacity-80">{footerData.disclaimer}</p>
          )}
        </div>
      )}

      <div className="landing-container mt-6 flex flex-col items-center gap-5 border-t border-grey-800 pt-5 font-mono text-xs lg:flex-row lg:justify-between">
        <span className="text-center text-fg-muted opacity-65 lg:text-left">{site.footer.copyright}</span>

        {bottomLegal.length > 0 && (
          <nav aria-label={t("legal")} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] text-fg-muted">
            {bottomLegal.map((l) => (
              <Link key={l.href} href={l.href} target={l.target} rel={l.rel} className="whitespace-nowrap transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <OptimizedBy label={t("optimizedBy")} />
    </footer>
  );
}

function OptimizedBy({ label }) {
  const name = process.env.OPTIMIZED_BY_NAME;
  const url = process.env.OPTIMIZED_BY_URL;
  if (!name || !url) return null;

  return (
    <div className="landing-container mt-6 flex justify-center">
      <div className="rounded-md bg-grey-900 px-2 py-1 text-center text-[10px] text-grey-200">
        {label}{" "}
        <Link target="_blank" href={url} className="text-primary">
          {name}
        </Link>
      </div>
    </div>
  );
}
