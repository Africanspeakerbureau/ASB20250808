import { normalizeSpeaker } from './normalizeSpeaker';

const API_KEY =
  import.meta.env.VITE_AIRTABLE_API_KEY ||
  import.meta.env.AIRTABLE_API_KEY;
const BASE_ID =
  import.meta.env.VITE_AIRTABLE_BASE_ID ||
  import.meta.env.AIRTABLE_BASE_ID;
const API = `https://api.airtable.com/v0/${BASE_ID}`;
const TBL_SPEAKERS = encodeURIComponent('Speaker Applications');
const TBL_BLOG = encodeURIComponent(import.meta.env.VITE_AIRTABLE_TABLE_BLOG || 'Blog');
const BLOG_BASE_URL = `${API}/${TBL_BLOG}`;

function ensureEnv() {
  if (!BASE_ID || !API_KEY) {
    throw new Error(
      'Airtable env missing: VITE_AIRTABLE_BASE_ID/AIRTABLE_BASE_ID and VITE_AIRTABLE_API_KEY/AIRTABLE_API_KEY'
    );
  }
}

function toQuery(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    usp.set(k, String(v));
  });
  return usp.toString();
}

async function list(
  table,
  { filterByFormula, fields, pageSize = 50, sort, maxRecords } = {}
) {
  ensureEnv();
  const headers = { Authorization: `Bearer ${API_KEY}` };
  const params = {
    ...(filterByFormula ? { filterByFormula } : {}),
    ...(fields ? { fields } : {}),
    ...(pageSize ? { pageSize } : {}),
    ...(sort ? { sort } : {}),
    ...(maxRecords ? { maxRecords } : {})
  };
  const url = `${API}/${table}?${toQuery(params)}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Airtable ${res.status}: ${t}`);
  }
  const json = await res.json();
  return json.records || [];
}

const PUBLISHED = "FIND('Published on Site', ARRAYJOIN({Status}))";
const APPROVED = "FIND('Approved', ARRAYJOIN({Status}))";

export async function fetchFeaturedSpeakers(limit = 3) {
  const filterByFormula = `AND(${PUBLISHED}, {Featured}='Yes')`;
  const records = await list(TBL_SPEAKERS, {
    filterByFormula,
    maxRecords: limit,
    pageSize: limit
  });
  return records.map(normalizeSpeaker);
}

export async function fetchPublishedSpeakers({
  limit = 8,
  excludeFeatured = false
} = {}) {
  const exclude = excludeFeatured ? ", {Featured}!='Yes'" : '';
  const filterByFormula = `AND(${PUBLISHED}${exclude})`;
  const records = await list(TBL_SPEAKERS, {
    filterByFormula,
    maxRecords: limit,
    pageSize: limit
  });
  return records.map(normalizeSpeaker);
}

export async function fetchAllPublishedSpeakers({ limit = 15 } = {}) {
  const filterByFormula = `AND(${PUBLISHED})`;
  const records = await list(TBL_SPEAKERS, {
    filterByFormula,
    maxRecords: limit,
    pageSize: limit
  });
  return records.map(normalizeSpeaker);
}

/**
 * Fetch ALL Approved + Published speakers by paging Airtable with `offset`.
 * Reuses the SAME filter formula and mapping as other helpers in this file.
 * Returns an array of normalized speaker objects.
 */
export async function fetchAllApprovedPublishedSpeakers({ pageSize = 100, max = 5000 } = {}) {
  const filterByFormula = `AND(${APPROVED}, ${PUBLISHED})`;
  let all = [];
  let offset = '';
  let guard = 0;
  ensureEnv();
  const headers = { Authorization: `Bearer ${API_KEY}` };
  do {
    const params = new URLSearchParams();
    params.set('pageSize', String(pageSize));
    params.set('filterByFormula', filterByFormula);
    if (offset) params.set('offset', offset);
    const url = `${API}/${TBL_SPEAKERS}?${params.toString()}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Airtable ${res.status}: ${t}`);
    }
    const json = await res.json();
    const rows = (json.records || []).map(normalizeSpeaker);
    all = all.concat(rows);
    offset = json.offset || '';
    guard += 1;
    if (all.length >= max || guard > 200) break;
  } while (offset);
  return all;
}

async function query(table, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/${encodeURIComponent(table)}?${qs}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return (json.records || []).map((r) => ({ id: r.id, createdTime: r.createdTime, ...r.fields }));
}

export const getSpeakerApplications = (opts = {}) =>
  query('Speaker Applications', { view: 'Grid view', maxRecords: 200, ...opts });
export const getClientInquiries = (opts = {}) =>
  query('Client Inquiries', { view: 'Grid view', maxRecords: 200, ...opts });
export const getQuickInquiries = (opts = {}) =>
  query('Quick Inquiries', { view: 'Grid view', maxRecords: 200, ...opts });


export async function getSpeakerById(recordId) {
  ensureEnv();
  const res = await fetch(`${API}/${TBL_SPEAKERS}/${recordId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateSpeaker(recordId, fields) {
  ensureEnv();
  const res = await fetch(`${API}/${TBL_SPEAKERS}/${recordId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function blogAt(method, path = '', body) {
  const res = await fetch(`${BLOG_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
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

// ---- Blog helpers ----
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
    headers: { Authorization: `Bearer ${API_KEY}` }
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
    'sort[0][direction]': 'desc'
  });
  const res = await fetch(`${BLOG_BASE_URL}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Airtable listPublicPosts failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  const rows = (data.records || []).map(r => ({ id: r.id, ...r.fields }));
  // Featured & Pin Order first (client-side)
  rows.sort((a, b) => {
    const fa = a.Featured ? 1 : 0;
    const fb = b.Featured ? 1 : 0;
    if (fb - fa) return fb - fa;
    const pa = Number(a['Pin Order'] || 0);
    const pb = Number(b['Pin Order'] || 0);
    if (pa !== pb) return pa - pb;
    return new Date(b['Publish Date'] || 0).getTime() - new Date(a['Publish Date'] || 0).getTime();
  });
  return rows;
}
