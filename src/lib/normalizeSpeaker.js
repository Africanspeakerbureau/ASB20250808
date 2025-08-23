export function normalizeSpeaker(rec) {
  const f = (rec && rec.fields) || {};
  const toList = (v) =>
    Array.isArray(v)
      ? v.filter(Boolean)
      : typeof v === "string"
        ? v.split(/[;\n]+/).map(s => s.trim()).filter(Boolean)
        : [];

  return {
    id: rec.id,
    fullName: f["Full Name"] || `${f["First Name"] || ""} ${f["Last Name"] || ""}`.trim(),
    title: f["Title"] || f["Professional Title"] || "",
    country: f["Country"] || "",
    languages: f["Spoken Languages"] || f["Languages"] || [],
    availability: f["Availability"] || f["Travel Willingness"] || "International",
    feeRange: f["Fee Range"] || "On request (TBD)",
    expertiseAreas: f["Expertise Areas"] || [],
    keyMessages: f["Key Messages"] || "",
    speakingTopics: toList(f["Speaking Topics"]),
    videos: [f["Video Link 1"], f["Video Link 2"], f["Video Link 3"]].filter(Boolean),
    achievements: f["Achievements"] || "",
    notableAchievements: f["Notable Achievements"] || "",
    education: f["Education"] || "",
    talk: {
      deliveryStyle: f["Speakers Delivery Style"] || "",
      whyThisSpeaker: f["Why the audience should listen to these topics"] || "",
      willAddress: f["What the speeches will address"] || "",
      willLearn: f["What participants will learn"] || "",
      takeHome: f["What the audience will take home"] || "",
      benefitsIndividual: f["Benefits for the individual"] || "",
      benefitsOrganisation: f["Benefits for the organisation"] || "",
    },
  };
}
