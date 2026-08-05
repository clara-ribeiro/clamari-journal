import type { Metadata, Viewport } from "next";
import { Anton, Monsieur_La_Doulaise } from "next/font/google";
import "./globals.css";
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
  themeColor: "#021570",
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
      className={`${anton.variable} ${monsieur.variable}`}
    >
      <body suppressHydrationWarning>
        <StitchesRegistry>{children}</StitchesRegistry>
      </body>
    </html>
  );
}
