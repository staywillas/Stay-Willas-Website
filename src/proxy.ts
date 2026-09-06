import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only protect booking and wishlist — everything else is freely browsable
const isProtectedRoute = createRouteMatcher([
  "/wishlist(.*)",
  "/booking(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  // Multi-tenant routing for care.staywillas.com and carestaywillas
  if (host.startsWith("care.") || host.includes("carestaywillas")) {
    if (!pathname.startsWith("/care") && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
      return NextResponse.rewrite(
        new URL(`/care${pathname === "/" ? "" : pathname}`, req.url)
      );
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
