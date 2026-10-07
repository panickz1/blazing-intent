import NextImage from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";

export default function Image({ image, alt, caption, maxWidth, maxWidthMetric }) {
  const src = assetUrl(image);
  if (!src) return null;

  const width = image?.width || 1600;
  const height = image?.height || 900;
  const limit = Number(maxWidth) > 0 ? `${maxWidth}${maxWidthMetric ? "px" : "%"}` : "100%";

  return (
    <figure className="mx-auto my-6 w-full" style={{ maxWidth: limit }}>
      <NextImage
        src={src}
        alt={alt || image?.description || ""}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 860px, 100vw"
        className="h-auto w-full rounded-2xl border border-grey-800"
      />
      {caption && <figcaption className="mt-3 text-center text-sm text-fg-muted">{caption}</figcaption>}
    </figure>
  );
}
