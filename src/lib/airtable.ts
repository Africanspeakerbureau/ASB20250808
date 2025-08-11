import Airtable from "airtable";

const baseId = process.env.AIRTABLE_BASE_ID!;
const apiKey = process.env.AIRTABLE_API_KEY!;
const tableName = process.env.AIRTABLE_SPEAKERS_TABLE || "Speaker Applications";

export const speakerTable = () =>
  new Airtable({ apiKey }).base(baseId)(tableName);
