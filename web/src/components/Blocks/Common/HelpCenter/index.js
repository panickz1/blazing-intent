import Schema from "@/helpers/SEO/Schema";
import { getHelpCategories } from "@/lib/help";
import { HelpCenterClient } from "./HelpCenterClient";

export default async function HelpCenter() {
  const categories = await getHelpCategories();
  if (categories.length === 0) return null;

  const allEntries = categories
    .filter((c) => c.slug !== "popular")
    .flatMap((c) => c.articles)
    .filter((a) => a.type === "faq" && a.answer?.trim())
    .map(({ question, answer }) => ({ question, answer }));

  return (
    <section className="landing-container-prose pb-[clamp(48px,6vw,88px)] pt-[clamp(32px,4.2vw,56px)]">
      <HelpCenterClient categories={categories} />
      <Schema type="faq" data={allEntries} />
    </section>
  );
}
