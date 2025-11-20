import { cookies } from "next/headers";
import { verifySessionCookie } from "./session";
import { UserSession } from "@/_types/auth-types";

/**
 * Get the current authenticated user from session
 * Throws an error if user is not authenticated
 */
export async function requireAuth(): Promise<UserSession> {
  const user = await verifySessionCookie();

  if (!user) {
    throw new Error("Authentication required. Please log in.");
  }

  return user;
}

/**
 * Get the current authenticated user from session
 * Returns null if user is not authenticated
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    return await verifySessionCookie();
  } catch (error) {
    return null;
  }
}

/**
 * Get the current session data
 * Returns null if no valid session exists
 */
export async function getSession(): Promise<{
  user: UserSession;
  sessionToken: string;
  expiresAt: number;
} | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    // Import here to avoid circular dependencies
    const { adminAuth } = await import("@/_lib/firebase/firebase-admin");

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);

    // Get user data
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    const user: UserSession = {
      uid: userRecord.uid,
      email: userRecord.email || "",
      displayName: userRecord.displayName || undefined,
      emailVerified: userRecord.emailVerified || false,
      customClaims: userRecord.customClaims || {},
      lastSignInTime: new Date(decodedClaims.auth_time * 1000).toISOString(),
    };

    return {
      user,
      sessionToken: sessionCookie.value,
      expiresAt: decodedClaims.exp * 1000, // Convert to milliseconds
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get user ID from session
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user?.uid || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get user email from session
 * Returns null if not authenticated
 */
export async function getUserEmail(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user?.email || null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has specific custom claim
 */
export async function hasCustomClaim(claim: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.customClaims?.[claim] === true;
  } catch (error) {
    return false;
  }
}

/**
 * Check if user is an admin (has admin claim)
 */
export async function isAdmin(): Promise<boolean> {
  return await hasCustomClaim("admin");
}

/**
 * Check if user email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.emailVerified || false;
  } catch (error) {
    return false;
  }
}
