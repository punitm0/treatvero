import { ImageResponse } from "next/og";

export const alt = "TreatVero — Medical travel, made simple.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0F2E2A",
          color: "#FFFFFF",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: "#FFFFFF", position: "relative", display: "flex" }}>
            <div style={{ position: "absolute", right: 8, top: 8, width: 14, height: 14, borderRadius: 999, background: "#0F2E2A" }} />
          </div>
          <div style={{ fontSize: 38, fontFamily: "sans-serif", fontWeight: 600, letterSpacing: -1 }}>TreatVero</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>Medical travel, made simple.</div>
          <div style={{ fontSize: 30, color: "#C9DBD6", fontFamily: "sans-serif" }}>
            Treatment options abroad, with hospitals, visas, stays and on-ground support coordinated.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
