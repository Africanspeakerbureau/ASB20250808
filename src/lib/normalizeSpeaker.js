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

  const firstName = (f['First Name'] || '').trim();
  const lastName  = (f['Last Name'] || '').trim();
  const fullName  = (f['Full Name'] || `${firstName} ${lastName}`).trim();

  // Slug from field, else predictable fallback
  const rawSlug = (f['Slug'] || '').toString().trim();
  const slug = rawSlug
    ? rawSlug
    : fullName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

  const status = arr(f['Status']).map(s => s?.name || s);
  const featuredSelect = f['Featured']?.name || f['Featured'];
  const featured = (featuredSelect === 'Yes') || status.includes('Featured');

  const languages = arr(f['Spoken Languages']).map(s => s?.name || s);
  const country = (typeof f['Country'] === 'string')
    ? f['Country']
    : f['Country']?.name || f['Location'] || '';

  return {
    id: rec.id,
    slug,
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
    featured,
    photoUrl,
    headerUrl,

    // detail fields (kept so profile page has data)
    keyMessages: f['Key Messages'] || '',
    keyMessage: f['Key Messages'] || '',
    bio: f['Professional Bio'] || '',
    achievements: f['Achievements'] || '',
    education: f['Education'] || '',
    feeRange: f['Fee Range'] || '',
    availability: f['Travel Willingness'] || '',
    travelWillingness: f['Travel Willingness'] || '',
    topics: f['Speaking Topics'] || '',
    speakingTopics: f['Speaking Topics'] || '',
    location: f['Location'] || '',
  };
}
