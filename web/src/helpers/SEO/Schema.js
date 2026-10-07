const schemas = new Map([
  ["faq", "schemaFAQ"],
  ["blogPost", "schemaBlogPost"],
  ["tools", "schemaTools"],
  ["itemList", "schemaItemList"],
  ["breadcrumb", "schemaBreadcrumb"],
  ["webpage", "schemaWebpage"],
  ["offers", "schemaOffers"],
  ["global", "schemaGlobal"],
  ["review", "schemaReview"],
  ["howTo", "schemaHowTo"],
  ["techArticle", "schemaTechArticle"],
  ["casinoReview", "schemaCasinoReview"],
  ["person", "schemaPerson"],
]);

export default async function Schema({ type, data }) {
  if (!type || !schemas.has(type)) {
    return null;
  }

  let json;
  try {
    const schema = await import(`./schemas/${schemas.get(type)}`).then((module) => module.default);
    json = JSON.stringify(schema(data)).replace(/</g, "\\u003c");
  } catch {
    return null;
  }

  return <script id={data?.slug ? `${type}-${data.slug}` : type} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
