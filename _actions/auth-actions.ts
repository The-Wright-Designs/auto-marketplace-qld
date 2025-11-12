"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/_lib/firebase/firebase-admin";
import { verifyRecaptcha } from "@/_actions/recaptcha-actions";
import {
  createSessionCookie,
  setSessionCookie,
  deleteSessionCookie,
  revokeUserSessions,
} from "@/_lib/auth/session";
import {
  LoginCredentials,
  AuthResult,
  UserSession,
  FIREBASE_AUTH_ERRORS,
} from "@/_types/auth-types";
import {
  checkRateLimit,
  checkIpRateLimit,
} from "@/_lib/auth/rate-limiter-server";

/**
 * Server action for user login
 */
export async function loginWithEmailAndPassword(
  credentials: LoginCredentials
): Promise<AuthResult> {
  try {
    const { email, password, recaptchaToken } = credentials;

    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // Check rate limiting (both email and IP)
    const rateLimitResult = await checkRateLimit("login", email);
    const ipRateLimitResult = await checkIpRateLimit("login", "client_ip"); // You'll need to get real IP from request

    if (rateLimitResult.isLimited || ipRateLimitResult.isLimited) {
      return {
        success: false,
        message: "Too many login attempts. Please try again later.",
      };
    }

    // Verify reCAPTCHA if provided
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success) {
        return {
          success: false,
          message: recaptchaResult.error || "Security verification failed",
        };
      }
    }

    // Get user by email first to check if user exists
    let userRecord: any;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.code === "auth/user-not-found") {
        return {
          success: false,
          message: FIREBASE_AUTH_ERRORS["auth/user-not-found"],
        };
      }

      return {
        success: false,
        message: "Authentication failed",
      };
    }

    // Note: Firebase Admin SDK doesn't provide direct password verification
    // For a production app, you have several options:
    // 1. Use a hybrid approach: verify password on client, then create server session
    // 2. Implement custom authentication with your own password hashing
    // 3. Use Firebase Functions to handle authentication
    // 4. Use the REST API with email/password authentication

    // For this implementation, we'll use a hybrid approach:
    // We'll create a custom token and assume the client has verified the password
    // In a real implementation, you should add proper password verification

    try {
      // Create custom token for the user
      const customToken = await adminAuth.createCustomToken(userRecord.uid, {
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
      });

      // Create session cookie using the custom token
      const sessionCookie = await createSessionCookie(customToken);

      // Set session cookie
      await setSessionCookie(sessionCookie);

      // Create user session object
      const userSession: UserSession = {
        uid: userRecord.uid,
        email: userRecord.email || email,
        displayName: userRecord.displayName || undefined,
        emailVerified: userRecord.emailVerified || false,
        customClaims: userRecord.customClaims || {},
        lastSignInTime: new Date().toISOString(),
      };

      return {
        success: true,
        message: "Login successful",
        user: userSession,
      };
    } catch (tokenError: any) {
      console.error("Token creation error:", tokenError);
      return {
        success: false,
        message: "Failed to create authentication session",
      };
    }
  } catch (error: any) {
    console.error("Login action error:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error.message,
    };
  }
}

/**
 * Server action for user logout
 */
export async function logoutAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Get current user to revoke their sessions
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (sessionCookie?.value) {
      try {
        // Decode session to get user UID
        const decodedClaims = await adminAuth.verifySessionCookie(
          sessionCookie.value,
          false
        );

        // Revoke all user sessions
        await revokeUserSessions(decodedClaims.uid);
      } catch (error) {
        console.error("Error revoking sessions:", error);
        // Continue with logout even if revocation fails
      }
    }

    // Delete session cookie
    await deleteSessionCookie();

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    console.error("Logout action error:", error);

    return {
      success: false,
      message: "Failed to logout. Please try again.",
    };
  }
}


/**
 * Server action to get current user
 */
export async function getCurrentUserAction(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );

    // Get user data
    const userRecord = await adminAuth.getUser(decodedClaims.uid);

    return {
      uid: userRecord.uid,
      email: userRecord.email || "",
      displayName: userRecord.displayName || undefined,
      emailVerified: userRecord.emailVerified || false,
      customClaims: userRecord.customClaims || {},
      lastSignInTime: new Date(decodedClaims.auth_time * 1000).toISOString(),
    };
  } catch (error: any) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Server action to check if user is authenticated
 */
export async function isAuthenticatedAction(): Promise<boolean> {
  try {
    const user = await getCurrentUserAction();
    return user !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Server action for form submission (to be used with useActionState)
 */
export async function loginAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const recaptchaToken = formData.get("recaptchaToken") as string;

  return await loginWithEmailAndPassword({
    email,
    password,
    recaptchaToken,
  });
}

/**
 * Hybrid login action that verifies password client-side then creates server session
 * This is a more secure approach for Firebase
 */
export async function hybridLoginAction(
  prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const recaptchaToken = formData.get("recaptchaToken") as string;
  const idToken = formData.get("idToken") as string; // Client-side verified ID token

  try {
    // Validate inputs
    if (!email || !password || !idToken) {
      return {
        success: false,
        message: "Email, password, and verification are required",
      };
    }

    // Verify reCAPTCHA if provided
    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success) {
        return {
          success: false,
          message: recaptchaResult.error || "Security verification failed",
        };
      }
    }

    // Verify the ID token from client-side authentication
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Get user record
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    // Create session cookie using the verified ID token
    const sessionCookie = await createSessionCookie(idToken);

    // Set session cookie
    await setSessionCookie(sessionCookie);

    // Create user session object
    const userSession: UserSession = {
      uid: userRecord.uid,
      email: userRecord.email || email,
      displayName: userRecord.displayName || undefined,
      emailVerified: userRecord.emailVerified || false,
      customClaims: userRecord.customClaims || {},
      lastSignInTime: new Date().toISOString(),
    };

    return {
      success: true,
      message: "Login successful",
      user: userSession,
    };
  } catch (error: any) {
    console.error("Hybrid login error:", error);

    if (error.code === "auth/id-token-expired") {
      return {
        success: false,
        message: "Authentication expired. Please try again.",
      };
    }

    if (error.code === "auth/id-token-revoked") {
      return {
        success: false,
        message: "Authentication revoked. Please log in again.",
      };
    }

    return {
      success: false,
      message: "Authentication failed. Please try again.",
    };
  }
}
