"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { linkGuestInquiriesByEmail } from "@/lib/inquiry-linking";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: "customer" | "vendor"
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to handle linking guest inquiries for new users
  const handleUserLinking = async (user: User | null) => {
    if (!user || !user.email) return;

    try {
      const linkingResult = await linkGuestInquiriesByEmail(
        user.id,
        user.email
      );
      if (linkingResult.success && linkingResult.linkedCount > 0) {
        console.log(
          `Linked ${linkingResult.linkedCount} guest inquiries for user ${user.id}`
        );
        // Store linking result for potential notification
        localStorage.setItem(
          "linkedInquiriesCount",
          linkingResult.linkedCount.toString()
        );
      }
    } catch (linkingError) {
      console.error("Error linking guest inquiries:", linkingError);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle linking for existing users
      if (session?.user) {
        handleUserLinking(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle linking when user signs in (including Google OAuth)
      if (event === "SIGNED_IN" && session?.user) {
        handleUserLinking(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "customer" | "vendor"
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    // If signup is successful and user is created, link any guest inquiries
    if (!error && data.user && role === "customer") {
      try {
        const linkingResult = await linkGuestInquiriesByEmail(
          data.user.id,
          email
        );
        if (linkingResult.success && linkingResult.linkedCount > 0) {
          console.log(
            `Linked ${linkingResult.linkedCount} guest inquiries for user ${data.user.id}`
          );
          // Store linking result for potential notification
          localStorage.setItem(
            "linkedInquiriesCount",
            linkingResult.linkedCount.toString()
          );
        }
      } catch (linkingError) {
        console.error(
          "Error linking guest inquiries during signup:",
          linkingError
        );
        // Don't fail the signup if linking fails
      }
    }

    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Provide a safe default for environments (like tests) where the provider isn't mounted
    return {
      user: null,
      session: null,
      loading: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signInWithGoogle: async () => ({ error: null }),
      signOut: async () => {},
    } as AuthContextType;
  }
  return context;
}
