export async function listSpeakers({ q = "", pageSize = 15, offset = "" }:{
  q?: string; pageSize?: number; offset?: string;
}) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  p.set("limit", String(pageSize));
  if (offset) p.set("offset", offset);

  const r = await fetch(`/api/speakers?${p.toString()}`);
  const text = await r.text();
  if (!r.ok) throw new Error(`Speakers API ${r.status} – ${text}`);
  const json = JSON.parse(text || "{}");
  return { records: json.records || [], nextOffset: json.offset || "" };
}
