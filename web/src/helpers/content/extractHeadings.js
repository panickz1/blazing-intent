import slugify from "../functions/slugify";

export default function extractHeadings(content) {
  const headings = [];

  content?.content?.forEach((node) => {
    if (node.type === "heading") {
      const text = node.content?.[0]?.text;
      const level = node.attrs?.level;
      if (text && level) {
        headings.push({ text, id: slugify(text), level });
      }
    }
  });

  return headings;
}
