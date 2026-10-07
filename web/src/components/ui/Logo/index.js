import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/site.config";
import assetUrl from "@/helpers/functions/assetUrl";

const Logo = ({ options, isFooter, onClick }) => {
  const src = assetUrl(options?.logo);
  const label = `${site.name}, home`;

  if (!src) {
    return (
      <Link
        href="/"
        onClick={onClick}
        aria-label={label}
        className={cn(
          "flex items-center gap-2 whitespace-nowrap font-heading font-black tracking-[-0.02em] text-white transition-opacity hover:opacity-80",
          isFooter ? "text-base" : "text-lg"
        )}
      >
        <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">
          {site.name.charAt(0).toUpperCase()}
        </span>
        {site.name}
      </Link>
    );
  }

  return (
    <Link href="/" onClick={onClick} aria-label={label}>
      <Image src={src} width={145} height={43} priority alt={site.name} className="h-8 w-auto" />
    </Link>
  );
};

export default Logo;
