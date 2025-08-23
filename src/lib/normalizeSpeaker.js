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
  const val = k => (f[k] ?? '').toString().trim();
  const arr = k => (Array.isArray(f[k]) ? f[k] : f[k] ? [f[k]] : []);
  const first = a => (Array.isArray(a) && a.length ? a[0] : undefined);

  const profAtt = first(arr('Profile Image'));
  const headerAtt = first(arr('Header Image'));

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

  const status = arr('Status').map(s => s?.name || s);
  const featuredSelect = f['Featured']?.name || f['Featured'];
  const featured = (featuredSelect === 'Yes') || status.includes('Featured');

  const languages = arr('Spoken Languages').map(s => s?.name || s);
  const country = (typeof f['Country'] === 'string')
    ? f['Country']
    : f['Country']?.name || f['Location'] || '';
  const expertiseAreas = arr('Expertise Areas').map(s => s?.name || s);

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
    keyMessages: val('Key Messages'),
    keyMessage: val('Key Messages'),
    bio: val('Professional Bio'),
    achievements: val('Achievements'),
    education: val('Education'),
    feeRange: val('Fee Range'),
    availability: val('Travel Willingness') || val('Availability'),
    travelWillingness: val('Travel Willingness'),
    topics: val('Speaking Topics'),
    speakingTopics: val('Speaking Topics'),
    location: val('Location'),
    // New “What You’ll Get” fields
    deliveryStyle: val('Speakers Delivery Style'),
    whyListen: val('Why the audience should listen to these topics'),
    willAddress: val('What the speeches will address'),
    willLearn: val('What participants will learn'),
    takeHome: val('What the audience will take home'),
    benefitsIndividual: val('Benefits for the individual'),
    benefitsOrganisation: val('Benefits for the organisation'),
    // Track record split
    notableAchievements: val('Notable Achievements'),
  };
}
