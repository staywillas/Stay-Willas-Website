import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// Only protect booking and wishlist — everything else is freely browsable
const isProtectedRoute = createRouteMatcher([
  "/wishlist(.*)",
  "/booking(.*)",
  "/dashboard(.*)",
]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
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

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const res = await clerkHandler(request, event);

  // Next.js 16 compatibility: Clerk's decorateRequest sets x-middleware-rewrite to req.url
  // to pass request headers. In Next.js 16, self-rewriting results in a 404 router bailout.
  if (res && res.headers.has("x-middleware-rewrite")) {
    const rewriteHeader = res.headers.get("x-middleware-rewrite");
    if (rewriteHeader === request.url || rewriteHeader === request.nextUrl.pathname) {
      res.headers.delete("x-middleware-rewrite");
      res.headers.set("x-middleware-next", "1");
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
