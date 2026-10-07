import Link from "next/link";
import IconComponent from "@/helpers/functions/getIcon";
import { brandIconFor } from "@/components/ui/SocialIcons";

export default function FooterSocials({ menuData }) {
  const entries = menuData?.entrys ?? [];
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-2" aria-label={menuData?.title}>
      {entries.map((entry, i) => {
        const Brand = brandIconFor(entry.url);
        return (
          <Link
            key={i}
            href={entry.url}
            target={entry.target === "_BLANK" ? "_blank" : "_self"}
            rel={entry.rel}
            title={entry.anchor}
            aria-label={entry.anchor}
            className="flex size-9 items-center justify-center rounded-full border border-grey-700 bg-grey-900 text-white transition-colors hover:border-grey-600"
          >
            {Brand ? (
              <Brand className="size-4" />
            ) : entry.icon ? (
              <IconComponent iconName={entry.icon} className="!text-[17px] text-white" />
            ) : (
              <span className="text-xs font-semibold">{entry.anchor?.[0]}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
