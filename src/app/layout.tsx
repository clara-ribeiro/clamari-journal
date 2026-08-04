import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { globalStyles } from "@/styles/stitches.config";
import StitchesRegistry from "./stitches-registry";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "clamari journal",
    template: "%s · clamari journal",
  },
  description:
    "A personal diary to track stories I've watched, followed, and read over time.",
  authors: [{ name: "Clara" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F1419",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  globalStyles();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${instrumentSerif.variable}`}
      >
        <StitchesRegistry>{children}</StitchesRegistry>
      </body>
    </html>
  );
}
