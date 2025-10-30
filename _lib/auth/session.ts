import { cookies } from "next/headers";
import { adminAuth } from "@/_lib/firebase/firebase-admin";
import {
  SessionData,
  SessionCookieOptions,
  UserSession,
  SESSION_COOKIE_CONFIG,
  FIREBASE_AUTH_ERRORS,
} from "@/_types/auth-types";

const SESSION_COOKIE_NAME = "session";

/**
 * Create an HTTP-only session cookie
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  try {
    // Create session cookie that expires in 7 days
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    return sessionCookie;
  } catch (error: any) {
    console.error("Error creating session cookie:", error);
    throw new Error("Failed to create session");
  }
}

/**
 * Set session cookie in HTTP response
 */
export async function setSessionCookie(sessionCookie: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: SESSION_COOKIE_CONFIG.httpOnly,
    secure: SESSION_COOKIE_CONFIG.secure,
    sameSite: SESSION_COOKIE_CONFIG.sameSite,
    path: SESSION_COOKIE_CONFIG.path,
    maxAge: SESSION_COOKIE_CONFIG.maxAge,
  });
}

/**
 * Verify and decode session cookie
 */
export async function verifySessionCookie(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true // checkRevoked
    );

    // Get additional user data
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    return {
      uid: userRecord.uid,
      email: userRecord.email || "",
      displayName: userRecord.displayName || undefined,
      emailVerified: userRecord.emailVerified,
      customClaims: userRecord.customClaims || {},
      lastSignInTime: new Date(decodedClaims.auth_time * 1000).toISOString(),
    };
  } catch (error: any) {
    console.error("Error verifying session cookie:", error);

    // Handle specific Firebase auth errors
    if (error.code === "auth/session-cookie-expired") {
      throw new Error(FIREBASE_AUTH_ERRORS["auth/session-cookie-expired"]);
    } else if (error.code === "auth/session-cookie-revoked") {
      throw new Error(FIREBASE_AUTH_ERRORS["auth/session-cookie-revoked"]);
    } else if (error.code === "auth/invalid-session-cookie") {
      throw new Error("Invalid session. Please log in again");
    }

    return null;
  }
}

/**
 * Delete session cookie (logout)
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Refresh session cookie
 */
export async function refreshSession(): Promise<UserSession | null> {
  try {
    const currentUser = await verifySessionCookie();

    if (!currentUser) {
      return null;
    }

    // Get a fresh custom token for the user
    const customToken = await adminAuth.createCustomToken(currentUser.uid, {
      email: currentUser.email,
      emailVerified: currentUser.emailVerified,
    });

    // Create new session cookie directly using adminAuth
    const newSessionCookie = await adminAuth.createSessionCookie(customToken, {
      expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set new session cookie
    await setSessionCookie(newSessionCookie);

    return currentUser;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return null;
  }
}

/**
 * Revoke all session tokens for a user
 */
export async function revokeUserSessions(uid: string): Promise<void> {
  try {
    await adminAuth.revokeRefreshTokens(uid);
  } catch (error) {
    console.error("Error revoking user sessions:", error);
    throw new Error("Failed to revoke sessions");
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await verifySessionCookie();
    return user !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get current session data
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const user = await verifySessionCookie();
    if (!user) {
      return null;
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    // Decode session cookie to get expiration time
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      false
    );

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
 * Check if session is about to expire (within 1 hour)
 */
export async function isSessionExpiringSoon(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session) {
      return true;
    }

    const oneHourFromNow = Date.now() + 60 * 60 * 1000;
    return session.expiresAt <= oneHourFromNow;
  } catch (error) {
    return true;
  }
}
