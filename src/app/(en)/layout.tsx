import { RootDocument } from "../root-document";
import { rootMetadataFor, rootViewport } from "../root-metadata";

export const metadata = rootMetadataFor("en");
export const viewport = rootViewport;

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
