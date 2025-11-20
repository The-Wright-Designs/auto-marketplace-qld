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
 * Server action for user login with ID token
 * IMPORTANT: The ID token must be obtained from client-side Firebase authentication
 * using signInWithEmailAndPassword() and then passed to this function.
 * This ensures the token is signed by Firebase's secure token service.
 */
export async function loginWithEmailAndPassword(
  credentials: LoginCredentials & { idToken?: string }
): Promise<AuthResult> {
  try {
    const { email, password, recaptchaToken, idToken } = credentials;

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

    // If ID token is provided (hybrid approach - client-side verified)
    if (idToken) {
      try {
        // Verify the ID token to ensure it's valid and signed by Firebase
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // Verify the email matches
        if (decodedToken.email !== email) {
          return {
            success: false,
            message: "Email mismatch. Please try again.",
          };
        }

        // Get user record for additional info
        const userRecord = await adminAuth.getUser(decodedToken.uid);

        // Create session cookie using the verified ID token
        // This is the CORRECT approach - the ID token is signed by Firebase
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
        console.error("ID token verification error:", error);
        return {
          success: false,
          message: "Authentication failed. Please try again.",
        };
      }
    }

    // If no ID token provided, use Firebase REST API for email/password authentication
    try {
      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!firebaseApiKey) {
        return {
          success: false,
          message: "Authentication service not configured",
        };
      }

      // Use Firebase REST API to authenticate with email/password
      const authResponse = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        if (authData.error?.message === "INVALID_PASSWORD") {
          return {
            success: false,
            message: FIREBASE_AUTH_ERRORS["auth/wrong-password"],
          };
        }
        if (authData.error?.message === "EMAIL_NOT_FOUND") {
          return {
            success: false,
            message: FIREBASE_AUTH_ERRORS["auth/user-not-found"],
          };
        }
        throw new Error(authData.error?.message || "Authentication failed");
      }

      // Get the ID token from the response
      const receivedIdToken = authData.idToken;

      // Get user record
      const decodedToken = await adminAuth.verifyIdToken(receivedIdToken);
      const userRecord = await adminAuth.getUser(decodedToken.uid);

      // Create session cookie using the ID token received from Firebase
      // This token is properly signed by Firebase's secure token service
      const sessionCookie = await createSessionCookie(receivedIdToken);

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
    } catch (apiError: any) {
      console.error("Firebase REST API error:", apiError);
      return {
        success: false,
        message: "Authentication failed. Please check your email and password.",
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
        // Decode session cookie to get user UID
        const decodedClaims = await adminAuth.verifySessionCookie(
          sessionCookie.value
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
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie.value);

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
  const idToken = formData.get("idToken") as string;

  return await loginWithEmailAndPassword({
    email,
    password,
    recaptchaToken,
    idToken,
  });
}
