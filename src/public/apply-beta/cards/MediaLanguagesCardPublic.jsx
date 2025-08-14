import React from "react";
import { Grid, Text, Chips, Field } from "./components.jsx";
import { UploadPublic } from "@/components/upload/UploadPublic.jsx";
import { SPOKEN_LANGUAGES } from "@/admin/edit/options";

export default function MediaLanguagesCardPublic({ form, setField }) {
  return (
    <Grid>
      <Field label="Header Image" hint="Wide aspect recommended; JPG/PNG">
        <UploadPublic
          accept="image/*"
          clientAllowedFormats={["jpg", "jpeg", "png"]}
          maxSizeMB={5}
          onUploaded={({ url, width, height, format, originalFilename }) => {
            setField("headerImageUrl", url);
            setField("headerImageMeta", { width, height, format, name: originalFilename });
          }}
          onError={err => setField("__uploadError", String(err?.message || err))}
        />
      </Field>
      <Text form={form} setField={setField} id="videoLink1" label="Video Link 1" />
      <Text form={form} setField={setField} id="videoLink2" label="Video Link 2" />
      <Text form={form} setField={setField} id="videoLink3" label="Video Link 3" />
      <Chips form={form} setField={setField} id="spokenLanguages" options={SPOKEN_LANGUAGES} />
    </Grid>
  );
}
