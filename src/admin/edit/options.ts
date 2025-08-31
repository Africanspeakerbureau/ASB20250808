// Option lists for the admin edit dialog. If these exist elsewhere in the app, consider importing them instead of duplicating.

export const INDUSTRIES = [
  "Technology","Finance & Banking","Healthcare & Medical","Education","Government & Public Policy",
  "Non Profit and NGO","Energy and Mining","Agriculture & Food","Manufacturing","Telecommunications",
  "Transport & Logistics","Real Estate & Construction","Media & Entertainment","Tourism & Hospitality",
  "Retail and Consumer Goods","Legal Services","Consulting","Research and Development","Arts and Cultures","IT & AI","Others"
];

export const YEARS_EXPERIENCE = [
  "1-3 years","4-5 years","5-10 years","10-15 years","15-20 years","20-25 years","25 years +"
];

export const SPEAKING_EXPERIENCE = ["Beginner","Intermediate","Advanced","Expert"];
export const NUMBER_OF_EVENTS = ["1-5 events","6-10 events","11-20 events","21-50 events","51-100 events","100+ events"];
export const LARGEST_AUDIENCE = ["1-50","51-200","201-500","500+"];
export const VIRTUAL_EXPERIENCE = ["None","Limited","Moderate","Extensive"];

export const PRESENTATION_FORMAT = ["In-Person", "Virtual", "Hybrid"];

export const BUDGET_RANGE_USD = [
  "Less than $1 000 / R20 000",
  "$1 000 – $5 000",
  "$5 000 – $10 000",
  "$10 000 – $25 000",
  "$25 000 – $50 000",
  "$50 000+"
];

export const EXPERTISE_AREAS = [
  "Business / Management","Art / Culture","Cities / Environment","Economic / Finance",
  "Facilitator / Moderator","Future / Technology","Government / Politics","Innovation / Creativity",
  "Leadership / Motivation","Society / Education","Celebrity","IT / AI"
];

export const SPOKEN_LANGUAGES = [
  "English","French","German","Dutch","Spanish","Portuguese","Russian","Chinese","Hindi",
  "Arabic","Swahili","Amharic","Yoruba","Zulu","Afrikaans","Others"
];

// Reuse the existing long list of countries from the public speaker application form.
import fieldOptions from "@/FieldOptions";
export const COUNTRIES: string[] = fieldOptions['Speaker Applications']['Country'];

export const FEE_RANGE = [
  "$500-$1 000","$1 001-$2 500","$2 501-$5 000","$5 0001- $10 000",
  "$10 001 - $25 000","$25 001 - $50 000","$50 001 - $100 000","$100 000+"
];

export const FEE_RANGE_EXTENDED = [
  "$500-$1 000",
  "$1 001-$2 500",
  "$2 501-$5 000",
  "$5 0001- $10 000",
  "$10 001 - $25 000",
  "$25 001 - $50 000",
  "$50 001 - $100 000",
  "$100 000+",
  "On request (TBD)",
  "On request",
];

export const FEE_RANGE_GENERAL = ["$","$$","$$$","$$$$","$$$$$","On Request"];

export const TARGET_AUDIENCE = [
  "Board of Directors / Board Committees",
  "C-Suite / Executive Leadership Team",
  "Senior Leaders (VP/Director)",
  "Middle Management (People Managers)",
  "Frontline Supervisors",
  "Frontline Staff / Operators",
  "High-Potentials / Emerging Leaders (HiPo)",
  "Women in Leadership (ERGs / Networks)",
  "Youth / Graduates / Early Career",
  "Sales Organisation (AEs, SEs, CS, Partners)",
  "Product / Engineering / Tech & Data",
  "HR / People & Culture",
  "Finance / Strategy",
  "Marketing / Brand / Comms / CX",
  "Operations / Supply Chain / PMO",
  "Entrepreneurs / SMEs & Startups",
  "Government Executives / Public Sector Leaders",
  "Municipal / Local Government Leaders",
  "Development / NGO / Multilateral Teams",
  "Universities / Business Schools / Educators",
  "Healthcare Professionals",
  "Energy / Mining Teams",
];

export const DELIVERY_CONTEXT = [
  "Boardroom Advisory / Consulting",
  "Executive Leadership Programme / Academy Cohort",
  "Executive Offsite / Senior Getaway",
  "Succession / HiPo / OD Track",
  "Middle-Management Training (in-house)",
  "Frontline / Lower-Management Training",
  "Annual Leadership Conference / Town Hall",
  "Sales Kickoff / Sales Enablement (SKO)",
  "Executive Briefing Centre / External Organiser",
  "Keynote / Plenary — Workshop / Masterclass — Advisory (maps to your one-pager)",
  "Panel / Fireside / Moderation",
  "Coaching (1:1 / Team)",
  "Virtual Webinar / Studio",
];

export const TRAVEL_WILLINGNESS = ["Virtual Only","Local Only","Domestic","International"];
export const FEATURED = ["Yes","No","On review"];
export const STATUS = ["Pending","Under Review","Approved","Rejected","Featured","Published on Site"];

export const EXPERTISE_LEVEL = [
  "Entry Level","Mid Level","Senior Level","Executive Level","C-Suite","Board Level",
  "International Renown Expert","International Renown Trainer","Celebrity"
];

export const DISPLAY_FEE = ["Yes","No"];
