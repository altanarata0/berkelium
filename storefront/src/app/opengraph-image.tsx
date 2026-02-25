import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Bk — Berkelium Apparel"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#003262",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Bk element badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 240,
            border: "3px solid rgba(253,181,21,0.3)",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "rgba(253,181,21,0.5)",
              letterSpacing: "0.3em",
            }}
          >
            97
          </span>
          <span
            style={{
              fontSize: 100,
              fontWeight: "bold",
              color: "#FDB515",
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            Bk
          </span>
          <span
            style={{
              fontSize: 14,
              color: "rgba(253,181,21,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              marginTop: 8,
            }}
          >
            Berkelium
          </span>
        </div>

        <span
          style={{
            fontSize: 24,
            color: "rgba(245,245,240,0.5)",
            letterSpacing: "0.4em",
            textTransform: "uppercase" as const,
          }}
        >
          Wear the Element
        </span>
      </div>
    ),
    { ...size }
  )
}
