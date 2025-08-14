import React from "react";
import { Grid, Chips, TextArea } from "./components.jsx";
import { EXPERTISE_AREAS } from "@/admin/edit/options";

export default function ExpertiseCardPublic({ form, setField }) {
  return (
    <Grid>
      <Chips
        form={form}
        setField={setField}
        id="expertiseAreas"
        options={EXPERTISE_AREAS}
        label="Area of Expertise"
      />
      <TextArea form={form} setField={setField} id="speakingTopics" label="Speaking Topics" />
      <TextArea form={form} setField={setField} id="keyMessages" label="Key Messages" />
      <TextArea form={form} setField={setField} id="professionalBio" label="Professional Bio" />
    </Grid>
  );
}
