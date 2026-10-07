export function pick(value, fallback) {
  return value ?? fallback;
}

export function rows(value, fallback = []) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

export function labels(value, fallback = [], key = "label") {
  return rows(value, fallback)
    .map((row) => (typeof row === "string" ? row : row?.[key]))
    .filter((label) => typeof label === "string" && label.trim() !== "");
}

export function num(value, fallback) {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}
