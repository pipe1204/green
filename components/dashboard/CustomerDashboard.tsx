"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, X } from "lucide-react";
import Header from "@/components/Header";
import { ResponsiveDashboardSidebar } from "./ResponsiveDashboardSidebar";

import { CustomerDashboardSection } from "@/types";
import { FavoritesSection } from "./FavoritesSection";
import { TestDrivesSection } from "./TestDrivesSection";
import { PriceAlertsSection } from "./PriceAlertsSection";
import { InquiriesSection } from "./InquiriesSection";
import { CustomerProfilePage } from "./CustomerProfile";

export function CustomerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] =
    useState<CustomerDashboardSection>("favorites");
  const [showConversationNotification, setShowConversationNotification] =
    useState(false);

  // Handle URL parameters to set active section
  useEffect(() => {
    const section = searchParams.get("section");
    if (
      section &&
      [
        "favorites",
        "testDrives",
        "priceAlerts",
        "inquiries",
        "profile",
      ].includes(section)
    ) {
      setActiveSection(section as CustomerDashboardSection);
    }
  }, [searchParams]);

  // Check for auto-created conversations notification
  useEffect(() => {
    const conversationsCreated = localStorage.getItem(
      "conversationsCreatedCount"
    );
    if (conversationsCreated && parseInt(conversationsCreated) > 0) {
      setShowConversationNotification(true);
      // Clear the notification after showing it
      localStorage.removeItem("conversationsCreatedCount");
    }
  }, []);

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
      case "profile":
        return <CustomerProfilePage />;
      default:
        return <FavoritesSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Auto-created conversations notification */}
      {showConversationNotification && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-green-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  ¡Conversaciones creadas automáticamente!
                </p>
                <p className="text-sm text-green-700">
                  Se han creado conversaciones para tus consultas anteriores. Ve
                  a la sección &quot;Mis Consultas&quot; para verlas.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConversationNotification(false)}
              className="text-green-600 hover:text-green-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex h-screen pt-16">
        {/* Responsive Sidebar */}
        <ResponsiveDashboardSidebar
          activeSection={activeSection}
          onSectionChange={(section) =>
            setActiveSection(section as CustomerDashboardSection)
          }
          userType="customer"
          className="flex-shrink-0"
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {/* Back Button */}
            <div className="mb-6">
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
    </div>
  );
}
