import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Navigation from "./adsidebar/page";
import AuthGuard from "./scourty/gurd";
import ConditionalLayout from "./ConditionalLayout";

/* Fonts */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Metadata */
export const metadata: Metadata = {
  title: "Car Booking Admin",
  description: "Admin Dashboard Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#020617] min-h-screen`}
      >
        {/* 🔐 AUTH GUARD */}
        <AuthGuard>

          <ConditionalLayout nav={<Navigation />}>
            {children}
          </ConditionalLayout>

        </AuthGuard>
      </body>
    </html>
  );
}