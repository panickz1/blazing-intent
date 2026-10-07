import { getAffiliateUrl } from "@/lib/casinos";

export async function GET(request, { params }) {
  const { slug } = await params;
  const target = await getAffiliateUrl(slug);
  const headers = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

  if (!target) {
    return Response.redirect(new URL("/casinos", request.url), 302);
  }

  return new Response(null, { status: 302, headers: { ...headers, Location: target } });
}
