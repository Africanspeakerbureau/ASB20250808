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
  const fields = (rec && rec.fields) || {};
  const val = (k) => (fields[k] ?? '').toString().trim();
  const arr = (k) => (Array.isArray(fields[k]) ? fields[k] : fields[k] ? [fields[k]] : []);
  const first = (a) => (Array.isArray(a) && a.length ? a[0] : undefined);

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

  const video1 = fields['Video Link 1'] || '';
  const video2 = fields['Video Link 2'] || '';
  const video3 = fields['Video Link 3'] || '';

  const firstName = (fields['First Name'] || '').trim();
  const lastName = (fields['Last Name'] || '').trim();
  const fullName = (fields['Full Name'] || `${firstName} ${lastName}`).trim();

  const slugFormula = (fields['Slug'] || '').toString().trim();
  const slugOverride = (fields['Slug Override'] || '').toString().trim();
  // canonical slug used everywhere
  const slug = (slugOverride || slugFormula || basicSlugify(fullName)).trim();

  const status = arr('Status').map((s) => s?.name || s);
  const featuredSelect = fields['Featured']?.name || fields['Featured'];
  const featured = featuredSelect === 'Yes' || status.includes('Featured');

  const expertiseAreas = Array.isArray(fields['Expertise Areas'])
    ? fields['Expertise Areas']
    : fields['Expertise Areas']
    ? String(fields['Expertise Areas'])
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const languagesChips = Array.isArray(fields['Spoken Languages'])
    ? fields['Spoken Languages']
    : fields['Spoken Languages']
    ? String(fields['Spoken Languages'])
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const languages = languagesChips;

  const country = fields['Country'] || '';
  const availability = fields['Travel Willingness'] || fields['Availability'] || '';
  const feeRange = fields['Fee Range'] || '';

  // "What You'll Get" fields
  const keyMessages = fields['Key Messages'] || '';
  const deliveryStyle = fields['Speakers Delivery Style'] || '';
  const whyThisSpeaker = fields['Why the audience should listen to these topics'] || '';
  const willAddress = fields['What the speeches will address'] || '';
  const participantsWillLearn = fields['What participants will learn'] || '';
  const audienceTakeaways = fields['What the audience will take home'] || '';
  const benefitsIndividual = fields['Benefits for the individual'] || '';
  const benefitsOrganisation = fields['Benefits for the organisation'] || '';
  const speakingTopics = fields['Speaking Topics'] || '';

  // Track record fields
  const notableAchievements = fields['Notable Achievements'] || '';
  const achievements = fields['Achievements'] || '';
  const education = fields['Education'] || '';

  return {
    id: rec.id,
    slug,
    slugFormula,
    slugOverride,
    name: fullName,
    fullName,
    firstName,
    lastName,
    title: fields['Professional Title'] || '',
    professionalTitle: fields['Professional Title'] || '',
    company: fields['Company'] || '',
    country,
    languages,
    spokenLanguages: languages,
    languagesChips,
    expertiseAreas,
    featured,
    photoUrl,
    headerUrl,
    videos: [video1, video2, video3].filter(Boolean),

    // detail fields (kept so profile page has data)
    keyMessages,
    keyMessage: keyMessages,
    deliveryStyle,
    whyThisSpeaker,
    willAddress,
    participantsWillLearn,
    audienceTakeaways,
    benefitsIndividual,
    benefitsOrganisation,
    speakingTopics,
    bio: val('Professional Bio'),
    achievements,
    education,
    notableAchievements,
    feeRange,
    availability,
    travelWillingness: val('Travel Willingness'),
    topics: speakingTopics,
    location: val('Location'),
  };
}
