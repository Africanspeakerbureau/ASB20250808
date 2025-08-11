export type FieldKind = "text"|"textarea"|"email"|"url"|"phone"|"single"|"multi"|"date"|"attachments";

export type FieldDef = {
  key: string;                // Airtable column name (exact)
  label: string;              // UI label
  kind: FieldKind;
  tab: string;                // which tab/section to render in
  placeholder?: string;
  help?: string;
  readonly?: boolean;
};

export const SPEAKER_TABS = [
  "Identity","Background","Experience","Expertise & Content",
  "Why booking","Media & Languages","Logistics & Fees","Contact & Admin"
] as const;

export const SPEAKER_FIELDS: FieldDef[] = [
  // Identity
  { key: "First Name", label: "First Name", kind:"text", tab:"Identity" },
  { key: "Last Name", label: "Last Name", kind:"text", tab:"Identity" },
  { key: "Title", label: "Title (Dr/Prof)", kind:"text", tab:"Identity" },
  { key: "Professional Title", label: "Professional Title", kind:"text", tab:"Identity" },
  { key: "Company", label: "Company/Organization", kind:"text", tab:"Identity" },
  { key: "Location", label: "Location", kind:"text", tab:"Identity" },
  { key: "Country", label: "Country", kind:"single", tab:"Identity" },
  { key: "Profile Image", label: "Profile Image (attachment URL)", kind:"attachments", tab:"Identity" },
  { key: "Header Image", label: "Header Image (attachment URL)", kind:"attachments", tab:"Identity" },

  // Background
  { key: "Industry", label: "Industry", kind:"single", tab:"Background" },
  { key: "Expertise Level", label: "Expertise Level", kind:"single", tab:"Background" },
  { key: "Years Experience", label: "Years of Experience", kind:"single", tab:"Background" },
  { key: "Notable Achievements", label: "Notable Achievements", kind:"text", tab:"Background" },
  { key: "Achievements", label: "Achievements", kind:"textarea", tab:"Background" },
  { key: "Education", label: "Education", kind:"textarea", tab:"Background" },

  // Experience
  { key: "Speaking Experience", label:"Speaking Experience Level", kind:"single", tab:"Experience" },
  { key: "Number of Events", label:"Number of Speaking Events", kind:"single", tab:"Experience" },
  { key: "Largest Audience", label:"Largest Audience Size", kind:"single", tab:"Experience" },
  { key: "Virtual Experience", label:"Virtual Speaking Experience", kind:"single", tab:"Experience" },

  // Expertise & Content
  { key: "Expertise Areas", label:"Expertise Areas", kind:"multi", tab:"Expertise & Content" },
  { key: "Speaking Topics", label:"Speaking Topics", kind:"textarea", tab:"Expertise & Content" },
  { key: "Key Messages", label:"Key Messages", kind:"textarea", tab:"Expertise & Content" },
  { key: "Professional Bio", label:"Professional Bio", kind:"textarea", tab:"Expertise & Content" },

  // Why booking
  { key:"Speakers Delivery Style", label:"Speaker’s Delivery Style", kind:"textarea", tab:"Why booking" },
  { key:"Why the audience should listen to these topics", label:"Why the audience should listen", kind:"textarea", tab:"Why booking" },
  { key:"What the speeches will address", label:"What the speeches will address", kind:"textarea", tab:"Why booking" },
  { key:"What participants will learn", label:"What participants will learn", kind:"textarea", tab:"Why booking" },
  { key:"What the audience will take home", label:"What the audience will take home", kind:"textarea", tab:"Why booking" },
  { key:"Benefits for the individual", label:"Benefits for the individual", kind:"textarea", tab:"Why booking" },
  { key:"Benefits for the organisation", label:"Benefits for the organisation", kind:"textarea", tab:"Why booking" },

  // Media & Languages
  { key:"Video Link 1", label:"Video Link 1", kind:"url", tab:"Media & Languages" },
  { key:"Video Link 2", label:"Video Link 2", kind:"url", tab:"Media & Languages" },
  { key:"Video Link 3", label:"Video Link 3", kind:"url", tab:"Media & Languages" },
  { key:"Spoken Languages", label:"Spoken Languages", kind:"multi", tab:"Media & Languages" },

  // Logistics & Fees
  { key:"Fee Range", label:"Fee Range (USD)", kind:"single", tab:"Logistics & Fees" },
  { key:"Display Fee", label:"Display Fee on site?", kind:"single", tab:"Logistics & Fees" },
  { key:"Travel Willingness", label:"Travel Willingness", kind:"single", tab:"Logistics & Fees" },
  { key:"Travel Requirements", label:"Travel Requirements", kind:"textarea", tab:"Logistics & Fees" },

  // Contact & Admin
  { key:"Website", label:"Website", kind:"url", tab:"Contact & Admin" },
  { key:"LinkedIn Profile", label:"LinkedIn Profile", kind:"url", tab:"Contact & Admin" },
  { key:"Twitter Profile", label:"Twitter/X Profile", kind:"url", tab:"Contact & Admin" },
  { key:"References", label:"References", kind:"textarea", tab:"Contact & Admin" },
  { key:"PA Name", label:"PA Name", kind:"text", tab:"Contact & Admin" },
  { key:"PA Email", label:"PA Email", kind:"email", tab:"Contact & Admin" },
  { key:"PA Phone", label:"PA Phone", kind:"phone", tab:"Contact & Admin" },
  { key:"Banking Details", label:"Banking Details", kind:"textarea", tab:"Contact & Admin" },
  { key:"Special Requirements", label:"Special Requirements", kind:"textarea", tab:"Contact & Admin" },
  { key:"Additional Info", label:"Additional Information", kind:"textarea", tab:"Contact & Admin" },
  { key:"Status", label:"Status", kind:"multi", tab:"Contact & Admin" },
  { key:"Featured", label:"Featured", kind:"single", tab:"Contact & Admin" },
  { key:"Created Date", label:"Created Date", kind:"date", tab:"Contact & Admin", readonly:true },
];
