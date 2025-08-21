export function normalizeSpeaker(record = {}) {
  try {
    const f = record.fields || {};

    const pickText = (k) => (typeof f[k] === 'string' ? f[k].trim() : '');
    const pickMulti = (k) => (Array.isArray(f[k]) ? f[k].filter(Boolean) : []);
    const pickAttachmentUrl = (k) =>
      Array.isArray(f[k]) && f[k][0] && f[k][0].url ? f[k][0].url : '';

    const firstName = pickText('First Name');
    const lastName = pickText('Last Name');
    const titlePrefix = pickText('Title');
    const professionalTitle = pickText('Professional Title');
    const fullName = pickText('Full Name') || [firstName, lastName].filter(Boolean).join(' ');
    const name = [titlePrefix, fullName].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

    const languages = pickMulti('Spoken Languages');
    const travelWillingness = pickText('Travel Willingness');
    const feeDisplay = pickText('Display Fee');
    const feeRangeRaw = pickText('Fee Range');
    const feeRange = feeDisplay === 'No' ? 'On request' : feeRangeRaw || 'On request';

    const slugBase = pickText('Slug') || fullName || record.id;
    const slug = String(slugBase || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const statusRaw = f['Status'];
    const status = Array.isArray(statusRaw)
      ? statusRaw
      : statusRaw
      ? [statusRaw]
      : [];

    const speaker = {
      id: record.id,
      slug,
      status,
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
      speakingTopics: (() => {
        const v = f['Speaking Topics'];
        if (Array.isArray(v)) return v.filter(Boolean);
        return String(v ?? '')
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      })(),
      keyMessages: (() => {
        const v = f['Key Messages'];
        if (Array.isArray(v)) return v.filter(Boolean);
        const lines = String(v ?? '')
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);
        return lines;
      })(),
      keyMessage: (() => {
        const arr = Array.isArray(f['Key Messages'])
          ? f['Key Messages']
          : String(f['Key Messages'] ?? '')
              .split(/\r?\n/)
              .map((s) => s.trim())
              .filter(Boolean);
        return arr[0] || '';
      })(),
      bio: pickText('Professional Bio'),
      professionalBio: pickText('Professional Bio'),
      achievements: pickText('Achievements'),
      education: pickText('Education'),
      videos: [pickText('Video Link 1'), pickText('Video Link 2'), pickText('Video Link 3')].filter(Boolean),
      feeRange,
      fee: feeRange,
      profileImage: pickAttachmentUrl('Profile Image'),
      photoUrl: pickAttachmentUrl('Profile Image'),
      headerImage: pickAttachmentUrl('Header Image'),
      featured: pickText('Featured') === 'Yes',
      whyListen: pickText('Why the audience should listen to these topics'),
      whatAddress: pickText('What the speeches will address'),
      whatLearn: pickText('What participants will learn'),
      whatTakeHome: pickText('What the audience will take home'),
      benefitsIndividual: pickText('Benefits for the individual'),
      benefitsOrganisation: pickText('Benefits for the organisation'),
      deliveryStyle: pickText("Speaker's delivery style"),
    };

    return speaker;
  } catch (e) {
    console.warn('normalizeSpeaker failed', e);
    return {
      id: record?.id || '',
      slug: '',
      status: [],
    };
  }
}
