import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kabelomore — AI Visibility Consulting";
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
          padding: "80px",
          background:
            "linear-gradient(135deg, #0B1324 0%, #161D2D 60%, #0EA5A0 130%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#0EA5A0",
            fontSize: "20px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "999px",
              background: "#0EA5A0",
            }}
          />
          Kabelomore · AI Visibility Consulting
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          <div
            style={{
              fontSize: "84px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              maxWidth: "1000px",
            }}
          >
            Most businesses are invisible to AI search.
          </div>
          <div
            style={{
              fontSize: "40px",
              color: "#A6ADBE",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            I fix that. — Kabelo More
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#A6ADBE",
            fontSize: "22px",
          }}
        >
          <div>kabelomore.com</div>
          <div>Pretoria · London · New York</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
