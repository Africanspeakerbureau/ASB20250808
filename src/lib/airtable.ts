// src/lib/airtable.ts
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY as string;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string;
const TABLE = import.meta.env.VITE_AIRTABLE_TABLE_BLOG || 'Blog';

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`;

type Fields = Record<string, any>;

async function at(method: 'GET'|'POST'|'PATCH'|'DELETE', path = '', body?: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// -------- Admin (list/edit) --------
export async function listPosts(params: { search?: string; status?: string } = {}) {
  const filter: string[] = [];
  if (params.status) filter.push(`{Status} = '${params.status}'`);
  if (params.search) filter.push(`FIND(LOWER('${params.search}'), LOWER({Name}))`);
  const filterByFormula = filter.length ? filter.join(' AND ') : undefined;

  const urlParams = new URLSearchParams();
  if (filterByFormula) urlParams.set('filterByFormula', filterByFormula);
  urlParams.set('sort[0][field]', 'Publish Date');
  urlParams.set('sort[0][direction]', 'desc');

  const data = await at('GET', `?${urlParams.toString()}`);
  return (data.records || []).map((r: any) => ({ id: r.id, ...r.fields })) as Array<Fields & {id: string}>;
}

export async function getPost(id: string) {
  const data = await at('GET', `/${id}`);
  return { id: data.id, ...data.fields } as Fields & { id: string };
}

export async function createPost(fields: Fields) {
  const data = await at('POST', '', { records: [{ fields }] });
  const r = data.records[0];
  return { id: r.id, ...r.fields } as Fields & { id: string };
}

export async function updatePost(id: string, fields: Fields) {
  const data = await at('PATCH', '', { records: [{ id, fields }] });
  const r = data.records[0];
  return { id: r.id, ...r.fields } as Fields & { id: string };
}

export async function deletePost(id: string) {
  await at('DELETE', `?records[]=${encodeURIComponent(id)}`);
}

// -------- Public read-side --------
export function isPostVisible(rec: any, preview: boolean) {
  if (preview) return true;
  if (rec?.Status !== 'Published') return false;
  if (rec?.['Publish Date']) {
    const pub = new Date(rec['Publish Date']);
    if (pub > new Date()) return false;
  }
  return true;
}

export async function getPostBySlug(slug: string) {
  const s = String(slug || '').toLowerCase();
  const formula = `LOWER({Slug})='${s}'`;
  const params = new URLSearchParams({ filterByFormula: formula, maxRecords: '1' });
  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable GET by slug failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  const rec = data.records?.[0];
  return rec ? ({ id: rec.id, ...rec.fields } as any) : null;
}
