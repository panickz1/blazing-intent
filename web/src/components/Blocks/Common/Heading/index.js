import slugify from "@/helpers/functions/slugify";

const TAGS = new Set(["h2", "h3", "h4", "h5", "h6"]);

export default function Heading({ heading, level }) {
  if (!heading) return null;
  const Tag = TAGS.has(level) ? level : "h2";
  return (
    <Tag id={slugify(heading)} className="scroll-mt-24 font-heading font-black tracking-[-0.02em] text-white">
      {heading}
    </Tag>
  );
}
