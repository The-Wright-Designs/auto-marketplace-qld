import { NextRequest, NextResponse } from "next/server";
import { UserSession } from "@/_types/auth-types";

// Define public and protected routes
const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/sell-my-car",
  "/for-dealers",
  "/for-dealers/login",
  "/for-dealers/register",
  "/auth/action", // Password reset action page
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

  // Skip middleware for static assets
  if (staticRoutes.some((route) => pathname.startsWith(route))) {
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
    try {
      // Get session cookie from request
      const sessionCookie = request.cookies.get("session")?.value;

      if (!sessionCookie) {
        // No session cookie found, redirect to login
        const loginUrl = new URL("/for-dealers/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verify session cookie using API route
      const verifyResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/verify-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionCookie }),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error("Session verification failed");
      }

      const { user } = await verifyResponse.json();

      if (!user) {
        // User is not authenticated, redirect to login
        const loginUrl = new URL("/for-dealers/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // User is authenticated, allow access
      const response = NextResponse.next();

      // Add user info to headers for server components
      response.headers.set("x-user-id", user.uid);
      response.headers.set("x-user-email", user.email);

      return response;
    } catch (error) {
      console.error("Middleware auth error:", error);

      // On any auth error, redirect to login
      const loginUrl = new URL("/for-dealers/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (
    isPublicRoute &&
    (pathname === "/for-dealers/login" || pathname === "/for-dealers/register")
  ) {
    try {
      // Get session cookie from request
      const sessionCookie = request.cookies.get("session")?.value;

      if (sessionCookie) {
        // Verify session cookie using API route
        const verifyResponse = await fetch(
          `${request.nextUrl.origin}/api/auth/verify-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionCookie }),
          }
        );

        if (verifyResponse.ok) {
          const { user } = await verifyResponse.json();

          if (user) {
            // User is already authenticated, redirect to dashboard
            const dashboardUrl = new URL(
              "/dealer-portal/dashboard",
              request.url
            );
            return NextResponse.redirect(dashboardUrl);
          }
        }
      }
    } catch (error) {
      // Continue to public route if auth check fails
      console.log("Auth check for login page failed, continuing:", error);
    }
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
