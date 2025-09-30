"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "./AuthProvider";
import { LoginModal } from "./LoginModal";
import { SignUpModal } from "./SignUpModal";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Zap, LayoutDashboard } from "lucide-react";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          {user.user_metadata?.full_name || user.email}
        </span>
      </Button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">
              {user.user_metadata?.full_name || "Usuario"}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setShowUserMenu(false);
              router.push("/dashboard");
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Panel de Vendedor
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
