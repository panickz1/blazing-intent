import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const alt = site.name;
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
          background: `radial-gradient(120% 90% at 50% -10%, ${site.themeColor} 0%, ${site.backgroundColor} 62%)`,
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 800 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#fff",
              color: site.themeColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {site.name.charAt(0).toUpperCase()}
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
          {site.tagline}
        </div>
      </div>
    ),
    size
  );
}
