import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { parseVehicleCSV, CSVParseResult } from "@/lib/csv-parser";
import { Vehicle } from "@/types";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vehicles: Vehicle[]) => void;
}

type UploadStep = "upload" | "parsing" | "errors" | "success";

export function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadModalProps) {
  const [step, setStep] = useState<UploadStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setStep("upload");
  }, []);

  const handleFileProcess = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setStep("parsing");

    try {
      const csvContent = await file.text();
      const result = parseVehicleCSV(csvContent);

      setParseResult(result);

      if (result.success) {
        setStep("success");
      } else {
        setStep("errors");
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      setStep("errors");
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  const handleRetry = useCallback(() => {
    setFile(null);
    setParseResult(null);
    setStep("upload");
  }, []);

  const handleConfirmUpload = useCallback(() => {
    if (parseResult?.success && parseResult.vehicles.length > 0) {
      onSuccess(parseResult.vehicles);
      onClose();
    }
  }, [parseResult, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    setFile(null);
    setParseResult(null);
    setStep("upload");
    setIsProcessing(false);
    onClose();
  }, [onClose]);

  const renderStepContent = () => {
    switch (step) {
      case "upload":
        return (
          <FileUploadStep
            file={file}
            onFileSelect={handleFileSelect}
            onProcess={handleFileProcess}
            isProcessing={isProcessing}
          />
        );

      case "parsing":
        return <UploadProgressStep fileName={file?.name || ""} />;

      case "errors":
        return (
          <ErrorDisplayStep
            parseResult={parseResult}
            onRetry={handleRetry}
            onClose={handleClose}
          />
        );

      case "success":
        return (
          <SuccessDisplayStep
            parseResult={parseResult}
            onConfirm={handleConfirmUpload}
            onClose={handleClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Carga Masiva de Vehículos
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
}

// File Upload Step Component
interface FileUploadStepProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

function FileUploadStep({
  file,
  onFileSelect,
  onProcess,
  isProcessing,
}: FileUploadStepProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Instrucciones</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Descarga la plantilla CSV para ver el formato correcto</li>
          <li>• Completa todos los campos requeridos</li>
          <li>• Asegúrate de que los valores cumplan con las validaciones</li>
          <li>• El archivo debe tener extensión .csv</li>
        </ul>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          file
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <FileText className="h-8 w-8" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-green-600">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              onClick={onProcess}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Procesando..." : "Procesar Archivo"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Arrastra tu archivo CSV aquí
              </p>
              <p className="text-sm text-gray-500">o</p>
            </div>
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer">
              <FileText className="h-4 w-4 mr-2" />
              Seleccionar archivo
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// Upload Progress Step Component
interface UploadProgressStepProps {
  fileName: string;
}

function UploadProgressStep({ fileName }: UploadProgressStepProps) {
  return (
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Procesando archivo
        </h3>
        <p className="text-sm text-gray-500">{fileName}</p>
      </div>
      <p className="text-sm text-gray-600">
        Validando datos y verificando formato...
      </p>
    </div>
  );
}

// Error Display Step Component
interface ErrorDisplayStepProps {
  parseResult: CSVParseResult | null;
  onRetry: () => void;
  onClose: () => void;
}

function ErrorDisplayStep({
  parseResult,
  onRetry,
  onClose,
}: ErrorDisplayStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <h3 className="text-lg font-medium">Errores encontrados</h3>
      </div>

      {parseResult && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              Se encontraron {parseResult.errors.length} errores que impiden la
              carga. Por favor, corrige estos errores y vuelve a intentar.
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {parseResult.errors.map((error, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded p-3"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      Fila {error.row}, Campo: {error.field}
                    </p>
                    <p className="text-sm text-red-700">{error.message}</p>
                    {error.value && (
                      <p className="text-xs text-red-600 mt-1">
                        Valor: &quot;{error.value}&quot;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {parseResult.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                Advertencias ({parseResult.warnings.length})
              </h4>
              <div className="space-y-1">
                {parseResult.warnings.slice(0, 3).map((warning, index) => (
                  <p key={index} className="text-sm text-yellow-700">
                    • Fila {warning.row}: {warning.message}
                  </p>
                ))}
                {parseResult.warnings.length > 3 && (
                  <p className="text-sm text-yellow-600">
                    ... y {parseResult.warnings.length - 3} advertencias más
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}

// Success Display Step Component
interface SuccessDisplayStepProps {
  parseResult: CSVParseResult | null;
  onConfirm: () => void;
  onClose: () => void;
}

function SuccessDisplayStep({
  parseResult,
  onConfirm,
  onClose,
}: SuccessDisplayStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <h3 className="text-lg font-medium">Archivo procesado exitosamente</h3>
      </div>

      {parseResult && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">
                {parseResult.vehicles.length} vehículos listos para cargar
              </span>
            </div>
            <p className="text-sm text-green-700">
              Todos los datos han sido validados correctamente.
            </p>
          </div>

          {parseResult.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                Advertencias ({parseResult.warnings.length})
              </h4>
              <div className="space-y-1">
                {parseResult.warnings.slice(0, 3).map((warning, index) => (
                  <p key={index} className="text-sm text-yellow-700">
                    • Fila {warning.row}: {warning.message}
                  </p>
                ))}
                {parseResult.warnings.length > 3 && (
                  <p className="text-sm text-yellow-600">
                    ... y {parseResult.warnings.length - 3} advertencias más
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Resumen</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Vehículos válidos:</span>
                <span className="ml-2 font-medium text-green-600">
                  {parseResult.vehicles.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Advertencias:</span>
                <span className="ml-2 font-medium text-yellow-600">
                  {parseResult.warnings.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
          Confirmar Carga
        </Button>
      </div>
    </div>
  );
}
