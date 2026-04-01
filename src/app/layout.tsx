import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Image from "next/image";
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
          {/* Garland — fixed top-left corner, behind all content */}
          <div className="fixed top-0 left-0 z-30 pointer-events-none select-none w-56 sm:w-72">
            <Image
              src="/garland.png"
              alt=""
              width={600}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
          <Navigation />
          {children}
        </PasswordGate>
      </body>
    </html>
  );
}
