import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LocationProvider } from "@/context/LocationContext";
import AppShell from "@/components/layout/AppShell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BreatheWise – AI-Powered Urban Air Quality Assistant",
  description:
    "Intelligent urban environmental intelligence platform powered by Google Gemini and Copernicus atmospheric models. Personal daily clean air planning, indoor HEPA protection, and green choices during severe winter smog.",
  keywords: [
    "air quality",
    "winter smog",
    "AQI",
    "CPCB",
    "PM2.5",
    "HEPA air purifier",
    "GenAI assistant",
    "Gemini",
    "Hack2Skill",
    "urban pollution",
  ],
  authors: [{ name: "BreatheWise Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans`}
      >
        <LocationProvider>
          <AppShell>{children}</AppShell>
        </LocationProvider>
      </body>
    </html>
  );
}
