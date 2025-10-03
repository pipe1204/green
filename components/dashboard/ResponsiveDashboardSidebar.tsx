"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Bike,
  Heart,
  Calendar,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type DashboardSection =
  | "vehicles"
  | "inquiries"
  | "analytics"
  | "messages";
export type CustomerDashboardSection =
  | "favorites"
  | "testDrives"
  | "priceAlerts"
  | "inquiries";

interface ResponsiveDashboardSidebarProps {
  activeSection: DashboardSection | CustomerDashboardSection;
  onSectionChange: (
    section: DashboardSection | CustomerDashboardSection
  ) => void;
  userType?: "vendor" | "customer";
  className?: string;
}

const vendorNavigationItems = [
  {
    id: "vehicles" as DashboardSection,
    label: "Mis Vehículos",
    icon: Bike,
    description: "Gestiona tu inventario de vehículos",
    disabled: false,
  },
  {
    id: "inquiries" as DashboardSection,
    label: "Consultas",
    icon: MessageSquare,
    description: "Mensajes de clientes",
    disabled: false,
  },
  {
    id: "messages" as DashboardSection,
    label: "Mensajes",
    icon: MessageSquare,
    description: "Conversaciones con clientes",
    disabled: false,
  },
  {
    id: "analytics" as DashboardSection,
    label: "Analítica",
    icon: BarChart3,
    description: "Métricas y estadísticas (Próximamente)",
    disabled: true,
  },
];

const customerNavigationItems = [
  {
    id: "favorites" as CustomerDashboardSection,
    label: "Favoritos",
    icon: Heart,
    description: "Vehículos que te interesan",
    disabled: false,
  },
  {
    id: "testDrives" as CustomerDashboardSection,
    label: "Pruebas de Manejo",
    icon: Calendar,
    description: "Pruebas programadas",
    disabled: false,
  },
  {
    id: "priceAlerts" as CustomerDashboardSection,
    label: "Alertas de Precio",
    icon: Bell,
    description: "Notificaciones de precio",
    disabled: false,
  },
  {
    id: "inquiries" as CustomerDashboardSection,
    label: "Mis Consultas",
    icon: MessageSquare,
    description: "Mensajes a vendedores",
    disabled: false,
  },
];

export function ResponsiveDashboardSidebar({
  activeSection,
  onSectionChange,
  userType = "vendor",
  className,
}: ResponsiveDashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems =
    userType === "customer" ? customerNavigationItems : vendorNavigationItems;

  const handleSectionChange = (
    section: DashboardSection | CustomerDashboardSection
  ) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden fixed top-20 right-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div
        data-testid="responsive-dashboard-sidebar"
        className={cn(
          "hidden lg:flex bg-white border-r border-gray-200 transition-all duration-300 flex-col h-full",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {userType === "customer"
                    ? "Panel de Cliente"
                    : "Panel de Vendedor"}
                </h2>
                <p className="text-sm text-gray-500">
                  {userType === "customer"
                    ? "Gestión de favoritos y alertas"
                    : "Gestión de inventario"}
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && handleSectionChange(item.id)}
                disabled={item.disabled}
                className={cn(
                  "w-full flex items-center rounded-lg text-left transition-all duration-200 group",
                  isCollapsed
                    ? "justify-center bg-none border-none"
                    : "space-x-3 px-3 py-3",
                  isActive
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 rounded-md transition-all duration-200",
                    isCollapsed ? "p-2.5" : "p-2",
                    isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-transparent text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.description}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Green Platform</p>
              <p>Versión 1.0</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed top-16 left-0 z-40 w-80 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-300 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {userType === "customer"
                ? "Panel de Cliente"
                : "Panel de Vendedor"}
            </h2>
            <p className="text-sm text-gray-500">
              {userType === "customer"
                ? "Gestión de favoritos y alertas"
                : "Gestión de inventario"}
            </p>
          </div>
        </div>

        {/* Mobile Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && handleSectionChange(item.id)}
                disabled={item.disabled}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group",
                  isActive
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 rounded-md transition-all duration-200 p-2",
                    isActive
                      ? "bg-green-100 text-green-600"
                      : "bg-transparent text-gray-500 group-hover:bg-gray-100 group-hover:text-gray-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Mobile Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Green Platform</p>
            <p>Versión 1.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
