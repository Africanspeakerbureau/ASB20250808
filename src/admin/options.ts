import fieldOptions from "../FieldOptions";
import fieldPresets from "../utils/fieldPresets";

// Pull from the Join-as-Speaker form if similar constants already exist.
// If they do, import and re-export here to avoid duplication.
export const DISPLAY_FEE = ["Yes","No"];
export const TRAVEL_WILLINGNESS = fieldOptions['Speaker Applications']['Travel Willingness'];
export const SPOKEN_LANGUAGES = fieldOptions['Speaker Applications']['Spoken Languages'];
export const EXPERTISE_AREAS = [
  "Business / Management","Art / Culture","Cities / Environment","Economic  / Finance",
  "Facilitator / Moderator","Future / Technology","Government / Politics","Innovation / Creativity",
  "Leadership / Motivation","Society / Education","Celebrity","IT / AI"
];
// Add the rest the same way if we don’t have them centrally already:
export const INDUSTRIES = fieldOptions['Speaker Applications']['Industry'];
export const YEARS_EXPERIENCE = fieldOptions['Speaker Applications']['Years Experience'];
export const SPEAKING_EXPERIENCE = fieldOptions['Speaker Applications']['Speaking Experience'];
export const NUMBER_OF_EVENTS = fieldOptions['Speaker Applications']['Number of Events'];
export const LARGEST_AUDIENCE = fieldOptions['Speaker Applications']['Largest Audience'];
export const VIRTUAL_EXPERIENCE = fieldOptions['Speaker Applications']['Virtual Experience'];
export const FEE_RANGE = fieldOptions['Speaker Applications']['Fee Range'];
export const EXPERTISE_LEVEL = fieldOptions['Speaker Applications']['Expertise Level'];
export const COUNTRIES = fieldOptions['Speaker Applications']['Country'];
export const STATUS = fieldPresets['Speaker Applications']['Status'].options;
export const FEATURED = fieldPresets['Speaker Applications']['Featured'].options;
