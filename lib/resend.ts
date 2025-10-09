import { Resend } from "resend";

// Initialize Resend client
// Make sure RESEND_API_KEY is set in your .env file
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  // Use dev@resend.dev for testing, or your verified domain in production
  fromEmail: process.env.RESEND_FROM_EMAIL || "dev@resend.dev",
  fromName: "Green - Plataforma de Vehículos Eléctricos",
  replyTo: "notificaciones@green.co",

  // Platform URLs
  platformUrl: process.env.NEXT_PUBLIC_APP_URL || "https://green.co",
  dashboardUrl: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    : "https://green.co/dashboard",
  loginUrl: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/login`
    : "https://green.co/login",
};

// Helper function to format email address
export function formatEmailAddress(name: string, email: string): string {
  return `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`;
}
