"use client";

import React, { useState, useCallback } from "react";
import { MessageAttachment } from "@/types/messaging";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  File,
  Image,
  FileText,
  Archive,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useMessageUpload } from "@/hooks/useMessageUpload";
import { formatFileSize } from "@/lib/message-storage";

interface FileUploadProps {
  onFileSelect: (file: MessageAttachment) => void;
  onClose: () => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export function FileUpload({
  onFileSelect,
  onClose,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "application/zip",
    "application/x-rar-compressed",
  ],
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<MessageAttachment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { uploadFile } = useMessageUpload();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setError(null);

      // Validate files
      const validFiles: File[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        // Check file size
        if (file.size > maxSize) {
          errors.push(
            `${file.name} es demasiado grande (máximo ${formatFileSize(
              maxSize
            )})`
          );
          return;
        }

        // Check file type
        if (!acceptedTypes.includes(file.type)) {
          errors.push(`${file.name} tiene un tipo de archivo no permitido`);
          return;
        }

        // Check max files
        if (validFiles.length >= maxFiles) {
          errors.push(`Máximo ${maxFiles} archivos permitidos`);
          return;
        }

        validFiles.push(file);
      });

      if (errors.length > 0) {
        setError(errors.join(", "));
      }

      setSelectedFiles(validFiles);
    },
    [maxSize, acceptedTypes, maxFiles]
  );

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const result = await uploadFile(file);
        if (!result) {
          throw new Error(`Error al subir ${file.name}`);
        }
        return result;
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...prev, ...results]);

      // Call onFileSelect for each uploaded file
      results.forEach((file) => onFileSelect(file));

      // Reset selected files
      setSelectedFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir archivos");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      // eslint-disable-next-line jsx-a11y/alt-text
      return <Image className="h-4 w-4 text-blue-500" />;
    } else if (file.type.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (file.type.includes("zip") || file.type.includes("rar")) {
      return <Archive className="h-4 w-4 text-orange-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Subir archivos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500">
                Máximo {maxFiles} archivos, {formatFileSize(maxSize)} cada uno
              </p>
            </div>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept={acceptedTypes.join(",")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Archivos seleccionados:
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file)}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSelected(index)}
                      className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadedFiles.length > 0 && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">
                {uploadedFiles.length} archivo(s) subido(s) exitosamente
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            {selectedFiles.length > 0 && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {uploading
                  ? "Subiendo..."
                  : `Subir ${selectedFiles.length} archivo(s)`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
