import Schema from "@/helpers/SEO/Schema";
import { pick } from "@/lib/cms";
import { FaqAccordion } from "./FaqAccordion";

export default function Faq({ eyebrow, title, entries, schema }) {
  if (!entries?.length) return null;

  const heading = pick(title, "Frequently asked questions");
  const emitSchema = pick(schema, true) !== false;

  return (
    <section className="bg-grey-900 py-16 lg:py-24">
      <div className="landing-container-prose">
        {pick(eyebrow, "FAQ") && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{pick(eyebrow, "FAQ")}</p>
        )}
        {heading && (
          <h2 className="mt-3 font-heading text-[clamp(30px,4.4vw,50px)] font-black tracking-[-0.03em] text-white">
            {heading}
          </h2>
        )}
        <FaqAccordion entries={entries} />
      </div>
      {emitSchema && <Schema type="faq" data={entries} />}
    </section>
  );
}
