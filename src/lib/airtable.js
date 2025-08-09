const API_KEY =
  import.meta.env.VITE_AIRTABLE_API_KEY ||
  import.meta.env.AIRTABLE_API_KEY;
const BASE_ID =
  import.meta.env.VITE_AIRTABLE_BASE_ID ||
  import.meta.env.AIRTABLE_BASE_ID;
const API = `https://api.airtable.com/v0/${BASE_ID}`;
const TBL_SPEAKERS = encodeURIComponent('Speaker Applications');

export function toSlug(str = '') {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

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

function mapSpeaker(r) {
  const f = r.fields || {};
  const image = Array.isArray(f['Profile Image']) ? f['Profile Image'][0]?.url : '';
  const title = f['Title'] ? String(f['Title']).trim() : '';
  const first = f['First Name'] ? String(f['First Name']).trim() : '';
  const last = f['Last Name'] ? String(f['Last Name']).trim() : '';
  const name = [title, first, last].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  const slugBase = f['Slug'] || f['Full Name'] || name || `${first}-${last}` || r.id;
  const slug = toSlug(slugBase);

  return {
    id: r.id,
    name,
    firstName: first,
    lastName: last,
    title: f['Professional Title'] || '',
    location: f['Location'] || '',
    country: f['Country'] || '',
    spokenLanguages: f['Spoken Languages'] || [],
    expertise: f['Expertise Areas'] || [],
    keyMessage: f['Key Messages'] || '',
    feeRange: f['Fee Range'] || '',
    photoUrl: image || '',
    featured: f['Featured'] === 'Yes',
    status: f['Status'] || [],
    slug
  };
}

const PUBLISHED = "FIND('Published on Site', ARRAYJOIN({Status}))";

export async function fetchFeaturedSpeakers(limit = 3) {
  const filterByFormula = `AND(${PUBLISHED}, {Featured}='Yes')`;
  const records = await list(TBL_SPEAKERS, {
    filterByFormula,
    maxRecords: limit,
    pageSize: limit
  });
  return records.map(mapSpeaker);
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
  return records.map(mapSpeaker);
}

export async function fetchAllPublishedSpeakers({ limit = 15 } = {}) {
  const filterByFormula = `AND(${PUBLISHED})`;
  const records = await list(TBL_SPEAKERS, {
    filterByFormula,
    maxRecords: limit,
    pageSize: limit
  });
  return records.map(mapSpeaker);
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

