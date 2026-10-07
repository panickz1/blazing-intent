import Link from "next/link";
import IconComponent from "@/helpers/functions/getIcon";

export default function FooterMenuColumn({ menuData, className }) {
  if (!menuData?.entrys?.length) return null;

  return (
    <nav className={`flex flex-col gap-3 ${className ?? ""}`}>
      <div className="text-sm font-semibold text-white">{menuData?.title}</div>
      <menu>
        <ul className="flex flex-col gap-2">
          {menuData.entrys.map((entry, i) => (
            <li key={i}>
              <Link
                href={entry.url}
                target={entry.target === "_BLANK" ? "_blank" : "_self"}
                rel={entry.rel}
                className="flex items-center gap-2 text-sm text-fg-muted font-normal transition-colors hover:text-white"
              >
                {entry.icon && <IconComponent iconName={entry.icon} className="!text-[17px]" />}
                {entry.anchor}
              </Link>
            </li>
          ))}
        </ul>
      </menu>
    </nav>
  );
}
