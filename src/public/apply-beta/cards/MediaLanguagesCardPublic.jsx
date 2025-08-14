import React from "react";
import { Grid, Text, Chips } from "./components.jsx";
import ImageUploadField from "@/public/apply-beta/components/ImageUploadField.jsx";
import { SPOKEN_LANGUAGES } from "@/admin/edit/options";

export default function MediaLanguagesCardPublic({ form, setField }) {
  return (
    <Grid>
      <ImageUploadField
        label="Header Image"
        valueUrl={form.headerImageUrl}
        onChange={(url, meta) => {
          setField("headerImageUrl", url);
          setField("headerImageMeta", meta);
        }}
        help="Wide aspect recommended; JPG/PNG"
      />
      <Text form={form} setField={setField} id="videoLink1" label="Video Link 1" />
      <Text form={form} setField={setField} id="videoLink2" label="Video Link 2" />
      <Text form={form} setField={setField} id="videoLink3" label="Video Link 3" />
      <Chips form={form} setField={setField} id="spokenLanguages" options={SPOKEN_LANGUAGES} />
    </Grid>
  );
}
