const redirects = async () => {
  const directusUrl = process.env.DIRECTUS_URL;
  if (!directusUrl) return [];

  try {
    const res = await fetch(`${directusUrl}/items/redirects?fields=from,to&limit=-1`);
    const { data } = await res.json();
    return (data ?? [])
      .filter((r) => r?.from && r?.to)
      .map((r) => ({ source: r.from, destination: r.to.trim(), permanent: true }));
  } catch {
    return [];
  }
};

module.exports = redirects;
