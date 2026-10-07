import AppCtaCard from "./AppCtaCard";
import TableOfContents from "./TableOfContents";

export default function ArticleSidebar({ headings = [], showCta = true }) {
  return (
    <aside
      className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-[92px] lg:self-start lg:max-h-[calc(100vh-108px)] lg:overflow-y-auto">
      {showCta && <AppCtaCard />}
      <TableOfContents headings={headings} />
    </aside>
  );
}
