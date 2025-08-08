// src/lib/airtable.js
const AIRTABLE_BASE_ID   = import.meta.env.VITE_AIRTABLE_BASE_ID   || 'apppWmiOseyJwQRcn';
const AIRTABLE_API_TOKEN = import.meta.env.VITE_AIRTABLE_API_TOKEN || '';
const AIRTABLE_ENDPOINT  = 'https://api.airtable.com/v0';

export async function fetchPublishedSpeakers() {
  if (!AIRTABLE_API_TOKEN) throw new Error('Missing VITE_AIRTABLE_API_TOKEN');

  // Table: Speaker Applications
  // Multi-select field: Status (includes "Published on Site")
  const url = new URL(`${AIRTABLE_ENDPOINT}/${AIRTABLE_BASE_ID}/Speaker%20Applications`);
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('maxRecords', '200');
  // find "Published on Site" inside multi-select Status via ARRAYJOIN
  url.searchParams.set('filterByFormula', `FIND("Published on Site", ARRAYJOIN({Status}))`);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${AIRTABLE_API_TOKEN}` }
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Airtable ${res.status}: ${t}`);
  }
  const data = await res.json();

  // Normalize to what the UI needs
  return (data.records || []).map(r => {
    const f = r.fields || {};
    // attachments: Profile Image, Header Image
    const profile = Array.isArray(f['Profile Image']) && f['Profile Image'][0]?.url;
    const header  = Array.isArray(f['Header Image'])  && f['Header Image'][0]?.url;
    const photoUrl = profile || header || '';

    const langs = Array.isArray(f['Spoken Languages']) ? f['Spoken Languages'] : (f['Spoken Languages'] ? [f['Spoken Languages']] : []);
    const expertise = Array.isArray(f['Expertise Areas']) ? f['Expertise Areas'] : (f['Expertise Areas'] ? [f['Expertise Areas']] : []);

    return {
      id: r.id,
      firstName: f['First Name'] || '',
      lastName:  f['Last Name']  || '',
      name:      `${f['Title'] ? f['Title'] + ' ' : ''}${f['First Name'] || ''} ${f['Last Name'] || ''}`.trim(),
      title:     f['Professional Title'] || '',
      location:  f['Location'] || '',
      country:   f['Country'] || '',
      languages: langs,
      keyMessage: (f['Key Messages'] || '').toString().trim(),
      expertise,
      feeRange:  f['Fee Range'] || '',
      photoUrl,
      // build a simple slug for /speaker/:slug if you need
      slug:      `${(f['First Name']||'').toLowerCase()}-${(f['Last Name']||'').toLowerCase()}`.replace(/[^a-z0-9\-]/g,'')
    };
  });
}

