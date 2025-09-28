"use client";

import React from "react";

interface ElectricLoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const ElectricLoader: React.FC<ElectricLoaderProps> = ({
  size = "md",
  text = "Buscando vehículos...",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Electric Animation */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Main Electric Circle */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse"></div>

        {/* Electric Arcs */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>

        {/* Inner Electric Core */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse"></div>

        {/* Electric Sparks */}
        <div
          className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          {text}
        </p>
        <div className="flex justify-center space-x-1 mt-2">
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ElectricLoader;
