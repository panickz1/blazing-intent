import Image from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";

export default function ArticleHero({ src, alt }) {
  const url = assetUrl(src);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-grey-900">
      {url ? (
        <Image
          src={url}
          alt={alt || ""}
          fill
          priority
          sizes="(min-width: 1280px) 720px, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-primary/20 via-white/[0.03] to-transparent" />
      )}
    </div>
  );
}
