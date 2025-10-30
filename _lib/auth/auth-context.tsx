"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  AuthContextType,
  AuthState,
  UserSession,
  AuthResult,
} from "@/_types/auth-types";
import {
  getCurrentUserAction,
  logoutAction,
  refreshSessionAction,
} from "@/_actions/auth-actions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserSession | null;
}

export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: initialUser || null,
    isLoading: false,
    error: null,
  });

  // Refresh session when component mounts (only if we have initial user)
  useEffect(() => {
    if (!initialUser) {
      // If no initial user was provided, verify on mount
      const initializeAuth = async () => {
        try {
          const user = await getCurrentUserAction();

          setAuthState({
            user,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
          setAuthState({
            user: null,
            isLoading: false,
            error: "Failed to initialize authentication",
          });
        }
      };

      initializeAuth();
    }
  }, [initialUser]);

  // Refresh session periodically
  useEffect(() => {
    if (!authState.user) return;

    const refreshInterval = setInterval(async () => {
      try {
        const result = await refreshSessionAction();

        if (result.success && result.user) {
          setAuthState((prev) => ({
            ...prev,
            user: result.user || null,
            error: null,
          }));
        } else {
          // Session refresh failed, log out user
          setAuthState({
            user: null,
            isLoading: false,
            error: result.message,
          });
        }
      } catch (error) {
        console.error("Session refresh error:", error);
        // On refresh error, log out user
        setAuthState({
          user: null,
          isLoading: false,
          error: "Session expired",
        });
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(refreshInterval);
  }, [authState.user]);

  const login = async (credentials: {
    email: string;
    password: string;
    recaptchaToken?: string;
  }): Promise<AuthResult> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // For hybrid login, we need to handle client-side authentication first
      // This is a placeholder - the actual login will be handled by the login page
      // using Firebase client SDK, then calling hybridLoginAction

      return {
        success: false,
        message: "Please use the login form to sign in",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const result = await logoutAction();

      if (result.success) {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.message,
        }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const result = await refreshSessionAction();

      if (result.success && result.user) {
        setAuthState((prev) => ({
          ...prev,
          user: result.user || null,
          isLoading: false,
          error: null,
        }));
      } else {
        setAuthState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          error: result.message,
        }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Session refresh failed";

      setAuthState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const clearError = (): void => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  const setUser = useCallback((user: UserSession | null): void => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isLoading: false,
      error: null,
    }));
  }, []);

  const value: AuthContextType = {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.user,
    error: authState.error,
    login,
    logout,
    refreshSession,
    clearError,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Higher-order component for protecting client-side routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { requireAuth?: boolean }> {
  return function AuthenticatedComponent(props: P & { requireAuth?: boolean }) {
    const { isAuthenticated, isLoading } = useAuth();
    const { requireAuth = true } = props;

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      );
    }

    if (requireAuth && !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">
              Please log in to access this page.
            </p>
            <a
              href="/for-dealers/login"
              className="bg-blue text-white px-6 py-2 rounded-md hover:bg-blue/80 transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      );
    }

    return <Component {...(props as P)} />;
  };
}

// Hook for getting current user with loading state
export function useCurrentUser(): {
  user: UserSession | null;
  isLoading: boolean;
  error: string | null;
} {
  const { user, isLoading, error } = useAuth();

  return { user, isLoading, error };
}

// Hook for checking authentication status
export function useIsAuthenticated(): {
  isAuthenticated: boolean;
  isLoading: boolean;
} {
  const { isAuthenticated, isLoading } = useAuth();

  return { isAuthenticated, isLoading };
}
