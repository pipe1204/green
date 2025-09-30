"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

interface FavoritesButtonProps {
  vehicleId: string;
  className?: string;
}

export function FavoritesButton({
  vehicleId,
  className,
}: FavoritesButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorited();
    }
  }, [user, vehicleId]);

  const checkIfFavorited = async () => {
    try {
      const { data } = await supabase
        .from("customer_favorites")
        .select("id")
        .eq("customer_id", user?.id)
        .eq("vehicle_id", vehicleId)
        .single();

      setIsFavorited(!!data);
    } catch (error) {
      // Not favorited
      setIsFavorited(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from("customer_favorites")
          .delete()
          .eq("customer_id", user.id)
          .eq("vehicle_id", vehicleId);

        if (error) throw error;
        setIsFavorited(false);
      } else {
        // Add to favorites
        const { error } = await supabase.from("customer_favorites").insert({
          customer_id: user.id,
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
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`${className} opacity-50`}
        disabled
        title="Inicia sesión para agregar a favoritos"
      >
        <Heart className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`${className} ${
        isFavorited
          ? "text-red-500 border-red-500 hover:bg-red-50"
          : "text-gray-500 hover:text-red-500"
      }`}
    >
      <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
    </Button>
  );
}
