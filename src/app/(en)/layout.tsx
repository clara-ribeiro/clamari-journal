import { RootDocument } from "../root-document";
import { rootMetadata, rootViewport } from "../root-metadata";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
