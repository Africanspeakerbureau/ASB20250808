import { normalizeSpeaker } from './normalizeSpeaker';

const AIRTABLE_BASE = import.meta.env.VITE_AIRTABLE_BASE_ID;
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const TABLE_SPEAKERS = import.meta.env.VITE_AIRTABLE_TABLE_SPEAKERS || 'Speaker Applications';
const TABLE_BLOG = import.meta.env.VITE_AIRTABLE_TABLE_BLOG || 'Blog';

function assertEnv() {
  if (!AIRTABLE_BASE || !API_KEY) {
    throw new Error('Missing Airtable env (VITE_AIRTABLE_BASE_ID / VITE_AIRTABLE_API_KEY)');
  }
}

export const isAirtableId = s => /^rec[a-zA-Z0-9]{14}$/.test(String(s || ''));

const API_ROOT = `https://api.airtable.com/v0/${encodeURIComponent(AIRTABLE_BASE)}`;
const SPEAKERS_URL = `${API_ROOT}/${encodeURIComponent(TABLE_SPEAKERS)}`;
const BLOG_BASE_URL = `${API_ROOT}/${encodeURIComponent(TABLE_BLOG)}`;

async function airtableSelectAll(table, params = {}) {
  assertEnv();
  const urlBase = `${API_ROOT}/${encodeURIComponent(table)}`;
  const headers = { Authorization: `Bearer ${API_KEY}` };
  let url = new URL(urlBase);
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return;
    url.searchParams.set(k, v);
  });

  const all = [];
  while (true) {
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Airtable list error', res.status, body);
      throw new Error(`Airtable list failed: ${res.status}`);
    }
    const json = await res.json();
    all.push(...(json.records || []));
    if (json.offset) {
      url = new URL(urlBase);
      Object.entries(params).forEach(([k, v]) => {
        if (v == null) return;
        url.searchParams.set(k, v);
      });
      url.searchParams.set('offset', json.offset);
    } else {
      break;
    }
  }
  return all;
}

export async function listSpeakers() {
  const records = await airtableSelectAll(TABLE_SPEAKERS, { pageSize: 50 });
  const rows = (records || []).filter(r => {
    const stat = r?.fields?.['Status'];
    if (!stat) return false;
    if (Array.isArray(stat)) return stat.includes('Published on Site') || stat.some(s => s?.name === 'Published on Site');
    return String(stat) === 'Published on Site';
  });
  return rows
    .map(r => {
      try {
        return normalizeSpeaker(r);
      } catch (e) {
        console.error('normalizeSpeaker failed', e);
        return null;
      }
    })
    .filter(Boolean);
}

export async function getSpeakerBySlugOrId(slugOrId) {
  assertEnv();
  if (isAirtableId(slugOrId)) {
    const url = `${SPEAKERS_URL}/${encodeURIComponent(slugOrId)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } });
    if (!res.ok) throw new Error(`Airtable get failed: ${res.status}`);
    const rec = await res.json();
    return normalizeSpeaker(rec);
  }

  const slug = String(slugOrId).toLowerCase();
  const bySlug = await airtableSelectAll(TABLE_SPEAKERS, {
    filterByFormula: `LOWER({Slug}) = "${slug}"`,
    pageSize: 1,
  });
  if (bySlug[0]) return normalizeSpeaker(bySlug[0]);

  const byName = await airtableSelectAll(TABLE_SPEAKERS, {
    filterByFormula: `LOWER({Full Name}) = "${slug.replace(/-/g, ' ')}"`,
    pageSize: 1,
  });
  if (byName[0]) return normalizeSpeaker(byName[0]);

  return null;
}

async function query(table, params = {}) {
  assertEnv();
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_ROOT}/${encodeURIComponent(table)}?${qs}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return (json.records || []).map((r) => ({ id: r.id, createdTime: r.createdTime, ...r.fields }));
}

export const getSpeakerApplications = (opts = {}) =>
  query(TABLE_SPEAKERS, { view: 'Grid view', maxRecords: 200, ...opts });

export const getClientInquiries = (opts = {}) =>
  query('Client Inquiries', { view: 'Grid view', maxRecords: 200, ...opts });

export const getQuickInquiries = (opts = {}) =>
  query('Quick Inquiries', { view: 'Grid view', maxRecords: 200, ...opts });

export async function updateSpeaker(recordId, fields) {
  assertEnv();
  const res = await fetch(`${SPEAKERS_URL}/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ---- Blog helpers ----
async function blogAt(method, path = '', body) {
  const res = await fetch(`${BLOG_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function listPosts(params = {}) {
  const filter = [];
  if (params.status) filter.push(`{Status} = '${params.status}'`);
  if (params.search) filter.push(`FIND(LOWER('${params.search}'), LOWER({Name}))`);
  const filterByFormula = filter.length ? filter.join(' AND ') : undefined;

  const urlParams = new URLSearchParams();
  if (filterByFormula) urlParams.set('filterByFormula', filterByFormula);
  urlParams.set('sort[0][field]', 'Publish Date');
  urlParams.set('sort[0][direction]', 'desc');

  const data = await blogAt('GET', `?${urlParams.toString()}`);
  return (data.records || []).map((r) => ({ id: r.id, ...r.fields }));
}

export async function getPost(id) {
  const data = await blogAt('GET', `/${id}`);
  return { id: data.id, ...data.fields };
}

export async function createPost(fields) {
  const data = await blogAt('POST', '', { records: [{ fields }] });
  const r = data.records[0];
  return { id: r.id, ...r.fields };
}

export async function updatePost(id, fields) {
  const data = await blogAt('PATCH', '', { records: [{ id, fields }] });
  const r = data.records[0];
  return { id: r.id, ...r.fields };
}

export async function deletePost(id) {
  await blogAt('DELETE', `?records[]=${encodeURIComponent(id)}`);
}

export function isPostVisible(rec, preview) {
  if (preview) return true;
  if (rec?.Status !== 'Published') return false;
  if (rec?.['Publish Date']) {
    const pub = new Date(rec['Publish Date']);
    if (pub > new Date()) return false;
  }
  return true;
}

export async function getPostBySlug(slug) {
  const s = String(slug || '').toLowerCase();
  const formula = `LOWER({Slug})='${s}'`;
  const params = new URLSearchParams({ filterByFormula: formula, maxRecords: '1' });
  const res = await fetch(`${BLOG_BASE_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable GET by slug failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  const rec = data.records?.[0];
  return rec ? { id: rec.id, ...rec.fields } : null;
}

export async function listPublicPosts(max = 24) {
  const formula = "AND({Status}='Published', IS_BEFORE({Publish Date}, NOW()))";
  const params = new URLSearchParams({
    filterByFormula: formula,
    maxRecords: String(max),
    'sort[0][field]': 'Publish Date',
    'sort[0][direction]': 'desc',
  });
  const res = await fetch(`${BLOG_BASE_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Airtable listPublicPosts failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return (json.records || []).map((r) => ({ id: r.id, ...r.fields }));
}

