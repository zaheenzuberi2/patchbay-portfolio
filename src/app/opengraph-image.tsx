import { ImageResponse } from "next/og";

export const alt = "Patchbay, AI Automation, Chatbots & Full-Stack Websites";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "80px",
          color: "#f3efe7",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          {[18, 34, 14, 44, 26, 38, 20, 30].map((h, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: h,
                background: "#ff5a1f",
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            Patchbay
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#a3a19b",
              marginTop: 16,
              maxWidth: 900,
            }}
          >
            AI automation, chatbots and full-stack websites, run by Zaheen
            Zuberi
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#ff5a1f",
            letterSpacing: 2,
          }}
        >
          ISLAMABAD, PAKISTAN
        </div>
      </div>
    ),
    { ...size },
  );
}
