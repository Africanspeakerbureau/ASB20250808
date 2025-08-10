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

// --- helpers --------------------------------------------------------------
const arr = (v) => (Array.isArray(v) ? v.filter(Boolean) : v ? [v] : []);
const firstAsset = (files) => (Array.isArray(files) && files[0] ? files[0] : null);
const txt = (v) => (typeof v === 'string' ? v.trim() : '');
const yes = (v) => String(v || '').toLowerCase() === 'yes';
// -------------------------------------------------------------------------

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

export function mapSpeakerRecord({ id, fields }) {
  // Names
  const titlePrefix = txt(fields['Title']);
  const firstName =
    txt(fields['First Name']) || txt(fields['firstName']) || txt(fields['First']);
  const lastName =
    txt(fields['Last Name']) || txt(fields['lastName']) || txt(fields['Last']);
  const professionalTitle =
    txt(fields['Professional Title']) || txt(fields['title']) || txt(fields['Role']) || '';

  const fullName =
    txt(fields['Full Name']) ||
    [titlePrefix, firstName, lastName].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  // Images
  const headerImage = firstAsset(fields['Header Image'] || fields['headerImage']);
  const profileImage = firstAsset(fields['Profile Image'] || fields['profileImage']);

  // Chips (order: languages → country → travel → fee)
  const spokenLanguages = arr(fields['Spoken Languages'] || fields['spokenLanguages']);
  const country = txt(fields['Country'] || fields['country']);
  const travel =
    txt(fields['Travel Willingness'] || fields['availability'] || fields['travel']);
  const feeRange = txt(fields['Fee Range'] || fields['feeRange']);
  const displayFee = yes(fields['Display Fee']);

  // Content blocks
  const keyMessages = txt(fields['Key Messages']);
  const professionalBio = txt(fields['Professional Bio'] || fields['professionalBio']);
  const achievements = txt(fields['Achievements']);
  const education = txt(fields['Education']);

  // Topics & expertise
  const speakingTopics = txt(fields['Speaking Topics'])
    ? txt(fields['Speaking Topics'])
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : arr(fields['speakingTopics']); // tolerate array if present
  const expertiseAreas = arr(fields['Expertise Areas'] || fields['expertise']);

  // Quick facts: Location (optional; not in chips)
  const location = txt(fields['Location'] || fields['City'] || fields['location']);

  // Media
  const videoLinks = [
    fields['Video Link 1'],
    fields['Video Link 2'],
    fields['Video Link 3'],
  ].filter(Boolean);

  // Persuasion / Why-book
  const deliveryStyle = txt(fields['Speakers Delivery Style']);
  const whyListen = txt(fields['Why the audience should listen to these topics']);
  const whatAddress = txt(fields['What the speeches will address']);
  const whatLearn = txt(fields['What participants will learn']);
  const whatTakeHome = txt(fields['What the audience will take home']);
  const benefitsIndividual = txt(fields['Benefits for the individual']);
  const benefitsOrganisation = txt(fields['Benefits for the organisation']);

  return {
    id,
    headerImage,
    profileImage,

    titlePrefix,
    firstName,
    lastName,
    fullName:
      fullName || [titlePrefix, firstName, lastName].filter(Boolean).join(' ').trim(),
    professionalTitle,

    spokenLanguages,
    country,
    travel,
    feeRange,
    displayFee,
    location,

    keyMessages,
    professionalBio,
    achievements,
    education,
    speakingTopics,
    expertiseAreas,

    videoLinks,

    deliveryStyle,
    whyListen,
    whatAddress,
    whatLearn,
    whatTakeHome,
    benefitsIndividual,
    benefitsOrganisation,
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

export async function getSpeakerById(id) {
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

  async function fetchOne(table) {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}/${id}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (res.status === 404) throw new Error('not-found');
    if (!res.ok) throw new Error(`airtable:${res.status}`);
    const rec = await res.json();
    return mapSpeakerRecord(rec);
  }

  try {
    return await fetchOne('Published Speakers');
  } catch (e) {
    if (e.message !== 'not-found')
      console.warn('Published fetch failed, trying Applications', e);
    return await fetchOne('Speaker Applications');
  }
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

