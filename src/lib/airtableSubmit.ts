const API = import.meta.env.VITE_AIRTABLE_API_KEY || process.env.VITE_AIRTABLE_API_KEY;
const BASE = import.meta.env.VITE_AIRTABLE_BASE_ID || process.env.VITE_AIRTABLE_BASE_ID;

export async function airtableCreate(table: string, fields: Record<string, any>) {
  if (!API || !BASE) throw new Error("Missing Airtable env vars");
  const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) {
    throw new Error(`Airtable ${res.status}: ${data?.error?.message || 'no id in response'}`);
  }
  return data;
}
