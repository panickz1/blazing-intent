const WORDS_PER_MINUTE = 220;

function countWords(node) {
  if (!node || typeof node !== "object") return 0;
  const own = typeof node.text === "string" ? node.text.trim().split(/\s+/).filter(Boolean).length : 0;
  const children = Array.isArray(node.content) ? node.content.reduce((sum, child) => sum + countWords(child), 0) : 0;
  return own + children;
}

export default function readingTime(content) {
  const words = countWords(content);
  return words ? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) : null;
}
