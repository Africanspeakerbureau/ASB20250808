// Centralized field options for all forms
const fieldOptions = {
  'Speaker Applications': {
    'Industry': [
      'Technology',
      'Finance & Banking',
      'Healthcare & Medical',
      'Education',
      'Government & Public Policy',
      'Non Profit and NGO',
      'Energy and Mining',
      'Agriculture & Food',
      'Manufacturing',
      'Telecommunications',
      'Transport & Logistics',
      'Real Estate & Construction',
      'Media & Entertainment',
      'Tourism & Hospitality',
      'Retail and Consumer Goods',
      'Legal Services',
      'Consulting',
      'Research and Development',
      'Arts and Cultures',
      'IT & AI',
      'Others'
    ],
    'Years Experience': [
      '1-3 years',
      '4-5 years',
      '5-10 years',
      '10-15 years',
      '15-20 years',
      '20-25 years',
      '25 years +'
    ],
    'Speaking Experience': [
      'Beginner',
      'Intermediate',
      'Advanced',
      'Expert'
    ],
    'Number of Events': [
      '1-5 events',
      '6-10 events',
      '11-20 events',
      '21-50 events',
      '51-100 events',
      '100+ events'
    ],
    'Largest Audience': [
      'Under 50',
      '50-200',
      '200-500',
      '500+'
    ],
    'Virtual Experience': [
      'No experience',
      'Some experience',
      'Experienced',
      'Expert'
    ],
    'Fee Range': [
      '$500-$1 000',
      '$1 001-$2 500',
      '$2 501-$5 000',
      '$5 0001- $10 000',
      '$10 001 - $25 000',
      '$25 001 - $50 000',
      '$50 001 - $100 000',
      '$100 000+'
    ],
    'Travel Willingness': [
      'Virtual Only',
      'Local Only',
      'Domestic',
      'International'
    ],
    'Country': [
      'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon',
      'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of the Congo',
      'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia',
      'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
      'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia',
      'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
      'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
      'Zambia', 'Zimbabwe'
    ],
    'Expertise Level': [
      'Entry Level',
      'Junior Professional',
      'Mid-Level Professional',
      'Senior Professional',
      'Expert',
      'Industry Leader',
      'Thought Leader',
      'Global Authority',
      'Celebrity'
    ],
    'Company Size': [
      'Startup (1-10)',
      'Small (11-50)',
      'Medium (51-200)',
      'Large (201-1000)',
      'Enterprise (1000+)',
      'Government/NGO'
    ],
    'Spoken Languages': [
      'English', 'French', 'Arabic', 'Portuguese', 'Spanish', 'Swahili', 'Hausa', 'Yoruba',
      'Igbo', 'Amharic', 'Oromo', 'Zulu', 'Xhosa', 'Afrikaans', 'Somali', 'Berber', 'Wolof',
      'Lingala', 'Shona', 'Others'
    ],
    'Target Audience': [
      'Board of Directors / Board Committees',
      'C-Suite / Executive Leadership Team',
      'Senior Leaders (VP/Director)',
      'Middle Management (People Managers)',
      'Frontline Supervisors',
      'Frontline Staff / Operators',
      'High-Potentials / Emerging Leaders (HiPo)',
      'Women in Leadership (ERGs / Networks)',
      'Youth / Graduates / Early Career',
      'Sales Organisation (AEs, SEs, CS, Partners)',
      'Product / Engineering / Tech & Data',
      'HR / People & Culture',
      'Finance / Strategy',
      'Marketing / Brand / Comms / CX',
      'Operations / Supply Chain / PMO',
      'Entrepreneurs / SMEs & Startups',
      'Government Executives / Public Sector Leaders',
      'Municipal / Local Government Leaders',
      'Development / NGO / Multilateral Teams',
      'Universities / Business Schools / Educators',
      'Healthcare Professionals',
      'Energy / Mining Teams'
    ],
    'Delivery Context': [
      'Boardroom Advisory / Consulting',
      'Executive Leadership Programme / Academy Cohort',
      'Executive Offsite / Senior Getaway',
      'Succession / HiPo / OD Track',
      'Middle-Management Training (in-house)',
      'Frontline / Lower-Management Training',
      'Annual Leadership Conference / Town Hall',
      'Sales Kickoff / Sales Enablement (SKO)',
      'Executive Briefing Centre / External Organiser',
      'Keynote / Plenary — Workshop / Masterclass — Advisory (maps to your one-pager)',
      'Panel / Fireside / Moderation',
      'Coaching (1:1 / Team)',
      'Virtual Webinar / Studio'
    ],
    'Fee Range Local': [
      '$500-$1 000',
      '$1 001-$2 500',
      '$2 501-$5 000',
      '$5 0001- $10 000',
      '$10 001 - $25 000',
      '$25 001 - $50 000',
      '$50 001 - $100 000',
      '$100 000+',
      'On request (TBD)',
      'On request'
    ],
    'Fee Range Continental': [
      '$500-$1 000',
      '$1 001-$2 500',
      '$2 501-$5 000',
      '$5 0001- $10 000',
      '$10 001 - $25 000',
      '$25 001 - $50 000',
      '$50 001 - $100 000',
      '$100 000+',
      'On request (TBD)',
      'On request'
    ],
    'Fee Range International': [
      '$500-$1 000',
      '$1 001-$2 500',
      '$2 501-$5 000',
      '$5 0001- $10 000',
      '$10 001 - $25 000',
      '$25 001 - $50 000',
      '$50 001 - $100 000',
      '$100 000+',
      'On request (TBD)',
      'On request'
    ],
    'Fee Range Virtual': [
      '$500-$1 000',
      '$1 001-$2 500',
      '$2 501-$5 000',
      '$5 0001- $10 000',
      '$10 001 - $25 000',
      '$25 001 - $50 000',
      '$50 001 - $100 000',
      '$100 000+',
      'On request (TBD)',
      'On request'
    ],
    'Fee Range General': [
      '$',
      '$$',
      '$$$',
      '$$$$',
      '$$$$$',
      'On Request'
    ]
  },
  'Client Inquiries': {
    'Company Size': [
      'Startup (1-10)',
      'Small (11-50)',
      'Medium (51-200)',
      'Large (201-1000)',
      'Enterprise (1000+)',
      'Government/NGO'
    ],
    'Industry': [
      'Technology',
      'Finance & Banking',
      'Healthcare & Medical',
      'Education',
      'Government & Public Policy',
      'Non Profit and NGO',
      'Energy and Mining',
      'Agriculture & Food',
      'Manufacturing',
      'Telecommunications',
      'Transport & Logistics',
      'Real Estate & Construction',
      'Media & Entertainment',
      'Tourism & Hospitality',
      'Retail and Consumer Goods',
      'Legal Services',
      'Consulting',
      'Research and Development',
      'Arts and Cultures',
      'IT & AI',
      'Others'
    ],
    'Audience Size': [
      'Under 50',
      '50-200',
      '200-500',
      '500-1000',
      '1000+'
    ],
    'Budget Range': [
      'Under $5,000',
      '$5,000-$15,000',
      '$15,000-$50,000',
      '$50,000-$100,000',
      '$100,000+'
    ],
    'Presentation Format': [
      'Keynote',
      'Panel Discussion',
      'Workshop'
    ]
  },
  'Quick Inquiries': {
    // Quick inquiries typically don't have dropdown fields
    // but we can add them here if needed in the future
  }
}

export default fieldOptions

