import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title =
    searchParams.get("title") || "Add a blog to your website in 2 minutes!";
  const emoji = searchParams.get("emoji") || "⛩️";

  const url = searchParams.get("url") || "zenblog.com";
  const urlColor = searchParams.get("urlColor") || "#f97316";
  const bgColor = searchParams.get("bgColor") || "#fafafa";

  const fontDataInterRegular = await fetch(
    new URL("../../../assets/Inter-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          color: "black",
          background: bgColor,
          width: "100%",
          height: "100%",
          padding: "50px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "'Inter'",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 80,
            }}
          >
            {emoji}
          </div>
          <div
            style={{
              fontSize: 80,
              marginBottom: 20,
              color: "#27272a",
              letterSpacing: -1.5,
              marginTop: 40,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontSize: 40,
            marginBottom: 20,
            color: urlColor,
            letterSpacing: -2,
            fontWeight: 400,
          }}
        >
          {url}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          data: fontDataInterRegular,
          name: "Inter",
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
