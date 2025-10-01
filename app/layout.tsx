import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { NotificationWrapper } from "@/components/NotificationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Green - Vehículos Eléctricos Sostenibles",
  description:
    "Descubre nuestra línea completa de motocicletas, patinetas y bicicletas eléctricas. Transporte sostenible para un futuro más limpio en Colombia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <NotificationWrapper>{children}</NotificationWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
