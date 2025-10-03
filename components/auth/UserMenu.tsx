"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { useAuth } from "./AuthProvider";
import { LoginModal } from "./LoginModal";
import { SignUpModal } from "./SignUpModal";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    phone?: string;
    company_name?: string;
    avatar_url?: string;
  } | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);

          // Trigger guest inquiry linking for customers
          if (data?.role === "customer" && user.email) {
            try {
              // Get the current session for the API call
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (!session?.access_token) {
                console.error("❌ UserMenu: No access token available");
                return;
              }

              const response = await fetch("/api/link-guest-inquiries", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.access_token}`,
                },
              });

              const linkingResult = await response.json();
              if (linkingResult.success && linkingResult.linkedCount > 0) {
                // Store linking result for potential notification
                localStorage.setItem(
                  "linkedInquiriesCount",
                  linkingResult.linkedCount.toString()
                );
              } else if (
                linkingResult.success &&
                linkingResult.linkedCount === 0
              ) {
              } else {
                console.error(
                  "❌ UserMenu: Failed to link guest inquiries:",
                  linkingResult.error
                );
              }
            } catch (linkingError) {
              console.error(
                "❌ UserMenu: Error linking guest inquiries:",
                linkingError
              );
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  if (!user) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowLogin(true)}
            className="text-sm"
          >
            Iniciar Sesión
          </Button>
          <Button
            onClick={() => setShowSignUp(true)}
            className="text-sm bg-green-600 text-white"
          >
            Registrarse
          </Button>
        </div>

        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />

        <SignUpModal
          isOpen={showSignUp}
          onClose={() => setShowSignUp(false)}
          onSwitchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">
          {profile?.full_name || user.email}
        </span>
      </Button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">
              {profile?.full_name || "Usuario"}
            </p>
            <p className="text-xs text-gray-500">
              {profile?.email || user.email}
            </p>
          </div>

          <button
            onClick={() => {
              setShowUserMenu(false);
              // Check user role and redirect accordingly
              const userRole = profile?.role || "customer";
              if (userRole === "vendor") {
                router.push("/dashboard");
              } else {
                router.push("/customer-dashboard");
              }
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            {profile?.role === "vendor" ? "Panel de Vendedor" : "Mi Panel"}
          </button>

          <button
            onClick={() => {
              setShowUserMenu(false);
              // Navigate to profile settings
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 mr-3" />
            Mi Perfil
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
