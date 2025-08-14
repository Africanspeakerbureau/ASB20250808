const FIELD_STATUS = "Status";
const FIELD_PUBLISHED = "Published on site";
const FIELD_FIRST = "First Name";
const FIELD_LAST = "Last Name";
const FIELD_TITLE = "Professional Title";
const FIELD_TAGS = "Tags";
const FIELD_EXPERTISE = "expertiseAreas";

const BASE = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE = import.meta.env.VITE_AIRTABLE_SPEAKERS_TABLE;
const APIKEY = import.meta.env.VITE_AIRTABLE_API_KEY;

function esc(s: string) {
  return s.replace(/"/g, '\\"');
}

function buildFilterFormula(q?: string) {
  const baseFilter = `AND({${FIELD_STATUS}} = "Approved", {${FIELD_PUBLISHED}} = TRUE())`;
  if (!q || q.trim().length < 2) return baseFilter;
  const term = esc(q.trim().toLowerCase());
  const match = (f: string) => `SEARCH("${term}", LOWER({${f}}))`;
  const anyField = `OR(
    ${match(FIELD_FIRST)},
    ${match(FIELD_LAST)},
    ${match(FIELD_TITLE)},
    ${match(FIELD_TAGS)},
    ${match(FIELD_EXPERTISE)}
  )`;
  return `AND(${baseFilter}, ${anyField})`;
}

export async function listSpeakers({ q = "", pageSize = 15, offset = "" }:
  { q?: string; pageSize?: number; offset?: string } = {}
) {
  const params = new URLSearchParams();
  params.set("pageSize", String(pageSize));
  params.set("filterByFormula", buildFilterFormula(q));
  if (offset) params.set("offset", offset);

  const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${APIKEY}` },
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}`);
  const json = await res.json();
  return {
    records: json.records as Array<any>,
    nextOffset: json.offset as string | undefined,
  };
}
