const CACHE_SIZE_LIMIT = 100;
const cache = new Map();

const NO_FALLBACK = Symbol("no-fallback");

export default async function fetchWithCache(
  cacheKey,
  fetchFn,
  { fallback = NO_FALLBACK } = {}
) {
  const cached = cache.get(cacheKey);

  let data;
  try {
    data = await fetchFn();
  } catch (error) {
    if (cached) {
      console.warn(`[cms] ${cacheKey} failed to refresh; serving stale copy.`, error?.message ?? error);
      return cached.data;
    }
    if (fallback !== NO_FALLBACK) {
      console.warn(`[cms] ${cacheKey} unavailable; rendering without it.`, error?.message ?? error);
      return fallback;
    }
    throw error;
  }

  if (!cache.has(cacheKey) && cache.size >= CACHE_SIZE_LIMIT) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(cacheKey, { data });
  return data;
}
