import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import Navigation from "./adsidebar/page";
import AuthGuard from "./scourty/gurd";

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

          {/* MAIN LAYOUT WRAPPER */}
          <div className="flex min-h-screen">

            {/* Sidebar */}
            <Navigation />

            {/* Main Content */}
            <main className="ml-[240px] w-[calc(100vw-260px)] min-h-screen">
              {children}
            </main>

          </div>

        </AuthGuard>
      </body>
    </html>
  );
}