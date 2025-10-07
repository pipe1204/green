"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { DeleteVendorAccountRequest } from "@/types";

interface VendorAccountDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VendorAccountDeletionModal({
  isOpen,
  onClose,
}: VendorAccountDeletionModalProps) {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!session?.access_token) {
      setError("No access token available");
      return;
    }

    if (confirmation !== "DELETE") {
      setError("You must type 'DELETE' exactly to confirm");
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const requestBody: DeleteVendorAccountRequest = {
        confirmation,
      };

      const response = await fetch("/api/vendor/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out and redirect
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Error deleting vendor account:", err);
      setError(err instanceof Error ? err.message : "Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
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
            <AlertTriangle className="w-5 h-5" />
            <span>Eliminar Cuenta de Vendedor</span>
          </DialogTitle>
          <DialogDescription className="text-left space-y-3">
            <p>
              <strong>¡ADVERTENCIA!</strong> Esta acción es irreversible y
              eliminará permanentemente:
            </p>

            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h4 className="font-semibold text-red-800 mb-2">Se eliminará:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Tu perfil personal y de vendedor</li>
                <li>• Todos tus vehículos en venta</li>
                <li>• Todas las consultas de clientes</li>
                <li>• Todas las reservas de prueba de manejo</li>
                <li>• Todas las reseñas de tus vehículos</li>
                <li>• Todas las conversaciones con clientes</li>
                <li>• Todos los favoritos de tus vehículos</li>
                <li>• Todos los mensajes enviados</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              Si estás seguro de que quieres eliminar tu cuenta, escribe{" "}
              <strong className="font-mono bg-gray-100 px-1 rounded">
                DELETE
              </strong>{" "}
              en el campo de abajo.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Confirmación
            </Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Escribe DELETE para confirmar"
              className="font-mono"
              disabled={isDeleting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Escribe exactamente: <strong>DELETE</strong>
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmation !== "DELETE"}
            className="w-full sm:w-auto flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Eliminando..." : "Eliminar Cuenta"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
