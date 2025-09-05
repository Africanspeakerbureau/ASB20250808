const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
export const SPEAKER_TABLE =
  import.meta.env.VITE_AIRTABLE_SPEAKER_TABLE || 'Speaker Applications';

const BASE = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

function buildURL(table, params = {}) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) usp.set(k, String(v));
  }
  // Encode ONLY the table segment, never the entire path with query
  return `${BASE}/${encodeURIComponent(table)}?${usp.toString()}`;
}

async function atFetch(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`, // PAT or legacy key
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${res.status}: ${text}`);
  }
  return res.json();
}

// Find 1 speaker by Email
export async function findSpeakerByEmail(email) {
  // escape any quotes inside the email for Airtable formula
  const safeEmail = String(email).replace(/"/g, '\\"');
  const formula = `{Email} = "${safeEmail}"`;
  const url = buildURL(SPEAKER_TABLE, {
    maxRecords: 1,
    filterByFormula: formula,
  });
  const json = await atFetch(url);
  return json.records?.[0] || null;
}

// Update a speaker record
export async function updateSpeakerRecord(recordId, fields) {
  const url = `${BASE}/${encodeURIComponent(SPEAKER_TABLE)}/${recordId}`;
  return atFetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ fields }),
  });
}

