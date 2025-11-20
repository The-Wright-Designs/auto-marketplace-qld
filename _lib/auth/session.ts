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
 * Create a session cookie from an ID token
 *
 * Converts a Firebase ID token to a long-lived session cookie that can last up to 14 days.
 * The session cookie is verified server-side using the Firebase Admin SDK.
 *
 * The idToken must be a valid Firebase ID token signed by Google's secure token service.
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  try {
    if (!idToken) {
      throw new Error("ID token is required");
    }

    // Verify the token is valid before converting it
    try {
      await adminAuth.verifyIdToken(idToken);
    } catch (verifyError: any) {
      console.error(
        "[createSessionCookie] Error verifying ID token:",
        verifyError.message
      );
      throw new Error(
        "Invalid ID token - cannot create session. Verification failed: " +
          verifyError.message
      );
    }

    // Create a session cookie from the ID token (14-day expiration)
    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    return sessionCookie;
  } catch (error: any) {
    console.error(
      "[createSessionCookie] Error creating session cookie:",
      error.message
    );
    throw new Error("Failed to create session: " + error.message);
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
 *
 * Verifies a Firebase session cookie using the Admin SDK.
 */
export async function verifySessionCookie(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value
    );

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

    if (error.code === "auth/session-cookie-expired") {
      throw new Error("Session expired. Please log in again.");
    } else if (error.code === "auth/session-cookie-revoked") {
      throw new Error("Session revoked. Please log in again.");
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
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);

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
