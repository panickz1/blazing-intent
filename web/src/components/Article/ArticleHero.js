import Image from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";
import { cn } from "@/lib/utils";

export default function ArticleHero({ src, alt, className }) {
  const url = assetUrl(src);
  if (!url) return null;

  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-white/10 bg-grey-900", className)}>
      <Image
        src={url}
        alt={alt || ""}
        fill
        priority
        sizes="(min-width: 1024px) 400px, 100vw"
        className="object-cover"
      />
    </div>
  );
}
