/* global process */
/* eslint-env node */
export default async function handler(req, res) {
  try {
    const { q = "", limit = "15", offset = "" } = req.query;

    // ⬇⬇ USE THE EXISTING ENV VAR NAMES FROM STEP 0 (do not rename)
    const BASE   = process.env.AIRTABLE_BASE_ID;
    const TABLE  = process.env.AIRTABLE_SPEAKERS_TABLE;
    const APIKEY = process.env.AIRTABLE_API_KEY;

    if (!BASE || !TABLE || !APIKEY) {
      return res.status(500).json({ error: "Missing Airtable env vars" });
    }

    // ⬇⬇ USE THE EXISTING FIELD NAMES FROM STEP 0 (do not rename)
    const FIELD_STATUS    = "Status";              // value "Approved"
    const FIELD_PUBLISHED = "Published on site";   // checkbox TRUE()
    const SEARCH_FIELDS   = [
      "First Name", "Last Name", "Professional Title", "Tags", "expertiseAreas"
    ];

    const esc = (s) => String(s).replace(/"/g, '\\"');
    const base = `AND({${FIELD_STATUS}}="Approved",{${FIELD_PUBLISHED}}=TRUE())`;
    let formula = base;
    const term = q.trim().toLowerCase();
    if (term.length >= 2) {
      const m = (f) => `SEARCH("${esc(term)}",LOWER({${f}}))`;
      formula = `AND(${base},OR(${SEARCH_FIELDS.map(m).join(",")}))`;
    }

    const params = new URLSearchParams();
    params.set("pageSize", String(Math.max(1, Math.min(50, Number(limit) || 15))));
    params.set("filterByFormula", formula);
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${params.toString()}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${APIKEY}` } });
    const body = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: body });

    res.status(200).json({ records: body.records || [], offset: body.offset || "" });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
