import NextImage from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";

export default function Quote({ text, author }) {
  if (!text) return null;
  const name = author ? `${author.first_name || ""} ${author.last_name || ""}`.trim() : "";
  const avatar = assetUrl(author?.avatar);

  return (
    <figure className="my-6 rounded-2xl border border-grey-800 bg-grey-900 p-6 lg:p-8">
      <blockquote className="font-heading text-xl font-semibold leading-snug text-white lg:text-2xl">
        &ldquo;{text}&rdquo;
      </blockquote>
      {name && (
        <figcaption className="mt-5 flex items-center gap-3 text-sm text-fg-muted">
          {avatar ? (
            <NextImage src={avatar} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
          ) : (
            <span className="grid size-7 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {name.charAt(0)}
            </span>
          )}
          {name}
        </figcaption>
      )}
    </figure>
  );
}
