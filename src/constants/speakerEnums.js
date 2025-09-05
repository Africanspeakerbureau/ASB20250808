// If your Apply/Admin already exports these, feel free to import from there
// and delete this file. These match your CSV spec (trimmed for typos/dupes).

export const SELECTS = {
  'Years Experience': [
    '1-3 years','4-5 years','5-10 years','10-15 years',
    '15-20 years','20-25 years','25 years +'
  ],
  'Speaking Experience': ['Beginner','Intermediate','Advanced','Expert','Experienced'],
  'Number of Events': ['1-5 events','6-10 events','11-20 events','21-50 events','51-100 events','100+ events'],
  'Largest Audience': ['1-50','51-200','201-500','500+'],
  'Virtual Experience': ['None','Limited','Moderate','Extensive','Experienced'],
  'Industry': [
    'Technology','Finance & Banking','Healthcare & Medical','Education','Government & Public Policy',
    'Non Profit and NGO','Energy and Mining','Agriculture & Food','Manufacturing','Telecommunications',
    'Transport & Logistics','Real Estate & Construction','Media & Entertainment','Tourism & Hospitality',
    'Retail and Consumer Goods','Legal Services','Consulting','Research and Development',
    'Arts and Cultures','IT & AI','Others'
  ],
  'Expertise Areas': [
    'Business / Management','Art / Culture','Cities / Environment','Economic  / Finance',
    'Facilitator / Moderator','Future / Technology','Government / Politics','Innovation / Creativity',
    'Leadership / Motivation','Society / Education','Celebrity','IT / AI'
  ],
  'Spoken Languages': [
    'English','French','German','Dutch','Spanish','Portuguese','Russian','Chinese','Hindi','Arabic',
    'Swahili','Amharic','Yoruba','Zulu','Afrikaans','Others'
  ],
  'Travel Willingness': ['Virtual Only','Local Only','Domestic','International'],
  'Fee Range General': ['$','$$','$$$','$$$$','$$$$$','On Request'],
  'Fee Range Local': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000',
    '$10 001 - $25 000','$25 001 - $50 000','$50 001 - $100 000',
    '$100 000+','On request (TBD)','On request'
  ],
  'Fee Range Continental': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000',
    '$10 001 - $25 000','$25 001 - $50 000','$50 001 - $100 000',
    '$100 000+','On request (TBD)','On request'
  ],
  'Fee Range International': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000',
    '$10 001 - $25 000','$25 001 - $50 000','$50 001 - $100 000',
    '$100 000+','On request (TBD)','On request'
  ],
  'Fee Range Virtual': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000',
    '$10 001 - $25 000','$25 001 - $50 000','$50 001 - $100 000',
    '$100 000+','On request (TBD)','On request'
  ],
  // Country: keep short for now; Phase-2 we’ll reuse your full list constant.
  'Country': [
    'South Africa','Nigeria','Kenya','Ghana','Egypt','Morocco','Ethiopia','Uganda','Rwanda','Tanzania',
    'United Kingdom','United States of America','Germany','France','Netherlands','India','United Arab Emirates','Others'
  ]
};

// Which fields are multi-selects
export const MULTI_FIELDS = new Set([
  'Expertise Areas','Spoken Languages'
]);

