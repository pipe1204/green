"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, MoreVertical, Archive, X } from "lucide-react";

interface ConversationHeaderProps {
  conversation: {
    subject: string;
    participant: {
      name: string;
      email?: string;
    };
    vehicle: {
      name: string;
      brand: string;
      images: { url: string; alt: string }[];
    };
    status: string;
  };
  onClose?: () => void;
  onBack?: () => void;
  onArchive?: () => void;
  showBackButton?: boolean;
}

export function ConversationHeader({
  conversation,
  onClose,
  onBack,
  onArchive,
  showBackButton = false,
}: ConversationHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getParticipantInitials = () => {
    return conversation.participant.name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getVehicleImage = () => {
    return conversation.vehicle.images?.[0]?.url || null;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      {/* Left side - Back button and conversation info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Back button (mobile) */}
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Vehicle Image */}
        {getVehicleImage() && (
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
            <Image
              src={getVehicleImage()!}
              alt={conversation.vehicle.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        )}

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {conversation.subject}
            </h3>
            <Badge
              variant="secondary"
              className={`text-xs ${getStatusColor(conversation.status)}`}
            >
              {conversation.status}
            </Badge>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                {getParticipantInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{conversation.participant.name}</span>
            <span>•</span>
            <span className="truncate">
              {conversation.vehicle.brand} {conversation.vehicle.name}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-1">
        {/* Archive button */}
        {conversation.status === "open" && onArchive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onArchive}
            className="h-8 w-8 p-0"
          >
            <Archive className="h-4 w-4" />
          </Button>
        )}

        {/* More options */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>

        {/* Close button */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
