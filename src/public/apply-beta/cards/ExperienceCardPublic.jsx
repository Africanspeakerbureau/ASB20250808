import React from "react";
import { Grid, Select } from "./components.jsx";
import { SPEAKING_EXPERIENCE, NUMBER_OF_EVENTS, LARGEST_AUDIENCE, VIRTUAL_EXPERIENCE } from "@/admin/edit/options";

export default function ExperienceCardPublic({ form, setField }) {
  return (
    <Grid>
      <Select form={form} setField={setField} id="speakingExperience" options={SPEAKING_EXPERIENCE} label="Speaking Experience" />
      <Select form={form} setField={setField} id="numberOfEvents" options={NUMBER_OF_EVENTS} label="Number of Events" />
      <Select form={form} setField={setField} id="largestAudience" options={LARGEST_AUDIENCE} label="Largest Audience" />
      <Select form={form} setField={setField} id="virtualExperience" options={VIRTUAL_EXPERIENCE} label="Virtual Experience" />
    </Grid>
  );
}
