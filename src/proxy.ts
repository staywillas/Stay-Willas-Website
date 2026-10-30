import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// Only protect checkout, user dashboard and wishlist — everything else is freely browsable
const isProtectedRoute = createRouteMatcher([
  "/wishlist(.*)",
  "/booking/(.*)",
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

  // If user has a valid staywillas_session cookie, allow immediate access
  const staywillasSession = req.cookies.get("staywillas_session")?.value;

  if (isProtectedRoute(req) && !staywillasSession) {
    try {
      await auth.protect();
    } catch {
      return NextResponse.redirect(
        new URL(`/login?role=guest&redirect=${encodeURIComponent(pathname)}`, req.url)
      );
    }
  }
});

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const host = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Keep the care subdomain rewrite, but don't invoke Clerk for its public pages.
  if (
    (host.startsWith("care.") || host.includes("carestaywillas")) &&
    !pathname.startsWith("/care") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api")
  ) {
    return NextResponse.rewrite(
      new URL(`/care${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  // Public pages do not use Clerk auth. Avoid its middleware work on the common
  // browse path; protected routes still get the same auth check as before.
  const staywillasSession = request.cookies.get("staywillas_session")?.value;
  if (!isProtectedRoute(request) || staywillasSession) {
    return NextResponse.next();
  }

  const res = await clerkHandler(request, event);

  // Next.js 16 compatibility: Clerk's decorateRequest sets x-middleware-rewrite to req.url
  // to pass request headers. In Next.js 16, self-rewriting results in a 404 router bailout.
  if (res && res.headers.has("x-middleware-rewrite")) {
    const rewriteHeader = res.headers.get("x-middleware-rewrite") || "";
    const cleanRewrite = rewriteHeader.replace(/\/$/, "");
    const cleanUrl = request.url.replace(/\/$/, "");
    const cleanPath = request.nextUrl.pathname.replace(/\/$/, "") || "/";
    if (
      cleanRewrite === cleanUrl || 
      rewriteHeader === cleanPath || 
      rewriteHeader === request.nextUrl.pathname ||
      cleanRewrite === request.nextUrl.origin + cleanPath
    ) {
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
