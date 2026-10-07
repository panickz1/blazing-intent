import { revalidatePath, revalidateTag } from "next/cache";

const TAGGED_COLLECTIONS = new Set([
  "pages",
  "articles",
  "categories",
  "help_articles",
  "help_categories",
  "menus",
  "footer",
  "theme",
  "casinos",
  "authors",
  "marketStats",
  "mediaMentions",
]);

function tagsForCollection(raw) {
  const collection = raw.replace(/_editor_node$/, "");
  if (collection !== raw) return [collection, "blocks"];
  if (TAGGED_COLLECTIONS.has(collection)) return [collection];
  return [collection, "blocks"];
}

export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ revalidated: false, message: "REVALIDATE_SECRET is not configured" }, { status: 500 });
  }
  if (request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path");
  const body = await request.json().catch(() => ({}));

  const tags = new Set(Array.isArray(body?.tags) ? body.tags.filter((t) => typeof t === "string" && t) : []);
  if (typeof body?.collection === "string" && body.collection) {
    tagsForCollection(body.collection).forEach((t) => tags.add(t));
  }

  if (!path && tags.size === 0) {
    return Response.json({ revalidated: false, message: "Send a collection, tags or path" }, { status: 400 });
  }

  if (path) revalidatePath(path);
  tags.forEach((tag) => revalidateTag(tag, "max"));

  return Response.json({ revalidated: true, now: Date.now(), path, tags: [...tags] });
}
