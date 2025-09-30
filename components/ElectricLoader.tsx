"use client";

import { Zap } from "lucide-react";
import React from "react";

interface ElectricLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const ElectricLoader: React.FC<ElectricLoaderProps> = ({
  text = "Buscando vehículos...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center h-64">
        <Zap className="w-8 h-8 animate-spin text-green-600" />
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          {text}
        </p>
        <div className="flex justify-center space-x-1 mt-2">
          <div
            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ElectricLoader;
