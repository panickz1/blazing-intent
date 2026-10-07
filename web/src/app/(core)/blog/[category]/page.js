import { notFound } from "next/navigation";
import PageIntro from "@/components/Layout/PageIntro";
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
    <section className="landing-container pb-14 lg:pb-20">
      <Schema
        type="itemList"
        data={{ name: cat.name, items: cards.map((c) => ({ name: c.title, url: c.href })) }}
      />

      <PageIntro
        breadcrumbs={[
          { name: site.breadcrumbs.blog, url: "/blog" },
          { name: cat.name, url: `/blog/${cat.slug}` },
        ]}
        title={cat.name}
        lead={cat.description}
      />

      <div className="mt-8">
        <BlogListClient cards={cards} chips={[]} layout="magazine" showFilters={false} initialCount={9} step={9} />
      </div>
    </section>
  );
}
