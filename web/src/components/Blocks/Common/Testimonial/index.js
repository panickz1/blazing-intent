import Image from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";

function Stars({ count = 5, className = "" }) {
  return (
    <div className={`flex gap-1 ${className}`} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < count ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonial({
  quote = "It replaced three tools and gave us our afternoons back.",
  author = "Alex Morgan",
  role = "Head of Operations",
  avatar,
  rating = 5,
}) {
  const avatarSrc = assetUrl(avatar);
  return (
    <section className="landing-container-prose py-10">
      <figure className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-grey-900 p-8 lg:p-10">
        <span className="absolute inset-y-0 left-0 w-1 bg-brand-gradient" aria-hidden />
        {rating > 0 && <Stars count={rating} className="text-primary" />}
        <blockquote className="mt-4 text-2xl font-medium leading-snug text-white lg:text-3xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {(author || role) && (
          <figcaption className="mt-6 flex items-center gap-3">
            {avatarSrc ? (
              <span className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={avatarSrc} alt="" fill sizes="40px" className="object-cover" />
              </span>
            ) : (
              author && (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/[0.14] text-sm font-medium text-primary">
                  {author.trim().charAt(0)}
                </span>
              )
            )}
            <span className="flex flex-col leading-tight">
              {author && <span className="text-sm font-medium text-white">{author}</span>}
              {role && <span className="text-xs text-white/50">{role}</span>}
            </span>
          </figcaption>
        )}
      </figure>
    </section>
  );
}
