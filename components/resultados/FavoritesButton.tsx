"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthActions } from "@/hooks/useAuthCheck";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

interface FavoritesButtonProps {
  vehicleId: string;
  className?: string;
}

export function FavoritesButton({
  vehicleId,
  className,
}: FavoritesButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingInitialState, setCheckingInitialState] = useState(true);

  const {
    requireAuthForFavorite,
    isAuthenticated,
    authPrompt,
    closeAuthPrompt,
    handleAuthSuccess,
    user,
  } = useAuthActions();

  const checkIfFavorited = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("customer_favorites")
        .select("id")
        .eq("customer_id", user?.id)
        .eq("vehicle_id", vehicleId)
        .maybeSingle();

      if (error) throw error;
      setIsFavorited(!!data);
    } catch (error) {
      console.error("Error checking if favorited:", error);
      setIsFavorited(false);
    } finally {
      setCheckingInitialState(false);
    }
  }, [user, vehicleId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkIfFavorited();
    } else {
      setCheckingInitialState(false);
    }
  }, [isAuthenticated, user, checkIfFavorited]);

  const handleToggleFavorite = () => {
    requireAuthForFavorite(async () => {
      setLoading(true);
      try {
        if (isFavorited) {
          // Remove from favorites
          const { error } = await supabase
            .from("customer_favorites")
            .delete()
            .eq("customer_id", user?.id)
            .eq("vehicle_id", vehicleId);

          if (error) throw error;
          setIsFavorited(false);
        } else {
          // Add to favorites
          const { error } = await supabase.from("customer_favorites").insert({
            customer_id: user?.id,
            vehicle_id: vehicleId,
          });

          if (error) throw error;
          setIsFavorited(true);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleFavorite}
        disabled={loading || checkingInitialState}
        className={`${className} ${
          isFavorited
            ? "text-red-500 border-red-500 hover:bg-red-50"
            : "text-gray-500 hover:text-red-500"
        }`}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            isFavorited ? "fill-current scale-110" : ""
          }`}
        />
      </Button>

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        action={authPrompt.action}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
