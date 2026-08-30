import { RootDocument } from "../root-document";
import { rootMetadataFor, rootViewport } from "../root-metadata";

export const metadata = rootMetadataFor("pt-BR");
export const viewport = rootViewport;

export default function PortugueseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="pt-BR">{children}</RootDocument>;
}
