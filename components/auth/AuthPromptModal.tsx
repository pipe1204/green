"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Calendar, MessageCircle, Bell } from "lucide-react";
import { LoginModal } from "./LoginModal";
import { SignUpModal } from "./SignUpModal";

export type AuthAction =
  | "favorite"
  | "testDrive"
  | "message"
  | "priceAlert"
  | "general";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: AuthAction;
  onAuthSuccess?: () => void; // Callback after successful auth
}

// Action-specific configurations
const actionConfig = {
  favorite: {
    icon: Heart,
    iconColor: "text-red-500",
    iconBgColor: "bg-red-100",
    title: "Guarda tus favoritos",
    description:
      "Inicia sesión para guardar este vehículo en tu lista de favoritos y acceder a él en cualquier momento.",
  },
  testDrive: {
    icon: Calendar,
    iconColor: "text-blue-500",
    iconBgColor: "bg-blue-100",
    title: "Agenda tu prueba de manejo",
    description:
      "Crea una cuenta para agendar pruebas de manejo y gestionar tus reservas desde tu panel de control.",
  },
  message: {
    icon: MessageCircle,
    iconColor: "text-green-500",
    iconBgColor: "bg-green-100",
    title: "Contacta al vendedor",
    description:
      "Inicia sesión para enviar mensajes directamente al vendedor y hacer seguimiento a tus consultas.",
  },
  priceAlert: {
    icon: Bell,
    iconColor: "text-purple-500",
    iconBgColor: "bg-purple-100",
    title: "Recibe alertas de precio",
    description:
      "Crea una cuenta para recibir notificaciones cuando el precio de este vehículo baje.",
  },
  general: {
    icon: Heart,
    iconColor: "text-green-500",
    iconBgColor: "bg-green-100",
    title: "Accede a tu cuenta",
    description:
      "Inicia sesión o crea una cuenta para acceder a todas las funcionalidades de Green.",
  },
};

export function AuthPromptModal({
  isOpen,
  onClose,
  action,
  onAuthSuccess,
}: AuthPromptModalProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const config = actionConfig[action];
  const Icon = config.icon;

  // Reset modals when AuthPromptModal closes
  useEffect(() => {
    if (!isOpen) {
      setShowLogin(false);
      setShowSignUp(false);
    }
  }, [isOpen]);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleSignUpClose = () => {
    setShowSignUp(false);
  };

  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  // When login/signup is successful, trigger the callback action
  const handleAuthSuccess = () => {
    onClose();
    if (onAuthSuccess) {
      // Small delay to ensure modal is closed before action executes
      setTimeout(() => {
        onAuthSuccess();
      }, 300);
    }
  };

  return (
    <>
      {/* Main Auth Prompt Modal */}
      <Dialog open={isOpen && !showLogin && !showSignUp} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div
              className={`w-16 h-16 ${config.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <Icon className={`w-8 h-8 ${config.iconColor}`} />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              {config.title}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 pt-2">
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleLoginClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={handleSignUpClick}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 transition-colors"
            >
              Crear Cuenta
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            Al continuar, aceptas nuestros Términos de Servicio y Política de
            Privacidad
          </p>
        </DialogContent>
      </Dialog>

      {/* Login Modal - Modified to trigger callback on success */}
      {showLogin && (
        <LoginModalWithCallback
          isOpen={showLogin}
          onClose={handleLoginClose}
          onSwitchToSignUp={handleSwitchToSignUp}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Sign Up Modal - Modified to trigger callback on success */}
      {showSignUp && (
        <SignUpModalWithCallback
          isOpen={showSignUp}
          onClose={handleSignUpClose}
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

// Wrapper components that add success callback functionality

function LoginModalWithCallback({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSuccess: () => void;
}) {
  const handleClose = () => {
    // Check if user is now authenticated when closing
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          onSuccess();
        } else {
          onClose();
        }
      });
    });
  };

  return (
    <LoginModal
      isOpen={isOpen}
      onClose={handleClose}
      onSwitchToSignUp={onSwitchToSignUp}
    />
  );
}

function SignUpModalWithCallback({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}) {
  const handleClose = () => {
    // Check if user is now authenticated when closing
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          onSuccess();
        } else {
          onClose();
        }
      });
    });
  };

  return (
    <SignUpModal
      isOpen={isOpen}
      onClose={handleClose}
      onSwitchToLogin={onSwitchToLogin}
    />
  );
}
