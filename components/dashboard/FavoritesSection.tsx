"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types";
import { VehicleCard } from "@/components/resultados/VehicleCard";
import { Button } from "@/components/ui/button";
import { Car, ArrowRight, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { databaseToVehicle } from "@/lib/database-mapping";

export function FavoritesSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user's favorite vehicle IDs
      const { data: favoriteData, error: favoriteError } = await supabase
        .from("customer_favorites")
        .select("vehicle_id")
        .eq("customer_id", user?.id);

      if (favoriteError) throw favoriteError;

      if (!favoriteData || favoriteData.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const vehicleIds = favoriteData.map((fav) => fav.vehicle_id);

      // Get vehicle details
      const { data: vehicles, error: vehiclesError } = await supabase
        .from("vehicles")
        .select(
          `
          *,
          vendors (
            business_name,
            rating,
            total_reviews
          )
        `
        )
        .in("id", vehicleIds);

      if (vehiclesError) throw vehiclesError;

      // Transform to Vehicle format using existing database mapping
      const transformedVehicles: Vehicle[] =
        vehicles?.map((vehicle) => databaseToVehicle(vehicle)) || [];

      setFavorites(transformedVehicles);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Error al cargar tus favoritos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              Mis Favoritos
            </h2>
            <p className="text-gray-600 mt-1">Vehículos que te interesan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              Mis Favoritos
            </h2>
            <p className="text-gray-600 mt-1">Vehículos que te interesan</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchFavorites} variant="outline" className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              Mis Favoritos
            </h2>
            <p className="text-gray-600 mt-1">Vehículos que te interesan</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes favoritos aún
          </h3>
          <p className="text-gray-600 mb-6">
            Explora vehículos y guarda los que te interesen haciendo clic en el
            corazón.
          </p>
          <Button
            onClick={() => router.push("/resultados")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Car className="w-4 h-4 mr-2" />
            Explorar Vehículos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            Mis Favoritos ({favorites.length})
          </h2>
          <p className="text-gray-600 mt-1">Vehículos que te interesan</p>
        </div>
        <Button onClick={() => router.push("/resultados")} variant="outline">
          <Car className="w-4 h-4 mr-2" />
          Explorar Más
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
