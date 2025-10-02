import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthAction } from "@/components/auth/AuthPromptModal";

/**
 * Custom hook to check authentication before performing actions
 * Returns methods to handle auth-gated actions
 */
export function useAuthCheck() {
  const { user } = useAuth();
  const [authPrompt, setAuthPrompt] = useState<{
    isOpen: boolean;
    action: AuthAction;
    callback?: () => void;
  }>({
    isOpen: false,
    action: "general",
  });

  /**
   * Check if user is authenticated and either execute action or show auth prompt
   * @param action - The type of action being performed
   * @param callback - Function to execute after successful authentication
   * @returns boolean - true if user is authenticated, false if prompt was shown
   */
  const requireAuth = (action: AuthAction, callback: () => void): boolean => {
    if (user) {
      // User is authenticated, execute the action immediately
      callback();
      return true;
    } else {
      // User is not authenticated, show auth prompt
      setAuthPrompt({
        isOpen: true,
        action,
        callback,
      });
      return false;
    }
  };

  /**
   * Close the auth prompt modal
   */
  const closeAuthPrompt = () => {
    setAuthPrompt({
      isOpen: false,
      action: "general",
      callback: undefined,
    });
  };

  /**
   * Handle successful authentication - execute the pending callback
   */
  const handleAuthSuccess = () => {
    if (authPrompt.callback) {
      authPrompt.callback();
    }
    closeAuthPrompt();
  };

  return {
    user,
    isAuthenticated: !!user,
    requireAuth,
    authPrompt,
    closeAuthPrompt,
    handleAuthSuccess,
  };
}

/**
 * Helper functions for common auth-gated actions
 */
export const useAuthActions = () => {
  const { requireAuth, ...rest } = useAuthCheck();

  return {
    requireAuthForFavorite: (callback: () => void) =>
      requireAuth("favorite", callback),
    requireAuthForTestDrive: (callback: () => void) =>
      requireAuth("testDrive", callback),
    requireAuthForMessage: (callback: () => void) =>
      requireAuth("message", callback),
    requireAuthForPriceAlert: (callback: () => void) =>
      requireAuth("priceAlert", callback),
    requireAuthGeneral: (callback: () => void) =>
      requireAuth("general", callback),
    ...rest,
  };
};
