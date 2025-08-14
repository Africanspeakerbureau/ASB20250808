export default async function handler(req, res) {
  try {
    const { q = "", limit = "15", offset = "" } = req.query;

    const BASE = process.env.AIRTABLE_BASE_ID;
    const TABLE = process.env.AIRTABLE_SPEAKERS_TABLE;
    const APIKEY = process.env.AIRTABLE_API_KEY;

    if (!BASE || !TABLE || !APIKEY) {
      return res.status(500).json({ error: "Missing Airtable env vars" });
    }

    const FIELD_STATUS = "Status";
    const SEARCH_FIELDS = [
      "First Name",
      "Last Name",
      "Professional Title",
      "Tags",
      "Expertise Areas",
    ];

    const esc = (s) => String(s).replace(/"/g, '\\"');
    const baseFilter = `AND(FIND("Approved",ARRAYJOIN({${FIELD_STATUS}})),FIND("Published on Site",ARRAYJOIN({${FIELD_STATUS}})))`;

    let formula = baseFilter;
    const term = q.trim().toLowerCase();
    if (term.length >= 2) {
      const match = (f) => `SEARCH("${esc(term)}",LOWER({${f}}))`;
      formula = `AND(${baseFilter},OR(${SEARCH_FIELDS.map(match).join(",")}))`;
    }

    const params = new URLSearchParams();
    params.set("pageSize", String(Math.max(1, Math.min(50, Number(limit) || 15))));
    params.set("filterByFormula", formula);
    if (offset) params.set("offset", offset);

    const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?${params.toString()}`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${APIKEY}` },
    });
    const body = await r.json();

    if (!r.ok) return res.status(r.status).json({ error: body });

    return res.status(200).json({ records: body.records || [], offset: body.offset || "" });
  } catch (e) {
    console.error("Speakers API error:", e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
