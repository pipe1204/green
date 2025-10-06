"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
