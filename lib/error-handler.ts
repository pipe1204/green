/**
 * Error handling utilities for vehicle-related operations
 * Provides user-friendly error messages in Spanish
 */

import { PostgrestError } from "@supabase/supabase-js";

/**
 * Standard error response type
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  shouldRetry: boolean;
  isNotFound: boolean;
}

/**
 * Handle Supabase/PostgreSQL errors and return user-friendly messages
 */
export function handleDatabaseError(
  error: PostgrestError | Error | unknown
): ErrorResponse {
  // Handle PostgrestError (Supabase errors)
  if (error && typeof error === "object" && "code" in error) {
    const pgError = error as PostgrestError;

    switch (pgError.code) {
      case "PGRST116":
        return {
          message: "No se encontró el recurso solicitado",
          code: pgError.code,
          shouldRetry: false,
          isNotFound: true,
        };

      case "PGRST301":
        return {
          message: "Error de permisos. Por favor, inicia sesión de nuevo.",
          code: pgError.code,
          shouldRetry: false,
          isNotFound: false,
        };

      case "23505": // Unique violation
        return {
          message: "Este registro ya existe en el sistema",
          code: pgError.code,
          shouldRetry: false,
          isNotFound: false,
        };

      case "23503": // Foreign key violation
        return {
          message: "Error de referencia. Verifica los datos relacionados.",
          code: pgError.code,
          shouldRetry: false,
          isNotFound: false,
        };

      case "23502": // Not null violation
        return {
          message:
            "Faltan campos requeridos. Por favor, completa todos los datos.",
          code: pgError.code,
          shouldRetry: false,
          isNotFound: false,
        };

      default:
        return {
          message: `Error de base de datos: ${
            pgError.message || "Error desconocido"
          }`,
          code: pgError.code,
          shouldRetry: true,
          isNotFound: false,
        };
    }
  }

  // Handle network errors
  if (error instanceof Error) {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return {
        message: "Error de conexión. Verifica tu conexión a internet.",
        shouldRetry: true,
        isNotFound: false,
      };
    }

    if (error.message.includes("timeout")) {
      return {
        message: "La solicitud tardó demasiado. Intenta de nuevo.",
        shouldRetry: true,
        isNotFound: false,
      };
    }

    return {
      message: error.message || "Ocurrió un error inesperado",
      shouldRetry: true,
      isNotFound: false,
    };
  }

  // Unknown error
  return {
    message: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
    shouldRetry: true,
    isNotFound: false,
  };
}

/**
 * Handle vehicle-specific errors
 */
export function handleVehicleError(error: unknown): string {
  const errorResponse = handleDatabaseError(error);

  if (errorResponse.isNotFound) {
    return "Vehículo no encontrado";
  }

  return errorResponse.message;
}

/**
 * Handle vendor-specific errors
 */
export function handleVendorError(error: unknown): string {
  const errorResponse = handleDatabaseError(error);

  if (errorResponse.isNotFound) {
    return "No se encontró tu perfil de vendedor. Contacta soporte.";
  }

  return errorResponse.message;
}

/**
 * Handle authentication errors
 */
export function handleAuthError(error: unknown): string {
  const errorResponse = handleDatabaseError(error);

  if (errorResponse.code === "PGRST301") {
    return "Sesión expirada. Por favor, inicia sesión de nuevo.";
  }

  return "Error de autenticación. Por favor, verifica tus credenciales.";
}

/**
 * Handle form submission errors
 */
export function handleFormError(error: unknown): string {
  const errorResponse = handleDatabaseError(error);

  if (errorResponse.code === "23505") {
    return "Ya existe un registro con estos datos.";
  }

  if (errorResponse.code === "23502") {
    return "Por favor, completa todos los campos requeridos.";
  }

  return "Error al guardar. Por favor, intenta de nuevo.";
}

/**
 * Get user-friendly error message for any error
 */
export function getErrorMessage(
  error: unknown,
  context: string = "operación"
): string {
  const errorResponse = handleDatabaseError(error);

  if (errorResponse.isNotFound) {
    return `No se encontró ${context}`;
  }

  return errorResponse.message || `Error al procesar ${context}`;
}

/**
 * Determine if an error should trigger a retry
 */
export function shouldRetryError(error: unknown): boolean {
  const errorResponse = handleDatabaseError(error);
  return errorResponse.shouldRetry;
}

/**
 * Log error for debugging (can be extended to send to monitoring service)
 */
export function logError(error: unknown, context: string): void {
  console.error(`[${context}]`, error);

  // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
  // if (process.env.NODE_ENV === 'production') {
  //   sentryLog(error, context);
  // }
}
