import { normalizeSpeaker } from './normalizeSpeaker';

const API_KEY =
  import.meta.env.VITE_AIRTABLE_API_KEY ||
  import.meta.env.AIRTABLE_API_KEY;
const BASE_ID =
  import.meta.env.VITE_AIRTABLE_BASE_ID ||
  import.meta.env.AIRTABLE_BASE_ID;
const API = `https://api.airtable.com/v0/${BASE_ID}`;
const TBL_SPEAKERS = encodeURIComponent('Speaker Applications');

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
