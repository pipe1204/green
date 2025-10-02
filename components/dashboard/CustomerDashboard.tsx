"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DashboardSidebar } from "./DashboardSidebar";

import { CustomerDashboardSection } from "@/types";
import { FavoritesSection } from "./FavoritesSection";
import { TestDrivesSection } from "./TestDrivesSection";
import { PriceAlertsSection } from "./PriceAlertsSection";
import { InquiriesSection } from "./InquiriesSection";

export function CustomerDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<CustomerDashboardSection>("favorites");

  const renderContent = () => {
    switch (activeSection) {
      case "favorites":
        return <FavoritesSection />;
      case "testDrives":
        return <TestDrivesSection />;
      case "priceAlerts":
        return <PriceAlertsSection />;
      case "inquiries":
        return <InquiriesSection />;
      default:
        return <FavoritesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-screen pt-16">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <DashboardSidebar
            activeSection={activeSection}
            onSectionChange={(section) =>
              setActiveSection(section as CustomerDashboardSection)
            }
            userType="customer"
            className="flex-shrink-0"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Mobile Navigation - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver al Inicio</span>
                </Button>
                <h1 className="text-lg font-semibold text-gray-900">
                  Panel de Cliente
                </h1>
              </div>

              {/* Mobile Section Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveSection("favorites")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === "favorites"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Favoritos
                </button>
                <button
                  onClick={() => setActiveSection("testDrives")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === "testDrives"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Pruebas
                </button>
                <button
                  onClick={() => setActiveSection("priceAlerts")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === "priceAlerts"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Alertas
                </button>
                <button
                  onClick={() => setActiveSection("inquiries")}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === "inquiries"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Consultas
                </button>
              </div>
            </div>

            {/* Desktop Back Button - Hidden on mobile */}
            <div className="hidden lg:block mb-6">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </Button>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
