import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Navigation from "@/components/Navigation";
import PasswordGate from "@/components/PasswordGate";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Eugénie & Alex",
  description: "We're getting married in Paris — September 6, 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${greatVibes.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-serif">
        <PasswordGate>
          <Navigation />
          {children}
        </PasswordGate>
      </body>
    </html>
  );
}
