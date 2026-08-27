import { RootDocument } from "../root-document";
import { rootMetadata, rootViewport } from "../root-metadata";

export const metadata = {
  ...rootMetadata,
  openGraph: {
    ...rootMetadata.openGraph,
    locale: "pt_BR",
  },
};
export const viewport = rootViewport;

export default function PortugueseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootDocument lang="pt-BR">{children}</RootDocument>;
}
