export type Speaker = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  /** New */
  title?: string; // e.g., 'Dr', 'Prof', 'Professor', 'Ms', 'Mr'
  city?: string;
  country?: string;
  languages?: string[];
  headshotUrl?: string;
  // ...other existing fields
  professionalTitle?: string;
  name?: string;
  [key: string]: any;
};
