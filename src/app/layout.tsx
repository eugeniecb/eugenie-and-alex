import type { Metadata } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import PasswordGate from "@/components/PasswordGate";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const pinyonScript = Pinyon_Script({
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
    <html lang="en" className={`${cormorant.variable} ${pinyonScript.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-serif">
        <PasswordGate>
          {/* Garland top-left */}
          <div className="fixed top-[57px] left-0 z-30 pointer-events-none select-none w-40 sm:w-[420px]">
            <Image
              src="/garland.png"
              alt=""
              width={600}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
          {/* Garland bottom-right */}
          <div className="fixed bottom-0 right-0 z-30 pointer-events-none select-none w-40 sm:w-[420px]">
            <Image
              src="/garland-br.png"
              alt=""
              width={600}
              height={600}
              className="w-full h-auto"
            />
          </div>
          <Navigation />
          {children}
        </PasswordGate>
      </body>
    </html>
  );
}
