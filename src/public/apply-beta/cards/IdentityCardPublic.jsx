import React from "react";
import { Grid, Text, Select, Upload } from "./components.jsx";
import { COUNTRIES } from "@/admin/edit/options";

export default function IdentityCardPublic({ form, setField }) {
  return (
    <Grid>
      <Text form={form} setField={setField} id="firstName" label="First Name" />
      <Text form={form} setField={setField} id="lastName" label="Last Name" />
      <Text form={form} setField={setField} id="title" label="Title (Dr/Prof)" />
      <Text form={form} setField={setField} id="professionalTitle" label="Professional Title" />
      <Text form={form} setField={setField} id="company" label="Company/Organization" />
      <Text form={form} setField={setField} id="location" label="Location" />
      <Select form={form} setField={setField} id="country" options={COUNTRIES} label="Country" />
      <Upload form={form} setField={setField} id="profileImage" label="Profile Image" hint="JPG/PNG, max 5MB" />
    </Grid>
  );
}
