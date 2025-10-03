"use client";

import React, { useState } from "react";
import { MessageAttachment as AttachmentType } from "@/types/messaging";
import { Button } from "@/components/ui/button";
import {
  Download,
  File,
  Image as ImageIcon,
  FileText,
  Archive,
  X,
  Eye,
} from "lucide-react";
import { formatFileSize } from "@/lib/message-storage";

interface MessageAttachmentProps {
  attachment: AttachmentType;
  isOwn: boolean;
  onRemove?: () => void;
  showRemove?: boolean;
}

export function MessageAttachment({
  attachment,
  isOwn,
  onRemove,
  showRemove = false,
}: MessageAttachmentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4" />;
    } else if (fileType.includes("zip") || fileType.includes("rar")) {
      return <Archive className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const getFileIconColor = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return "text-blue-500";
    } else if (fileType.includes("pdf")) {
      return "text-red-500";
    } else if (fileType.includes("zip") || fileType.includes("rar")) {
      return "text-orange-500";
    } else {
      return "text-gray-500";
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);

      // For now, just open the URL in a new tab
      // In a real implementation, you might want to use signed URLs
      window.open(attachment.url, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (attachment.fileType.startsWith("image/")) {
      // Open image in a new tab for preview
      window.open(attachment.url, "_blank");
    } else {
      // For other files, just download
      handleDownload();
    }
  };

  const isImage = attachment.fileType.startsWith("image/");

  return (
    <div
      className={`
      flex items-center space-x-3 p-3 rounded-lg border
      ${isOwn ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}
      max-w-xs
    `}
    >
      {/* File Icon */}
      <div className={`flex-shrink-0 ${getFileIconColor(attachment.fileType)}`}>
        {getFileIcon(attachment.fileType)}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {attachment.fileName}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(attachment.fileSize)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {isImage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>

        {showRemove && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
