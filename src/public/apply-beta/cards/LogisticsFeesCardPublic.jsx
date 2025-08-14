import React from "react";
import { Grid, Select, TextArea } from "./components.jsx";
import { FEE_RANGE, DISPLAY_FEE, TRAVEL_WILLINGNESS } from "@/admin/edit/options";

export default function LogisticsFeesCardPublic({ form, setField }) {
  return (
    <Grid>
      <Select form={form} setField={setField} id="feeRange" options={FEE_RANGE} label="Fee Range (USD)" />
      <Select form={form} setField={setField} id="displayFee" options={DISPLAY_FEE} label="Display Fee on site?" />
      <Select form={form} setField={setField} id="travelWillingness" options={TRAVEL_WILLINGNESS} label="Travel Willingness" />
      <TextArea form={form} setField={setField} id="travelRequirements" label="Travel Requirements" />
    </Grid>
  );
}
