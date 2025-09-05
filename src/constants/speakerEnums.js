// Allowed options (must match Airtable exactly).
export const SELECTS = {
  'Years Experience': ['1-3 years','4-5 years','5-10 years','10-15 years','15-20 years','20-25 years','25 years +'],
  'Speaking Experience': ['Beginner','Intermediate','Advanced','Expert','Experienced'],
  'Number of Events': ['1-5 events','6-10 events','11-20 events','21-50 events','51-100 events','100+ events'],
  'Largest Audience': ['1-50','51-200','201-500','500+'],
  'Virtual Experience': ['None','Limited','Moderate','Extensive','Experienced'],
  'Industry': [
    'Technology','Finance & Banking','Healthcare & Medical','Education','Government & Public Policy','Non Profit and NGO',
    'Energy and Mining','Agriculture & Food','Manufacturing','Telecommunications','Transport & Logistics',
    'Real Estate & Construction','Media & Entertainment','Tourism & Hospitality','Retail and Consumer Goods',
    'Legal Services','Consulting','Research and Development','Arts and Cultures','IT & AI','Others'
  ],
  'Expertise Areas': [
    'Business / Management','Art / Culture','Cities / Environment','Economic  / Finance','Facilitator / Moderator',
    'Future / Technology','Government / Politics','Innovation / Creativity','Leadership / Motivation',
    'Society / Education','Celebrity','IT / AI'
  ],
  'Spoken Languages': [
    'English','French','German','Dutch','Spanish','Portuguese','Russian','Chinese','Hindi','Arabic','Swahili',
    'Amharic','Yoruba','Zulu','Afrikaans','Others'
  ],
  'Travel Willingness': ['Virtual Only','Local Only','Domestic','International'],
  'Fee Range General': ['$','$$','$$$','$$$$','$$$$$','On Request'],
  'Fee Range Local': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000','$10 001 - $25 000','$25 001 - $50 000',
    '$50 001 - $100 000','$100 000+','On request (TBD)','On request'
  ],
  'Fee Range Continental': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000','$10 001 - $25 000','$25 001 - $50 000',
    '$50 001 - $100 000','$100 000+','On request (TBD)','On request'
  ],
  'Fee Range International': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000','$10 001 - $25 000','$25 001 - $50 000',
    '$50 001 - $100 000','$100 000+','On request (TBD)','On request'
  ],
  'Fee Range Virtual': [
    '$500-$1 000','$1 001-$2 500','$2 501-$5 000','$5 0001- $10 000','$10 001 - $25 000','$25 001 - $50 000',
    '$50 001 - $100 000','$100 000+','On request (TBD)','On request'
  ],
  'Expertise Level': [
    'Entry Level','Mid Level','Senior Level','Executive Level','C-Suite',
    'Board Level','International Renown Expert','International Renown Trainer','Celebrity','Expert'
  ],
  'Country': [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
    'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia',
    'Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
    'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)',
    'Costa Rica','Croatia','Cuba','Cyprus','Czechia (Czech Republic)','Democratic Republic of the Congo','Denmark','Djibouti',
    'Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia',
    'Eswatini (fmr. "Swaziland")','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece',
    'Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Holy See','Honduras','Hungary','Iceland','India',
    'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait',
    'Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar',
    'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova',
    'Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (formerly Burma)','Namibia','Nauru','Nepal','Netherlands',
    'New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau',
    'Palestine State','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania',
    'Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
    'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
    'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden',
    'Switzerland','Syria','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia',
    'Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States of America',
    'Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
  ]
};

export const MULTI_FIELDS = new Set(['Expertise Areas','Spoken Languages']);
