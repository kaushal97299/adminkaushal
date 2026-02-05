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
      <body className="min-h-screen w-full overflow-hidden bg-black ">

        {/* 🔐 AUTH GUARD */}
        <AuthGuard>

          {/* Sidebar */}
          <Navigation />

          {/* Main Content */}
          <main className="flex-1 md:ml-72 p-5 pb-24 md:pb-6 min-h-screen">
            {children}
          </main>

        </AuthGuard>

      </body>
    </html>
  );
}
