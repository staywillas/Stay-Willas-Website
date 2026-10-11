import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Ensure this endpoint is never statically cached so every ping hits the database
export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Execute lightweight 1ms ping to PostgreSQL database
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        database: "connected",
        latency: `${latencyMs}ms`,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error?.message || "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
