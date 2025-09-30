"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { VendorDashboard } from "@/components/dashboard/VendorDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorDashboard />
    </div>
  );
}
