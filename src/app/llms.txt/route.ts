import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "llms.txt");
  
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch {
    return new NextResponse("Stay Willas — Luxury Private Pool Villas in Maharashtra\nhttps://www.staywillas.com", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
