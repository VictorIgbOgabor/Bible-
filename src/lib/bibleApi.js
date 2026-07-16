// Live Bible text, fetched from bible-api.com (no key required, CORS enabled).
// These are all public-domain / freely-licensed translations.
// See: https://bible-api.com
export const TRANSLATIONS = [
  { id: "web", name: "World English Bible", short: "WEB" },
  { id: "kjv", name: "King James Version", short: "KJV" },
  { id: "asv", name: "American Standard Version", short: "ASV" },
  { id: "bbe", name: "Bible in Basic English", short: "BBE" },
  { id: "darby", name: "Darby Translation", short: "DARBY" },
  { id: "ylt", name: "Young's Literal Translation", short: "YLT" },
];

// NIV / ESV / NLT are copyrighted. To add them, get a free/licensed key from
// api.bible (American Bible Society) or the ESV API, then wire a fetch here.
// See README.md -> "Adding licensed translations" for the steps.

const cache = new Map();

function slug(book) {
  return book.trim().toLowerCase().replace(/\s+/g, "+");
}

export async function fetchChapter(book, chapter, translationId) {
  const key = `${translationId}:${book}:${chapter}`;
  if (cache.has(key)) return cache.get(key);

  const url = `https://bible-api.com/${slug(book)}+${chapter}?translation=${translationId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${book} ${chapter} (${translationId})`);
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  const result = {
    reference: data.reference,
    verses: (data.verses || []).map((v) => ({
      number: v.verse,
      text: v.text.trim(),
    })),
    translationName: data.translation_name,
    translationNote: data.translation_note,
  };
  cache.set(key, result);
  return result;
}

export async function fetchVerse(reference, translationId) {
  const key = `${translationId}:ref:${reference}`;
  if (cache.has(key)) return cache.get(key);

  const url = `https://bible-api.com/${encodeURIComponent(reference).replace(
    /%20/g,
    "+"
  )}?translation=${translationId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${reference}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);

  const result = {
    reference: data.reference,
    text: (data.text || "").trim(),
    translationName: data.translation_name,
  };
  cache.set(key, result);
  return result;
}
