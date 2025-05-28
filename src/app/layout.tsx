import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/layouts/ClientProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AnesthCare - Anesthesiologist Management System",
  description: "A complete management system for anesthesiologists to track patients, appointments, prescriptions, and medical records",
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
      </body>
    </html>
  );
}
