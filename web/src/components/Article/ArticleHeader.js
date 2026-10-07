import Image from "next/image";
import assetUrl from "@/helpers/functions/assetUrl";
import Link from "next/link";
import { Clock } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import IconComponent from "@/helpers/functions/getIcon";
import formatDate from "@/helpers/functions/formatDate";
import BackButton from "./BackButton";
import ArticleHero from "./ArticleHero";

export default function ArticleHeader({
  article,
  category,
  showAuthor = true,
  dateLabel = null,
  backFallback = "/blog",
  image = null,
  minutes = null,
}) {
  const author = article?.author;
  const avatar = assetUrl(author?.avatar);
  const authorName = author ? `${author.first_name || ""} ${author.last_name || ""}`.trim() : null;
  const date = formatDate(article?.date_updated || article?.date_created);

  const cat = typeof category === "string" ? { name: category, slug: category } : category;

  const imageUrl = assetUrl(image);

  return (
    <header className={imageUrl ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:gap-10" : undefined}>
      <div className="flex flex-col gap-3.5">
        {cat ? (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-grey-400">
            <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
            <span aria-hidden>/</span>
            <Link href={`/blog/${cat.slug}`} className="transition-colors hover:text-white">
              {cat.name}
            </Link>
          </nav>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <BackButton fallback={backFallback} />
          </div>
        )}

        <h1 className="!mb-0 !mt-0 text-[clamp(26px,3vw,36px)] font-black leading-[1.12] tracking-[-0.01em] text-white [text-wrap:balance]">
          {article?.title || article?.shortTitle}
        </h1>

        {article?.summary && (
          <p className="!mb-0 !mt-0 max-w-[60ch] text-[17px] leading-relaxed text-grey-200">{article.summary}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
          {showAuthor && authorName && (
            <div rel="author" className="flex items-center gap-2 font-medium text-white/70">
              <HoverCard openDelay={0}>
                <HoverCardTrigger className="flex items-center gap-2">
                  {avatar && (
                    <Image
                      width="24"
                      height="24"
                      src={avatar}
                      alt={authorName}
                      className="h-6 w-6 rounded-full shadow"
                    />
                  )}
                  {authorName}
                </HoverCardTrigger>
                <HoverCardContent className="flex gap-4 text-white">
                  {avatar && (
                    <Image
                      width="48"
                      height="48"
                      src={avatar}
                      alt={authorName}
                      className="h-12 w-12 rounded-full shadow-lg"
                    />
                  )}
                  <div className="flex flex-col text-base">
                    <span>{authorName}</span>
                    {author?.title && <span className="text-xs text-white/70">{author.title}</span>}
                    <div className="flex items-center gap-2 pt-2">
                      {author?.linkedin && (
                        <Link href={author.linkedin} target="_blank" rel="nofollow">
                          <Image src="/linkedin.svg" width="20" height="20" alt={`${authorName} LinkedIn`} />
                        </Link>
                      )}
                      {author?.email && (
                        <Link href={`mailto:${author.email}`} target="_blank" rel="nofollow">
                          <Image src="/mail.svg" alt={`${authorName} E-mail`} width="20" height="22" className="opacity-80" />
                        </Link>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
          {date && (
            <span className="flex items-center gap-1.5">
              <IconComponent iconName="calendar_today" className="!text-[15px]" />
              {dateLabel ? `${dateLabel} ${date}` : date}
            </span>
          )}
          {minutes && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-[14px]" aria-hidden />
              {minutes} min read
            </span>
          )}
        </div>
      </div>

      {imageUrl && (
        <ArticleHero
          src={image}
          alt={article?.title || article?.shortTitle}
          className="aspect-[2/1] lg:aspect-[3/2]"
        />
      )}
    </header>
  );
}
