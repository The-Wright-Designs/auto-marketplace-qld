import { NextRequest, NextResponse } from "next/server";

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

const staticRoutes = [
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/images",
  "/icons",
  "/logo",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (staticRoutes.some((route) => pathname.startsWith(route)) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      const loginUrl = new URL("/for-dealers/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (
    isPublicRoute &&
    (pathname === "/for-dealers/login" || pathname === "/for-dealers/register")
  ) {
    const sessionCookie = request.cookies.get("session")?.value;
    if (sessionCookie) {
      const dashboardUrl = new URL("/dealer-portal", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
