import { UserSession } from "@/_types/auth-types";
import { jwtVerify, importJWK } from "jose";

/**
 * Edge-compatible session verification for middleware
 * This function doesn't use firebase-admin and works with Edge Runtime
 */
export async function verifySessionCookieEdge(
  sessionCookie: string
): Promise<UserSession | null> {
  try {
    if (!sessionCookie) {
      return null;
    }

    // For edge runtime, we need to verify JWT without firebase-admin
    // This requires the Firebase public key set
    const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!firebaseProjectId) {
      console.error("Firebase project ID not configured");
      return null;
    }

    // Firebase public keys URL
    const jwksUrl = `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`;

    // In a real implementation, you would cache these keys
    // For now, we'll fetch them each time (not optimal for production)
    const response = await fetch(jwksUrl);
    const jwks = await response.json();

    // Get the key ID from the JWT header
    const [header] = sessionCookie.split(".");
    const decodedHeader = JSON.parse(
      Buffer.from(header, "base64url").toString()
    );
    const keyId = decodedHeader.kid;

    if (!keyId || !jwks[keyId]) {
      return null;
    }

    // Import the public key
    const publicKey = await importJWK(jwks[keyId]);

    // Verify the JWT
    const { payload } = await jwtVerify(sessionCookie, publicKey, {
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      audience: firebaseProjectId,
    });

    // Extract user data from payload
    return {
      uid: payload.sub as string,
      email: (payload.email as string) || "",
      displayName: (payload.name as string) || undefined,
      emailVerified: (payload.email_verified as boolean) || false,
      customClaims: (payload.custom_claims as Record<string, any>) || {},
      lastSignInTime: payload.auth_time
        ? new Date((payload.auth_time as number) * 1000).toISOString()
        : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Edge session verification error:", error);
    return null;
  }
}

/**
 * Extract session cookie from request headers
 */
export function getSessionCookieFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies.session || null;
}
