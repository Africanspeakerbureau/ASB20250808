const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
// Table name used across the site
export const SPEAKER_TABLE = import.meta.env.VITE_AIRTABLE_SPEAKER_TABLE || 'Speaker Applications';

const API = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

async function atFetch(path, init = {}) {
  const res = await fetch(`${API}/${encodeURIComponent(path)}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable ${res.status}: ${text}`);
  }
  return res.json();
}

export async function findSpeakerByEmail(email) {
  const formula = encodeURIComponent(`{Email} = "${email}"`);
  const json = await atFetch(`${encodeURIComponent(SPEAKER_TABLE)}?maxRecords=1&filterByFormula=${formula}`);
  if (!json.records?.length) return null;
  return json.records[0]; // {id, fields}
}

export async function updateSpeakerRecord(recordId, fields) {
  // fields is a plain object with Airtable field names
  return atFetch(`${encodeURIComponent(SPEAKER_TABLE)}/${recordId}`, {
    method: 'PATCH',
    body: JSON.stringify({ fields })
  });
}
