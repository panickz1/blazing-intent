import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/Layout/PageShell";
import Schema from "@/helpers/SEO/Schema";
import { getBlogCategory, getBlogCategoryParams } from "@/lib/blog";
import { BlogListClient } from "@/components/Blocks/Common/BlogList/BlogListClient";
import { site } from "@/site.config";

export async function generateStaticParams() {
  return getBlogCategoryParams();
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const found = await getBlogCategory(category);
  if (!found) return {};

  const title = { absolute: `${found.category.name} | ${site.name} Blog` };
  const description =
    found.category.description?.trim() ||
    `Articles on ${found.category.name.toLowerCase()} from the ${site.name} blog.`;
  const url = `/blog/${category}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryArchive({ params }) {
  const { category } = await params;
  const found = await getBlogCategory(category);
  if (!found || found.cards.length === 0) notFound();

  const { category: cat, cards } = found;

  return (
    <PageShell>
      <section className="landing-container py-[clamp(36px,5vw,64px)]">
        <Schema
          type="itemList"
          data={{ name: cat.name, items: cards.map((c) => ({ name: c.title, url: c.href })) }}
        />

        <nav aria-label="Breadcrumb" className="mb-[18px] flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-grey-400">
          <Link href="/blog" className="transition-colors hover:text-white">Blog</Link>
          <span aria-hidden>/</span>
          <span>{cat.name}</span>
        </nav>

        <div className="max-w-[62ch]">
          <h1 className="font-heading text-[clamp(32px,4.6vw,54px)] font-black leading-[1.02] tracking-[-0.03em] text-white [text-wrap:balance]">
            {cat.name}
          </h1>
          {cat.description && (
            <p className="mt-4 text-[16.5px] leading-relaxed text-fg-muted [text-wrap:pretty]">
              {cat.description}
            </p>
          )}
        </div>

        <div className="mt-[clamp(28px,3.6vw,46px)]">
          <BlogListClient cards={cards} chips={[]} showFilters={false} initialCount={9} step={9} />
        </div>
      </section>
    </PageShell>
  );
}
