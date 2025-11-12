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
} from "@/_actions/auth-actions";
import ButtonLink from "@/_components/ui/buttons/button-link";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserSession | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: initialUser || null,
    isLoading: !initialUser,
    error: null,
  });

  useEffect(() => {
    if (!initialUser) {
      const initializeAuth = async () => {
        try {
          setAuthState((prev) => ({ ...prev, isLoading: true }));

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
        <div className="min-h-[80vh] flex flex-col gap-5 items-center justify-center">
          <h1 className="text-subheading text-blue">Authentication Required</h1>
          <p className="text-paragraph text-grey">
            Please log in to access this page.
          </p>
          <ButtonLink
            href="/for-dealers/login"
            ariaLabel="Go to Login"
            traditionalButton
            cssClasses="place-self-center"
          >
            Go to Login
          </ButtonLink>
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
