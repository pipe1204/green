"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Bike,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type DashboardSection = "vehicles" | "analytics" | "messages";

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
  className?: string;
}

const navigationItems = [
  {
    id: "vehicles" as DashboardSection,
    label: "Mis Vehículos",
    icon: Bike,
    description: "Gestiona tu inventario de vehículos",
  },
  {
    id: "analytics" as DashboardSection,
    label: "Analítica",
    icon: BarChart3,
    description: "Métricas y estadísticas (Próximamente)",
    disabled: true,
  },
  {
    id: "messages" as DashboardSection,
    label: "Mensajes",
    icon: MessageSquare,
    description: "Consulta con clientes (Próximamente)",
    disabled: true,
  },
];

export function DashboardSidebar({
  activeSection,
  onSectionChange,
  className,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full",
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
                Panel de Vendedor
              </h2>
              <p className="text-sm text-gray-500">Gestión de inventario</p>
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
              onClick={() => !item.disabled && onSectionChange(item.id)}
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
  );
}
