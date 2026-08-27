import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Anton, Instrument_Serif, Monsieur_La_Doulaise } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import AppShell from "@/components/organisms/AppShell";
import StitchesRegistry from "./stitches-registry";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const monsieur = Monsieur_La_Doulaise({
  variable: "--font-monsieur",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // Secondary brand font — defer so Anton (LCP text) wins the network.
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const bivaque = localFont({
  src: "../fonts/CDTBivaque-Regular.otf",
  variable: "--font-bivaque",
  display: "swap",
  weight: "400",
  preload: false,
});

export type RootDocumentProps = {
  lang: string;
  children: ReactNode;
};

export function RootDocument({ lang, children }: RootDocumentProps) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${anton.variable} ${monsieur.variable} ${instrumentSerif.variable} ${bivaque.variable}`}
    >
      <body suppressHydrationWarning>
        <StitchesRegistry>
          <AppShell>{children}</AppShell>
        </StitchesRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
