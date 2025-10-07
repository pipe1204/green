"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { DeleteAccountRequest } from "@/types";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";

interface AccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AccountDeletionModal({
  isOpen,
  onClose,
  onSuccess,
}: AccountDeletionModalProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      setError("Debes escribir 'DELETE' para confirmar la eliminación");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No access token available");
      }

      const deleteData: DeleteAccountRequest = {
        confirmation: "DELETE",
      };

      const response = await fetch("/api/customer/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(deleteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out the user
      await signOut();

      // Redirect to home page
      router.push("/");

      // Call success callback
      onSuccess();
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmation("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span>Eliminar Cuenta</span>
          </DialogTitle>
          <DialogDescription>
            Esta acción es irreversible. Todos tus datos serán eliminados
            permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Advertencia:</strong> Esta acción eliminará
              permanentemente:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Tu perfil y información personal</li>
                <li>Todos tus favoritos guardados</li>
                <li>Todas tus consultas y mensajes</li>
                <li>Todas tus pruebas de manejo programadas</li>
                <li>Todas tus alertas de precio</li>
                <li>Todas tus conversaciones</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Confirmation Input */}
          <div>
            <Label htmlFor="confirmation">
              Para confirmar, escribe <strong>DELETE</strong> en el campo de
              abajo:
            </Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
              className="mt-2"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || confirmation !== "DELETE"}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Cuenta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
