import React from "react";
import { Grid, Upload, Text, Chips } from "./components.jsx";
import { SPOKEN_LANGUAGES } from "@/admin/edit/options";

export default function MediaLanguagesCardPublic({ form, setField }) {
  return (
    <Grid>
      <Upload form={form} setField={setField} id="headerImage" label="Header Image" hint="Wide aspect recommended; JPG/PNG" />
      <Text form={form} setField={setField} id="videoLink1" label="Video Link 1" />
      <Text form={form} setField={setField} id="videoLink2" label="Video Link 2" />
      <Text form={form} setField={setField} id="videoLink3" label="Video Link 3" />
      <Chips form={form} setField={setField} id="spokenLanguages" options={SPOKEN_LANGUAGES} />
    </Grid>
  );
}
