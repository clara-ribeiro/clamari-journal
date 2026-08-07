import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Monsieur_La_Doulaise } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SkipLink from "@/components/atoms/SkipLink";
import SiteFooter from "@/components/organisms/SiteFooter";
import SiteHeader from "@/components/organisms/SiteHeader";
import { siteCopy } from "@/content/copy";
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

export const metadata: Metadata = {
  title: {
    default: siteCopy.metadata.titleDefault,
    template: siteCopy.metadata.titleTemplate,
  },
  description: siteCopy.metadata.description,
  authors: [{ name: siteCopy.metadata.author }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteCopy.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${monsieur.variable} ${instrumentSerif.variable} ${bivaque.variable}`}
    >
      <body suppressHydrationWarning>
        <StitchesRegistry>
          <SkipLink />
          <SiteHeader />
          {children}
          <SiteFooter />
        </StitchesRegistry>
      </body>
    </html>
  );
}
