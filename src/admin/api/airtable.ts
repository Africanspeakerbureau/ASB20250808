const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID!;
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY!;
const endpoint = `https://api.airtable.com/v0/${baseId}`;

type AirtableRecord<T = any> = { id: string; fields: T };

async function getRecord<T>(table: string, id: string): Promise<AirtableRecord<T>> {
  const res = await fetch(`${endpoint}/${encodeURIComponent(table)}/${id}`, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  if (!res.ok) throw new Error(`Airtable ${table}/${id} ${res.status}`);
  return res.json();
}

async function updateRecord<T>(table: string, id: string, fields: Record<string, any>): Promise<AirtableRecord<T>> {
  const res = await fetch(`${endpoint}/${encodeURIComponent(table)}/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable ${table}/${id} ${res.status}`);
  return res.json();
}

const readSingleSelect = (v: any) => (typeof v === 'string' ? v : v?.name ?? '');
const readMultiSelect = (v: any) => Array.isArray(v) ? v.map(x => (typeof x === 'string' ? x : x?.name)).filter(Boolean) : [];
const readAttachments = (v: any) => Array.isArray(v) ? v.map(a => ({ url: a.url, filename: a.filename })) : [];

export { getRecord, updateRecord, readSingleSelect, readMultiSelect, readAttachments };
