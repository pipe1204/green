"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Car, Zap, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Vehículos", href: "/vehiculos", icon: Car },
    { name: "Energía", href: "/energia", icon: Zap },
    { name: "Carga", href: "/carga", icon: Zap },
    { name: "Descubrir", href: "/descubrir", icon: Leaf },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={() => router.push("/")}
                className="text-2xl font-bold text-black hover:text-blue-600 transition-colors duration-200 cursor-pointer"
              >
                GREEN
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <span className="sr-only">Pregunta</span>?
            </Button>
            <Button variant="ghost" size="sm">
              <span className="sr-only">Idioma</span>
              🌍
            </Button>
            <Button variant="ghost" size="sm">
              <span className="sr-only">Usuario</span>
              👤
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 w-full text-left"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="ghost" size="sm">
                    ?
                  </Button>
                  <Button variant="ghost" size="sm">
                    🌍
                  </Button>
                  <Button variant="ghost" size="sm">
                    👤
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
