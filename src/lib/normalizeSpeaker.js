export function normalizeSpeaker(record) {
  if (!record) return null;
  const f = record.fields || {};
  console.log(Object.keys(f || {}));

  const pickText = (k) => (typeof f[k] === 'string' ? f[k].trim() : '');
  const pickMulti = (k) => (Array.isArray(f[k]) ? f[k].filter(Boolean) : []);
  const pickAttachmentUrl = (k) =>
    Array.isArray(f[k]) && f[k][0] && f[k][0].url ? f[k][0].url : '';

  const firstName = pickText('First Name');
  const lastName = pickText('Last Name');
  const titlePrefix = pickText('Title');
  const professionalTitle = pickText('Professional Title');
  const name = [titlePrefix, firstName, lastName]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const languages = pickMulti('Spoken Languages');
  const travelWillingness = pickText('Travel Willingness');
  const feeDisplay = pickText('Display Fee');
  const feeRangeRaw = pickText('Fee Range');
  const feeRange = feeDisplay === 'No' ? 'On request' : feeRangeRaw || 'On request';

  const slugField = pickText('Slug');
  const slugBase = slugField || name || record.id;
  const slug = String(slugBase)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const speaker = {
    id: record.id,
    slug,
    firstName,
    lastName,
    titlePrefix,
    professionalTitle,
    name,
    title: professionalTitle,
    location: pickText('Location'),
    country: pickText('Country'),
    languages,
    spokenLanguages: languages,
    travelWillingness,
    availability: travelWillingness,
    expertiseAreas: pickMulti('Expertise Areas'),
    expertise: pickMulti('Expertise Areas'),
    speakingTopics: pickText('Speaking Topics'),
    keyMessages: pickText('Key Messages'),
    keyMessage: pickText('Key Messages'),
    bio: pickText('Professional Bio'),
    professionalBio: pickText('Professional Bio'),
    achievements: pickText('Achievements'),
    education: pickText('Education'),
    videos: [
      pickText('Video Link 1'),
      pickText('Video Link 2'),
      pickText('Video Link 3'),
    ].filter(Boolean),
    feeRange,
    fee: feeRange,
    profileImage: pickAttachmentUrl('Profile Image'),
    photoUrl: pickAttachmentUrl('Profile Image'),
    headerImage: pickAttachmentUrl('Header Image'),
    // Why booking fields
    whyListen: pickText('Why the audience should listen to these topics'),
    whatAddress: pickText('What the speeches will address'),
    whatLearn: pickText('What participants will learn'),
    whatTakeHome: pickText('What the audience will take home'),
    benefitsIndividual: pickText('Benefits for the individual'),
    benefitsOrganisation: pickText('Benefits for the organisation'),
    deliveryStyle: pickText("Speaker's delivery style"),
  };

  return speaker;
}
