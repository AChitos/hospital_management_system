import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/layouts/ClientProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Polyclinic Deauville - Healthcare Management System",
  description: "A comprehensive healthcare management system for Polyclinic Deauville to track patients, appointments, prescriptions, and medical records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Add suppressHydrationWarning to avoid errors from browser extensions */}
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ClientProvider>
          {children}
        </ClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
