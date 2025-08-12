// Vercel serverless function for OG image (no assets)
export const config = { runtime: "edge" };

export default async function handler() {
  // minimal HTML -> PNG using @vercel/og
  const { ImageResponse } = await import("@vercel/og");
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(180deg,#08236E,#16318C)",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: "#2447C1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 72,
              fontWeight: 800,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            ASB
          </div>
          <div
            style={{
              color: "#fff",
              lineHeight: 1.1,
              fontFamily: "system-ui, sans-serif",
              fontSize: 30,
              letterSpacing: 1,
            }}
          >
            AFRICAN<br />SPEAKER<br />BUREAU
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 112,
            lineHeight: 1.05,
          }}
        >
          Authentic African<br />Voices
        </div>
        <div
          style={{
            marginTop: 24,
            color: "rgba(230,240,255,0.95)",
            fontFamily: "system-ui, sans-serif",
            fontSize: 42,
          }}
        >
          Find world-class African speakers
        </div>
        <div
          style={{
            marginTop: 36,
            border: "3px solid #fff",
            borderRadius: 30,
            display: "inline-flex",
            padding: "10px 24px",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            fontSize: 44,
          }}
        >
          africanspeakerbureau.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

