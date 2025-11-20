import { NextRequest, NextResponse } from "next/server";

// Define public and protected routes
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/sell-my-car",
  "/for-dealers",
  "/for-dealers/login",
  "/for-dealers/register",
  "/auth/action",
  "/privacy-policy",
  "/terms-and-conditions",
  "/api/test-password-auth",
  "/api/test-password-reset",
];

const protectedRoutes = ["/dealer-portal"];

// Static assets that don't need authentication
const staticRoutes = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/images",
  "/icons",
  "/logo",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (staticRoutes.some((route) => pathname.startsWith(route)) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/for-dealers/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Just check if session cookie exists - actual verification happens in server components
    // This avoids Firebase Admin SDK issues in middleware
    return NextResponse.next();
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (
    isPublicRoute &&
    (pathname === "/for-dealers/login" || pathname === "/for-dealers/register")
  ) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (sessionCookie) {
      // User has a session, redirect to dashboard
      const dashboardUrl = new URL("/dealer-portal", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
