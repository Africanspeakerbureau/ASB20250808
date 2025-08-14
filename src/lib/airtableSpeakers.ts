export async function listSpeakers({ q = "", pageSize = 15, offset = "" }:{
  q?: string; pageSize?: number; offset?: string;
} = {}) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  p.set("limit", String(pageSize));
  if (offset) p.set("offset", offset);

  const r = await fetch(`/api/speakers?${p.toString()}`);
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Speakers API ${r.status} – ${err}`);
  }
  const json = await r.json();
  return { records: json.records || [], nextOffset: json.offset || "" };
}
