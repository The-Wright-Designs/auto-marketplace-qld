export interface LoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserSession;
  error?: string;
}

export interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  customClaims?: Record<string, any>;
  lastSignInTime?: string;
}

export interface SessionData {
  user: UserSession;
  sessionToken: string;
  expiresAt: number;
}

export interface SessionCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
  maxAge?: number;
  expires?: Date;
}

export interface AuthError {
  code: string;
  message: string;
  details?: string[];
}

export interface RateLimitInfo {
  attempts: number;
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

export interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserSession | null) => void;
}

export interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  error: string | null;
}

// Firebase Auth error codes mapping
export const FIREBASE_AUTH_ERRORS = {
  "auth/user-not-found": "No account found with this email address",
  "auth/wrong-password": "Incorrect password",
  "auth/invalid-email": "Invalid email address",
  "auth/user-disabled": "This account has been disabled",
  "auth/too-many-requests":
    "Too many failed login attempts. Please try again later",
  "auth/invalid-credential": "Invalid credentials",
  "auth/weak-password":
    "Password is too weak. Please choose a stronger password",
  "auth/email-already-in-use": "An account with this email already exists",
  "auth/operation-not-allowed": "Operation not allowed",
  "auth/expired-action-code": "This password reset link has expired",
  "auth/invalid-action-code": "This password reset link is invalid",
  "auth/session-cookie-expired":
    "Your session has expired. Please log in again",
  "auth/session-cookie-revoked":
    "Your session has been revoked. Please log in again",
} as const;

export type FirebaseAuthErrorCode = keyof typeof FIREBASE_AUTH_ERRORS;

// Cookie configuration
export const SESSION_COOKIE_CONFIG: SessionCookieOptions = {
  httpOnly: true,
  secure: typeof window !== "undefined", // Client-side: use secure in production
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 attempts per window
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3, // 3 attempts per window
  },
} as const;
