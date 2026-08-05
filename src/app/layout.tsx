import type { Metadata, Viewport } from "next";
import "./globals.css";
import { globalStyles } from "@/styles/stitches.config";
import StitchesRegistry from "./stitches-registry";

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
      <body suppressHydrationWarning>
        <StitchesRegistry>{children}</StitchesRegistry>
      </body>
    </html>
  );
}
