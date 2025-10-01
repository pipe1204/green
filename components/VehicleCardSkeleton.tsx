"use client";

import React from "react";
import { Zap } from "lucide-react";

/**
 * Skeleton loader for vehicle cards
 * Displays while vehicles are loading from database
 */
export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Image Skeleton with Spinning Zap */}
      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Zap className="w-12 h-12 text-green-600 animate-spin" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />

        {/* Subtitle Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />

        {/* Price Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />

        {/* Specs Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex space-x-2">
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for vehicle list cards (horizontal layout)
 */
export function VehicleListCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image Skeleton with Spinning Zap */}
        <div className="md:w-80 h-48 md:h-auto bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <Zap className="w-12 h-12 text-green-600 animate-spin" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Render multiple skeleton cards for loading state
 */
export function VehicleSkeletonGrid({
  count = 6,
  viewMode = "grid",
}: {
  count?: number;
  viewMode?: "grid" | "list";
}) {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {Array.from({ length: count }).map((_, index) =>
        viewMode === "list" ? (
          <VehicleListCardSkeleton key={index} />
        ) : (
          <VehicleCardSkeleton key={index} />
        )
      )}
    </div>
  );
}
