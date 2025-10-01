"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardSidebar } from "./DashboardSidebar";

import { CustomerDashboardSection } from "@/types";
import { FavoritesSection } from "./FavoritesSection";
import { TestDrivesSection } from "./TestDrivesSection";
import { PriceAlertsSection } from "./PriceAlertsSection";
import { InquiriesSection } from "./InquiriesSection";

export function CustomerDashboard() {
  const { user } = useAuth();
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
    <div className="flex">
      {/* Sidebar */}
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={(section) =>
          setActiveSection(section as CustomerDashboardSection)
        }
        userType="customer"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel de Control
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user?.email}. Gestiona tus vehículos favoritos,
              pruebas de manejo y alertas de precio.
            </p>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
