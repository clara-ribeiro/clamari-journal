import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Anton, Instrument_Serif, Monsieur_La_Doulaise } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import AppShell from "@/components/organisms/AppShell";
import { siteCopy } from "@/content/copy";
import { allowSearchIndexing, getSiteUrl } from "@/lib/site-url";
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
  metadataBase: getSiteUrl(),
  title: {
    default: siteCopy.metadata.titleDefault,
    template: siteCopy.metadata.titleTemplate,
  },
  description: siteCopy.metadata.description,
  applicationName: siteCopy.brand.fullName,
  authors: [{ name: siteCopy.metadata.author }],
  robots: allowSearchIndexing()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteCopy.brand.fullName,
    title: siteCopy.metadata.titleDefault,
    description: siteCopy.metadata.description,
    images: [
      {
        url: siteCopy.metadata.ogImage,
        alt: siteCopy.metadata.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteCopy.metadata.titleDefault,
    description: siteCopy.metadata.description,
    images: [siteCopy.metadata.ogImage],
  },
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
          <AppShell>{children}</AppShell>
        </StitchesRegistry>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
