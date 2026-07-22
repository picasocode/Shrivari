import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shri Vaari Electricals Pvt Ltd | EPC, Panel Manufacturing & Electrical Services",
  description: "Professionally managed engineering firm offering EPC solutions, LT & HT panel manufacturing, and electrical services from design to commissioning.",
  keywords: ["Electrical Engineering", "EPC", "LT Panels", "HT Panels", "Panel Manufacturing", "Shri Vaari"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
