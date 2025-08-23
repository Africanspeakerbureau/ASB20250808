// Basic slugification used across admin and site
export const basicSlugify = (s = '') =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Normalizes a speaker Airtable record safely.
export function normalizeSpeaker(rec) {
  const f = (rec && rec.fields) || {};
  const arr = v => (Array.isArray(v) ? v : v ? [v] : []);
  const first = a => (Array.isArray(a) && a.length ? a[0] : undefined);

  const profAtt = first(arr(f['Profile Image']));
  const headerAtt = first(arr(f['Header Image']));

  const photoUrl =
    profAtt?.thumbnails?.large?.url ||
    profAtt?.url ||
    ''; // leave empty -> UI shows built-in “No image” tile

  const headerUrl =
    headerAtt?.thumbnails?.large?.url ||
    headerAtt?.url ||
    '';

  const video1 = f['Video Link 1'] || '';
  const video2 = f['Video Link 2'] || '';
  const video3 = f['Video Link 3'] || '';

  const firstName = (f['First Name'] || '').trim();
  const lastName  = (f['Last Name'] || '').trim();
  const fullName  = (f['Full Name'] || `${firstName} ${lastName}`).trim();

  const slugFormula = (f['Slug'] || '').toString().trim();
  const slugOverride = (f['Slug Override'] || '').toString().trim();
  // canonical slug used everywhere
  const slug = (slugOverride || slugFormula || basicSlugify(fullName)).trim();

  const status = arr(f['Status']).map(s => s?.name || s);
  const featuredSelect = f['Featured']?.name || f['Featured'];
  const featured = (featuredSelect === 'Yes') || status.includes('Featured');

  const languages = arr(f['Spoken Languages']).map(s => s?.name || s);
  const country = (typeof f['Country'] === 'string')
    ? f['Country']
    : f['Country']?.name || f['Location'] || '';
  const expertiseAreas = arr(f['Expertise Areas']).map(s => s?.name || s);

  return {
    id: rec.id,
    slug,
    slugFormula,
    slugOverride,
    name: fullName,
    fullName,
    firstName,
    lastName,
    title: f['Professional Title'] || '',
    professionalTitle: f['Professional Title'] || '',
    company: f['Company'] || '',
    country,
    languages,
    spokenLanguages: languages,
    expertiseAreas,
    featured,
    photoUrl,
    headerUrl,
    videos: [video1, video2, video3].filter(Boolean),

    // detail fields (kept so profile page has data)
    keyMessages: (f['Key Messages'] || '').trim(),
    keyMessage: (f['Key Messages'] || '').trim(),
    bio: f['Professional Bio'] || '',
    achievements: (f['Achievements'] || '').trim(),
    education: (f['Education'] || '').trim(),
    feeRange:
      f['Fee Range'] ||
      (f['Display Fee'] === 'Yes' ? (f['Fee Range'] || '') : 'On request'),
    availability: f['Travel Willingness'] || 'International',
    travelWillingness: f['Travel Willingness'] || 'International',
    topics: f['Speaking Topics'] || '',
    whatYoullGet: {
      deliveryStyle: (f['Speakers Delivery Style'] || '').trim(),
      whyThisSpeaker:
        (f['Why the audience should listen to these topics'] || '').trim(),
      willAddress: (f['What the speeches will address'] || '').trim(),
      willLearn: (f['What participants will learn'] || '').trim(),
      takeHome: (f['What the audience will take home'] || '').trim(),
      benefitsIndividual: (f['Benefits for the individual'] || '').trim(),
      benefitsOrganisation: (f['Benefits for the organisation'] || '').trim(),
    },
    speakingTopics: splitTopics(f['Speaking Topics']),
    location: f['Location'] || '',
  };
}

function splitTopics(raw) {
  if (!raw) return [];
  // Split on bullets, semicolons, or newlines; keep meaningful items.
  const parts = String(raw)
    .split(/[\n•;]+/g)
    .map(s => s.trim())
    .filter(Boolean);
  return parts;
}
